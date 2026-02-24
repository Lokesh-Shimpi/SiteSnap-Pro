const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch');
function compareScreenshots(baselineBuffer, currentBuffer) {
    try {
        const img1 = PNG.sync.read(baselineBuffer);
        const img2 = PNG.sync.read(currentBuffer);
        const { width, height } = img1;
        const diff = new PNG({ width, height });
        const mismatchedPixels = pixelmatch(
            img1.data,
            img2.data,
            diff.data,
            width,
            height,
            { threshold: 0.1 }
        );
        const totalPixels = width * height;
        const diffPercentage = (mismatchedPixels / totalPixels) * 100;
        return {
            mismatchedPixels,
            diffPercentage,
            diffBuffer: PNG.sync.write(diff) 
        };
    } catch (error) {
        console.error('Error comparing screenshots:', error);
        throw new Error('Failed to compare screenshots: ' + error.message);
    }
}
module.exports = { compareScreenshots };
