const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, verifyOtp, resendOtp, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');

const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 72000, // 72 hours
    max: 1, // Limit each IP to 1 signup per 72 hours
    message: { message: "Too many accounts created from this IP, please try again after 72 hours" }
});

router.post('/register', signupLimiter, registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.get('/me', protect, getMe);

module.exports = router;
