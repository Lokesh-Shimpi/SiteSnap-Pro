const express = require('express');
const router = express.Router();
const { getPublicStats } = require('../controllers/statsController');

// GET /api/stats/public
router.get('/public', getPublicStats);

module.exports = router;
