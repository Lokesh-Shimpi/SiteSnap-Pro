const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Add this immediately below to verify the connection on server startup
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Nodemailer Connection Failed: ", error);
    } else {
        console.log("✅ Nodemailer is connected and ready to send emails.");
    }
});

const sendVerificationEmail = async (email, otp) => {
    const mailOptions = {
        from: `"SiteSnap Pro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your SiteSnap Pro Verification Code",
        html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc; text-align: center;">
            <div style="background-color: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 16px;">Welcome to SiteSnap Pro</h1>
                <p style="color: #475569; font-size: 16px; margin-bottom: 32px; line-height: 1.5;">To complete your registration or login, please use the verification code below:</p>
                
                <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                    <span style="font-family: monospace; font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">${otp}</span>
                </div>
                
                <p style="color: #64748b; font-size: 14px; margin-bottom: 0px font-weight: bold;">This code expires in 10 minutes.</p>
                <p style="color: #64748b; font-size: 14px; margin-top: 8px;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        </div>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully! Message ID:", info.messageId);
        return { success: true };
    } catch (emailError) {
        console.error("❌ Failed to send OTP email. SMTP Error:", emailError);
        // We throw an object that the controller can use to return the 500 status
        return { success: false, error: emailError.message };
    }
};

module.exports = {
    sendVerificationEmail
};
