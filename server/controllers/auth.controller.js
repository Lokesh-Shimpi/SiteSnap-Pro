const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const OtpVerification = require('../models/otp.model');
const { sendOTPVerificationEmail } = require('../utils/sendEmail');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Keep only the latest OTP entry per email.
        await OtpVerification.deleteMany({ email: normalizedEmail });
        await OtpVerification.create({
            email: normalizedEmail,
            otp: hashedOtp,
        });

        await sendOTPVerificationEmail(normalizedEmail, otp);

        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Send OTP Error:', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const otpRecord = await OtpVerification.findOne({ email: normalizedEmail })
            .sort({ createdAt: -1 });

        if (!otpRecord) {
            return res.status(400).json({ message: 'OTP expired or not found' });
        }

        const isValidOtp = await bcrypt.compare(String(otp), otpRecord.otp);
        if (!isValidOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        await OtpVerification.deleteMany({ email: normalizedEmail });

        const user = await User.findOne({ email: normalizedEmail });
        let token;

        if (user) {
            if (!user.isVerified) {
                user.isVerified = true;
                await user.save();
            }
            token = generateToken(user._id);
        }

        return res.status(200).json({
            message: 'OTP verified successfully',
            verified: true,
            ...(token ? { token } : {}),
        });
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return res.status(500).json({ message: 'Failed to verify OTP' });
    }
};

module.exports = {
    sendOTP,
    verifyOTP,
};
