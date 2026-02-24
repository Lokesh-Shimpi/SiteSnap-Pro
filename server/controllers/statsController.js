const User = require('../models/User');
const AnalysisHistory = require('../models/AnalysisHistory');

// In-Memory Cache Object
let cachedStats = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * @desc    Get public live stats (Registered Devs, Total Scans, Unique Sites)
 * @route   GET /api/stats/public
 * @access  Public
 * @note    Uses 5-minute in-memory caching to protect the free-tier MongoDB from getting overloaded by homepage visits.
 */
const getPublicStats = async (req, res) => {
    try {
        const now = Date.now();

        // 1. Check if Cache is Valid (Less than 5 minutes old)
        if (cachedStats && (now - lastFetchTime < CACHE_DURATION)) {
            // Return cached data immediately (0ms DB load)
            return res.json(cachedStats);
        }

        // 2. If Cache is Expired, fetch fresh data from MongoDB
        const [registeredUsers, totalScans, uniqueUrls] = await Promise.all([
            User.countDocuments(),
            AnalysisHistory.countDocuments(),
            AnalysisHistory.distinct('url')
        ]);

        const uniqueSitesLength = uniqueUrls ? uniqueUrls.length : 0;

        // 3. Update cachedStats and lastFetchTime
        cachedStats = {
            registeredUsers: registeredUsers || 0,
            totalScans: totalScans || 0,
            uniqueSites: uniqueSitesLength || 0,
            lastUpdatedAt: new Date(now).toISOString()
        };
        lastFetchTime = now;

        // 4. Return the fresh data
        res.json(cachedStats);
    } catch (error) {
        console.error('Error fetching public stats:', error);
        res.status(500).json({ message: 'Server error while fetching metrics' });
    }
};

module.exports = {
    getPublicStats
};
