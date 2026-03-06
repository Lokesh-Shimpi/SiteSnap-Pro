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
        to: email, // Used directly from arguments
        subject: "Your SiteSnap Pro Verification Code",
        html: `<h2>Your OTP is: ${otp}</h2><p>This code expires in 5 minutes.</p>`
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
