const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const mailOptions = {
            from: `"SiteSnap Pro" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verify your SiteSnap Pro Account',
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px; border-radius: 12px;">
                <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); text-align: center;">
                    <h1 style="color: #0f172a; font-size: 24px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px;">SiteSnap Pro</h1>
                    <p style="color: #64748b; font-size: 16px; margin-bottom: 32px; line-height: 1.5;">Welcome to the most advanced infrastructure monitoring platform.</p>
                    
                    <div style="margin-bottom: 24px;">
                        <span style="display: block; font-size: 14px; color: #475569; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">Your Verification Code</span>
                        <div style="background-color: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; display: inline-block;">
                            <span style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; color: #4f46e5; letter-spacing: 4px;">${otp}</span>
                        </div>
                    </div>
                    
                    <p style="color: #ef4444; font-size: 14px; font-weight: 500; margin-bottom: 32px;">This code expires in 10 minutes.</p>
                    
                    <div style="border-top: 1px solid #e2e8f0; padding-top: 24px;">
                        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">If you didn't request this email, there's nothing to worry about — you can safely ignore it.</p>
                        <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin-top: 8px;">&copy; ${new Date().getFullYear()} SiteSnap Pro. All rights reserved.</p>
                    </div>
                </div>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail
};
