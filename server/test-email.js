require('dotenv').config({ override: true });
const nodemailer = require('nodemailer');

async function testMail() {
    console.log("Testing with User:", process.env.EMAIL_USER);
    console.log("Testing with Pass length:", process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: 'Test Authentication',
            text: 'If you receive this, your Google App Password is 100% fully working!'
        });

        console.log("SUCCESS! Email sent. ID:", info.messageId);
        process.exit(0);
    } catch (err) {
        console.error("FAILED! Error from Google:", err.message);
        process.exit(1);
    }
}

testMail();
