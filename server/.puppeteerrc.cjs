const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    // Use a custom directory instead of .cache because Render's build system 
    // explicitly excludes any directory named .cache when packaging the app for deployment!
    cacheDirectory: join(__dirname, '.puppeteer-browsers'),
};
