const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendVerificationEmail } = require('../utils/emailService');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    let { username, email, password } = req.body;
    if (email) email = email.toLowerCase();
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        if (!userExists.isVerified) {
            return res.status(400).json({ message: 'User already exists but is unverified. Please log in to request a new OTP.' });
        }
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({
        username,
        email,
        password,
        isVerified: false
    });

    if (user) {
        // Generate 6-digit OTP
        const otpString = Math.floor(100000 + Math.random() * 900000).toString();

        // Hash the OTP
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otpString, salt);

        // Save to DB
        await Otp.create({
            email,
            otp: hashedOtp
        });

        // Send email
        const emailResult = await sendVerificationEmail(email, otpString);

        if (!emailResult.success) {
            // Rollback DB writes since email delivery failed completely
            await User.findByIdAndDelete(user._id);
            await Otp.deleteMany({ email });
            return res.status(500).json({ message: emailResult.error || 'Failed to send verification code. Check email configuration.' });
        }

        res.status(200).json({
            message: 'User registered. Pick up your OTP from your email.'
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const verifyOtp = async (req, res) => {
    let { email, otp } = req.body;
    if (email) email = email.toLowerCase();

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const otpRecord = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!otpRecord) {
        return res.status(400).json({ message: 'OTP expired or not found. Please resend.' });
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    await Otp.deleteMany({ email });

    res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
    });
};

const resendOtp = async (req, res) => {
    let { email } = req.body;
    if (email) email = email.toLowerCase();

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    if (user.isVerified) {
        return res.status(400).json({ message: 'User is already verified' });
    }

    // Generate new 6-digit OTP
    const otpString = Math.floor(100000 + Math.random() * 900000).toString();

    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otpString, salt);

    // Delete any existing OTPs for this email to avoid confusion and clutter
    await Otp.deleteMany({ email });

    await Otp.create({
        email,
        otp: hashedOtp
    });

    const emailResult = await sendVerificationEmail(email, otpString);

    if (!emailResult.success) {
        return res.status(500).json({ message: emailResult.error || 'Backend Error: Failed to send OTP.' });
    }

    res.status(200).json({ message: 'OTP sent successfully' });
};

const loginUser = async (req, res) => {
    let { email, password } = req.body;
    if (email) email = email.toLowerCase();
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            return res.status(403).json({
                message: 'Please verify your email address to log in.',
                notVerified: true
            });
        }

        res.json({
            _id: user.id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
};
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};
module.exports = {
    registerUser,
    loginUser,
    getMe,
    verifyOtp,
    resendOtp
};
