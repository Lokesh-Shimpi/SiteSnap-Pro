const sendVerificationEmail = async (email, otp) => {
    try {
        // We use the Resend HTTP API over standard Port 443 instead of Nodemailer (Ports 465/587).
        // Render blocks SMTP ports on free tiers, but completely allows HTTP fetch requests!

        // IMPORTANT: If you don't use Resend, you can swap this fetch URL with Brevo, SendGrid, or Mailgun HTTPS APIs.
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // For a completely free Resend account without domain verification, you must keep this 'from' exactly as is.
                from: 'SiteSnap Pro <onboarding@resend.dev>',
                to: email,
                subject: 'Verify your SiteSnap Pro Account',
                html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; padding: 40px 20px;">
                    <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; text-align: center;">
                        <h1 style="color: #0f172a; margin-bottom: 8px;">SiteSnap Pro</h1>
                        <p style="color: #64748b; margin-bottom: 32px;">Welcome to the platform.</p>
                        
                        <div style="margin-bottom: 24px;">
                            <span style="font-weight: 600;">Your Verification Code</span>
                            <div style="background-color: #f1f5f9; padding: 16px; margin-top: 10px;">
                                <span style="font-size: 32px; font-weight: 700; color: #4f46e5; letter-spacing: 4px;">${otp}</span>
                            </div>
                        </div>
                        <p style="color: #ef4444; font-size: 14px;">This code expires in 10 minutes.</p>
                    </div>
                </div>
                `
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('Verification email sent via HTTP API successfully');
            return { success: true };
        } else {
            console.error('HTTP Email API Error:', data);
            return { success: false, error: 'Email Delivery Failed: ' + (data.message || 'Unknown API Error') };
        }

    } catch (error) {
        console.error('Error sending verification email via HTTP:', error);
        return { success: false, error: 'Network Error: ' + error.message };
    }
};

module.exports = {
    sendVerificationEmail
};
