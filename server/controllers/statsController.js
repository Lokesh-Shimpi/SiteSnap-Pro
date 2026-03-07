const User = require('../models/User');
const AnalysisHistory = require('../models/AnalysisHistory');

// Cache configuration
let cachedStats = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 300000; // 5 minutes

/**
 * @desc    Get public usage statistics for the homepage
 * @route   GET /api/stats/public
 * @access  Public
 * @note    Uses a 5-minute in-memory cache mechanism to protect the database from
 *          being overwhelmed by frequent homepage visits.
 */
const getPublicStats = async (req, res) => {
    try {
        const now = Date.now();

        // 1. Check if cache is valid (less than 5 minutes old)
        if (cachedStats && (now - lastFetchTime < CACHE_DURATION_MS)) {
            return res.status(200).json(cachedStats);
        }

        // 2. Cache is expired or doesn't exist, run database queries in parallel
        const [registeredUsers, totalScans, uniqueWebsitesData] = await Promise.all([
            User.countDocuments(),
            AnalysisHistory.countDocuments(),
            AnalysisHistory.distinct('url')
        ]);

        const uniqueWebsites = uniqueWebsitesData.length;

        // 3. Update cache
        cachedStats = {
            registeredUsers: registeredUsers || 0,
            totalScans: totalScans || 0,
            uniqueWebsites: uniqueWebsites || 0
        };
        lastFetchTime = now;

        // 4. Return fresh data
        res.status(200).json(cachedStats);
    } catch (error) {
        console.error("Error fetching public stats:", error);
        res.status(500).json({ message: "Server Error fetching stats" });
    }
};

module.exports = {
    getPublicStats
};
