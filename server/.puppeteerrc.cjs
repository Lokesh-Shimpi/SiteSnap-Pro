const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Use a non-dot directory name to absolutely ensure Render copies it from Build to Run
    cacheDirectory: join(__dirname, 'puppeteer-cache-dir'),
};
