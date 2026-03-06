const { simulateGlobalPing, resolveIP } = require('../utils/pingSimulator');
const { getGlobalLatency: fetchGlobalLatency } = require('../utils/pingOrchestrator');
const AnalysisHistory = require('../models/AnalysisHistory');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const puppeteer = require('puppeteer-core');
const getSSLInfo = (url) => {
    return new Promise((resolve) => {
        if (!url.startsWith('https')) {
            return resolve({ valid: false, issuer: 'N/A', daysRemaining: -1, validFrom: 'N/A' });
        }
        const req = https.request(url, { method: 'HEAD', agent: new https.Agent({ maxCachedSessions: 0 }) }, (res) => {
            try {
                const cert = res.connection.getPeerCertificate();
                if (!cert || Object.keys(cert).length === 0) {
                    return resolve({ valid: false, issuer: 'Unknown', daysRemaining: 0, validFrom: 'N/A' });
                }
                const validTo = new Date(cert.valid_to);
                const validFrom = new Date(cert.valid_from);
                const daysRemaining = Math.floor((validTo - Date.now()) / (1000 * 60 * 60 * 24));
                resolve({
                    valid: daysRemaining > 0,
                    issuer: cert.issuer.O || cert.issuer.CN,
                    daysRemaining,
                    validFrom: validFrom.toISOString().split('T')[0]
                });
            } catch (e) {
                resolve({ valid: false, issuer: 'Error', daysRemaining: 0, validFrom: 'N/A' });
            }
        });
        req.on('error', () => resolve({ valid: false, issuer: 'Error', daysRemaining: 0, validFrom: 'N/A' }));
        req.end();
    });
};
const calculateCarbonEmissions = (pageSizeInMB) => {
    if (typeof pageSizeInMB !== 'number' || isNaN(pageSizeInMB)) return null;
    const sizeInGB = pageSizeInMB / 1024;
    const energyKWh = sizeInGB * 0.81;
    const carbonGrams = energyKWh * 442;
    return parseFloat(carbonGrams.toFixed(2));
};
const getPagePerformance = async (url) => {
    let browser = null;
    try {
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSERLESS_API_KEY}`
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1366, height: 768 });
        let requestCount = 0;
        let totalBytes = 0;
        page.on('response', async (response) => {
            requestCount++;
            try {
                const headers = response.headers();
                if (headers['content-length']) {
                    totalBytes += parseInt(headers['content-length'], 10);
                }
            } catch (e) { }
        });
        const start = Date.now();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
        const loadTime = (Date.now() - start) / 1000;
        const pageSizeMbNum = totalBytes / (1024 * 1024);
        return {
            loadTime: loadTime.toFixed(2),
            requestCount,
            pageSizeMb: pageSizeMbNum.toFixed(2),
            carbonFootprintGrams: calculateCarbonEmissions(pageSizeMbNum)
        };
    } catch (error) {
        console.error('Puppeteer Performance Check Error:', error);
        return { loadTime: 0, requestCount: 0, pageSizeMb: 0, carbonFootprintGrams: null };
    } finally {
        if (browser) await browser.close();
    }
};
const analyzeUrl = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }
    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
        targetUrl = `https://${targetUrl}`;
    }
    let responseSent = false;
    try {
        const parsedUrl = new URL(targetUrl);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;
        const start = Date.now();
        const sslPromise = getSSLInfo(targetUrl);
        const perfPromise = getPagePerformance(targetUrl);
        const request = protocol.request(targetUrl, { method: 'HEAD', timeout: 5000 }, async (response) => {
            if (responseSent) return;
            try {
                const latency = Date.now() - start;
                const ip = await resolveIP(targetUrl);
                const globalMetrics = [];
                const [sslInfo, perfInfo] = await Promise.all([sslPromise, perfPromise]);
                const result = {
                    url: targetUrl,
                    status: response.statusCode >= 200 && response.statusCode < 400 ? 'Online' : 'Offline',
                    statusCode: response.statusCode,
                    latency: latency,
                    ip: ip,
                    globalMetrics: globalMetrics,
                    vitals: {
                        ssl: sslInfo,
                        performance: perfInfo
                    }
                };
                if (req.user) {
                    AnalysisHistory.create({
                        user: req.user._id,
                        url: targetUrl,
                        metrics: result
                    }).catch(err => console.error('Error saving history:', err));
                }
                if (!responseSent) {
                    responseSent = true;
                    res.json(result);
                }
            } catch (processingError) {
                console.error('Processing error:', processingError);
                if (!responseSent) {
                    responseSent = true;
                    res.status(500).json({ message: 'Error processing analysis results', error: processingError.message });
                }
            }
        });
        request.on('error', (err) => {
            if (responseSent) return;
            responseSent = true;
            res.json({
                url: targetUrl,
                status: 'Offline',
                latency: 0,
                error: err.message,
                globalMetrics: [],
                vitals: null
            });
        });
        request.on('timeout', () => {
            if (responseSent) return;
            responseSent = true;
            request.destroy();
            res.json({
                url: targetUrl,
                status: 'Offline',
                latency: 5000,
                error: 'Timeout',
                globalMetrics: [],
                vitals: null
            });
        });
        request.end();
    } catch (error) {
        if (!responseSent) {
            res.status(400).json({ message: 'Invalid URL', error: error.message });
        }
    }
};
const getHistory = async (req, res) => {
    try {
        const history = await AnalysisHistory.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getGlobalLatency = async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }
    try {
        const results = await fetchGlobalLatency(url);
        res.json({ success: true, results });
    } catch (error) {
        console.error('Master try/catch getGlobalLatency error:', error);
        // Guarantee the React frontend always receives a valid Array
        res.json({
            success: true,
            results: [{
                location: "Primary Server (Degraded Mode)",
                status: "Down",
                ip: "N/A",
                packetLoss: "100%",
                min: "N/A",
                avg: "N/A",
                max: "N/A"
            }]
        });
    }
};

module.exports = { analyzeUrl, getHistory, getGlobalLatency };
