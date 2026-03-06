const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpVerification = require('../models/otp.model');
const { sendOTPVerificationEmail } = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const createAndSendOtp = async ({ email, purpose, payload = null }) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    await OtpVerification.deleteMany({ email, purpose });
    await OtpVerification.create({
        email,
        otp: hashedOtp,
        purpose,
        payload,
    });

    await sendOTPVerificationEmail(email, otp);
};

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        await createAndSendOtp({
            email: normalizedEmail,
            purpose: 'signup',
            payload: {
                username,
                password,
            },
        });

        return res.status(200).json({
            message: 'OTP sent to your email. Please verify to complete signup.',
            requiresOtp: true,
            purpose: 'signup',
            email: normalizedEmail,
        });
    } catch (error) {
        console.error('Register OTP Init Error:', error);
        return res.status(500).json({ message: 'Failed to initiate signup verification' });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        await createAndSendOtp({
            email: normalizedEmail,
            purpose: 'login',
            payload: null,
        });

        return res.status(200).json({
            message: 'OTP sent to your email. Please verify to login.',
            requiresOtp: true,
            purpose: 'login',
            email: normalizedEmail,
        });
    } catch (error) {
        console.error('Login OTP Init Error:', error);
        return res.status(500).json({ message: 'Failed to initiate login verification' });
    }
};

const getMe = async (req, res) => {
    return res.status(200).json(req.user);
};

const sendOTP = async (req, res) => {
    try {
        const { email, purpose = 'login', username, password } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!['signup', 'login'].includes(purpose)) {
            return res.status(400).json({ message: 'Invalid OTP purpose' });
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (purpose === 'signup') {
            if (!username || !password) {
                return res.status(400).json({ message: 'Username and password are required for signup OTP' });
            }

            const existingUser = await User.findOne({ email: normalizedEmail });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            await createAndSendOtp({
                email: normalizedEmail,
                purpose: 'signup',
                payload: { username, password },
            });
        } else {
            await createAndSendOtp({
                email: normalizedEmail,
                purpose: 'login',
                payload: null,
            });
        }

        return res.status(200).json({ message: 'OTP sent successfully', purpose });
    } catch (error) {
        console.error('Send OTP Error:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp, purpose } = req.body;

        if (!email || !otp || !purpose) {
            return res.status(400).json({ message: 'Email, OTP and purpose are required' });
        }

        if (!['signup', 'login'].includes(purpose)) {
            return res.status(400).json({ message: 'Invalid OTP purpose' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const otpRecord = await OtpVerification.findOne({ email: normalizedEmail, purpose })
            .sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        const isValidOtp = await bcrypt.compare(String(otp), otpRecord.otp);
        if (!isValidOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        let user;

        if (purpose === 'signup') {
            const userExists = await User.findOne({ email: normalizedEmail });
            if (userExists) {
                await OtpVerification.deleteMany({ email: normalizedEmail, purpose: 'signup' });
                return res.status(400).json({ message: 'User already exists' });
            }

            const { username, password } = otpRecord.payload || {};
            if (!username || !password) {
                return res.status(400).json({ message: 'Signup session expired. Please sign up again.' });
            }

            user = await User.create({
                username,
                email: normalizedEmail,
                password,
                isVerified: true,
            });
        } else {
            user = await User.findOne({ email: normalizedEmail });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
        }

        await OtpVerification.deleteMany({ email: normalizedEmail, purpose });

        const token = generateToken(user._id);

        return res.status(200).json({
            message: 'OTP verified successfully',
            verified: true,
            token,
            user: {
                _id: user.id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

const resendOTP = async (req, res) => {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({ message: 'Email and purpose are required' });
        }

        if (!['signup', 'login'].includes(purpose)) {
            return res.status(400).json({ message: 'Invalid OTP purpose' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const latestRecord = await OtpVerification.findOne({ email: normalizedEmail, purpose })
            .sort({ createdAt: -1 });

        if (!latestRecord) {
            return res.status(400).json({ message: 'No active OTP session found. Please start again.' });
        }

        await createAndSendOtp({
            email: normalizedEmail,
            purpose,
            payload: latestRecord.payload || null,
        });

        return res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Resend OTP Error:', error);
        return res.status(500).json({ message: 'Failed to resend OTP' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    sendOTP,
    verifyOTP,
    resendOTP,
};
