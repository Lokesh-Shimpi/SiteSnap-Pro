const fs = require('fs');
const puppeteer = require('puppeteer-core');
const Project = require('../models/Project');
const { compareScreenshots } = require('../utils/visualDiff');
const { aiDiagnostics } = require('../utils/aiDiagnostics');
exports.createProject = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ message: 'URL is required' });
        let project = await Project.findOne({ url, user: req.user._id });
        if (!project) {
            project = new Project({ url, user: req.user._id });
            await project.save();
        }
        res.status(201).json(project);
    } catch (error) {
        console.error('Create Project Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user._id }).select('-baselineScreenshot -lastScreenshot');
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user._id }).select('url status lastChecked lastCheckResult.visualDiffPercentage');
        res.json(projects);
    } catch (error) {
        console.error('Get Projects Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProjectImage = async (req, res) => {
    try {
        const { id, type } = req.params;
        const project = await Project.findById(id);
        if (!project) return res.status(404).send('Project not found');
        let imageBuffer = null;
        if (type === 'baseline') {
            imageBuffer = project.baselineScreenshot;
        } else if (type === 'current') {
            imageBuffer = project.lastScreenshot || project.baselineScreenshot;
        }
        if (!imageBuffer) return res.status(404).send('Image not found');
        res.set('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (error) {
        console.error('Image Serve Error:', error);
        res.status(500).send('Error serving image');
    }
};
exports.checkProject = async (req, res) => {
    const { id } = req.params;
    let browser = null;
    let page = null;
    try {
        const project = await Project.findOne({ _id: id, user: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`
        });
        page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 800 });
        let httpStatus = 0;
        let targetUrl = project.url;
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = `https://${targetUrl}`;
        }
        try {
            const response = await page.goto(targetUrl, {
                waitUntil: 'networkidle2',
                timeout: 30000
            });
            httpStatus = response ? response.status() : 0;
        } catch (navError) {
            console.error(`Navigation error for ${project.url}:`, navError);
            httpStatus = 0;
        }
        const currentBuffer = await page.screenshot({ fullPage: true });
        let checkResult = {
            httpStatus,
            visualDiffPercentage: 0,
            diagnosis: null
        };
        let newStatus = 'Healthy';
        if (project.baselineScreenshot && project.baselineScreenshot.length > 0) {
            try {
                const diffResult = compareScreenshots(project.baselineScreenshot, currentBuffer);
                checkResult.visualDiffPercentage = diffResult.diffPercentage;
                const isVisualRegressed = diffResult.diffPercentage > 10;
                const isHttpFailure = httpStatus >= 400 || httpStatus === 0;
                if (isVisualRegressed || isHttpFailure) {
                    newStatus = isHttpFailure ? 'Down' : 'Silent Failure';
                    console.log(`Triggering AI Doctor for ${project.url}...`);
                    const diagnosis = await aiDiagnostics(
                        project.url,
                        httpStatus,
                        diffResult.diffPercentage
                    );
                    checkResult.diagnosis = diagnosis;
                }
            } catch (diffError) {
                console.error('Visual Diff Error:', diffError);
                checkResult.diagnosis = { diagnosis: "Visual comparison failed.", actionSteps: [] };
            }
        } else {
            project.baselineScreenshot = currentBuffer;
            console.log(`Setting baseline for ${project.url}`);
        }
        project.lastChecked = new Date();
        project.status = newStatus;
        project.lastCheckResult = checkResult;
        project.lastScreenshot = currentBuffer;
        await project.save();
        res.json({
            message: 'Check completed',
            data: {
                status: newStatus,
                ...checkResult,
            }
        });
    } catch (error) {
        console.error('Monitor Controller Error:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findOneAndDelete({ _id: id, user: req.user._id });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Delete Project Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
