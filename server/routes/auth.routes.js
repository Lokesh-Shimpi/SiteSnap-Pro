const express = require('express');

const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/auth.controller');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
