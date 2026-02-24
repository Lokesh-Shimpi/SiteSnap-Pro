const express = require('express');
// CRITICAL: Force Puppeteer Cache Dir on Render before importing Puppeteer
if (process.env.RENDER === 'true') {
  process.env.PUPPETEER_CACHE_DIR = '/opt/render/project/puppeteer';
}
const puppeteer = require('puppeteer');
const cors = require('cors');
const connectDB = require('./config/db');

require('dotenv').config();

connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tool', require('./routes/toolRoutes'));
app.use('/api/monitor', require('./routes/monitorRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

const { protect } = require('./middleware/authMiddleware');

// Centralized Screenshot Route
app.get('/api/screenshot', async (req, res) => {
  const { url, view } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let targetUrl = url;
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  let browser = null;
  try {
    const isRender = process.env.RENDER === 'true';
    const launchArgs = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
    ];

    if (isRender) {
      launchArgs.push('--single-process');
    }

    const puppeteerOptions = {
      headless: 'new',
      args: launchArgs,
      ignoreHTTPSErrors: true,
    };

    let execPath = process.env.PUPPETEER_EXECUTABLE_PATH;
    if (!execPath && isRender) {
      try {
        const { execSync } = require('child_process');
        // Find any file named 'chrome' in the project directory, bypassing caching bugs
        execPath = execSync('find /opt/render/project -type f -name chrome | head -1').toString().trim();
      } catch (err) {
        console.error("Warning: could not dynamically find chrome binary", err);
      }
    }

    if (execPath) {
      puppeteerOptions.executablePath = execPath;
    }

    browser = await puppeteer.launch(puppeteerOptions);

    const page = await browser.newPage();

    if (view === 'mobile') {
      await page.setViewport({ width: 375, height: 812, isMobile: true, hasTouch: true });
    } else {
      await page.setViewport({ width: 1920, height: 1080 });
    }

    await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1000));

    const screenshotBuffer = await page.screenshot({ encoding: 'binary', type: 'png' });

    res.set('Content-Type', 'image/png');
    res.send(screenshotBuffer);

  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).json({ error: 'Failed to capture screenshot', details: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});