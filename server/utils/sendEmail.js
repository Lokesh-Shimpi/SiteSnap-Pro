const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || 'false') === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendOTPVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: `"SiteSnap Pro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your SiteSnap Pro Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc;">
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
                    <h2 style="margin: 0 0 8px; color: #0f172a;">Verify your email address</h2>
                    <p style="margin: 0 0 16px; color: #475569; line-height: 1.5;">
                        Use the one-time password below to continue your authentication flow.
                    </p>
                    <div style="display: inline-block; padding: 12px 18px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px;">
                        <span style="font-size: 30px; letter-spacing: 6px; color: #1d4ed8; font-weight: 700; font-family: 'Courier New', monospace;">${otp}</span>
                    </div>
                    <p style="margin: 16px 0 0; color: #dc2626; font-size: 14px;">
                        This code expires in 5 minutes.
                    </p>
                    <p style="margin: 16px 0 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                        If you did not request this code, you can safely ignore this email.
                    </p>
                </div>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendOTPVerificationEmail,
};
