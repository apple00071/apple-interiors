const { Resend } = require('resend');
require('dotenv').config();

async function testEmail() {
    try {
        console.log('🚀 Testing Resend API with new configuration...');
        
        // Check if API key is loaded
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY not found in environment variables');
        }
        
        console.log('✅ API key loaded from environment');
        
        const resend = new Resend(process.env.RESEND_API_KEY);
        
        console.log('📤 Sending test email...');
        
        const { data, error } = await resend.emails.send({
            from: 'Apple Interiors <noreply@appleinteriors.in>',
            to: ['aravind.bandaru@appleinteriors.in'],
            subject: 'Test Email - New Resend Setup',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2c3e50;">✅ Email Service Test Successful!</h2>
                    <p>This is a test email from the newly configured Apple Interiors email service.</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h3>Test Details:</h3>
                        <p><strong>API Key:</strong> ${process.env.RESEND_API_KEY.substring(0, 10)}...</p>
                        <p><strong>From Email:</strong> noreply@appleinteriors.in</p>
                        <p><strong>Test Time:</strong> ${new Date().toISOString()}</p>
                    </div>
                    <p>If you received this email, the email service is working correctly!</p>
                </div>
            `
        });

        if (error) {
            console.error('❌ Error sending email:', error);
            return;
        }

        console.log('✅ Test email sent successfully!');
        console.log('📧 Email ID:', data.id);
        console.log('📬 Check your inbox at: aravind.bandaru@appleinteriors.in');
        
    } catch (err) {
        console.error('❌ Test failed:', err.message);
        console.error('Full error:', err);
    }
}

testEmail();
