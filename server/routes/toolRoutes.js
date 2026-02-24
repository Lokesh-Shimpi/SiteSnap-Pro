const express = require('express');
const router = express.Router();
const { analyzeUrl, getHistory, getGlobalLatency } = require('../controllers/toolController');
const { protect } = require('../middleware/authMiddleware');
router.get('/analyze', protect, analyzeUrl);
router.get('/global-ping', protect, getGlobalLatency);
router.get('/history', protect, getHistory);
module.exports = router;
