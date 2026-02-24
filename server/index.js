const express = require('express');
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

    // Only override if explicitly set in .env
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      puppeteerOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
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