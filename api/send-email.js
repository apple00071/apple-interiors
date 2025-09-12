// Vercel Serverless Function for Resend API
// This file handles email sending securely on the server side

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { formData } = req.body;

        // Validate required fields
        if (!formData || !formData.name || !formData.email || !formData.phone) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Resend API configuration
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        if (!RESEND_API_KEY) {
            return res.status(500).json({ error: 'Resend API key not configured' });
        }
        const FROM_EMAIL = 'noreply@appleinteriors.in'; // You'll need to verify this domain
        const ADMIN_EMAIL = 'aravind.bandaru@appleinteriors.in';

        // Send admin notification email
        const adminEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `Apple Interiors Website <${FROM_EMAIL}>`,
                to: [ADMIN_EMAIL],
                subject: `New Inquiry from Apple Interiors Website - ${formData.name}`,
                html: generateAdminEmailTemplate(formData)
            })
        });

        // Send customer confirmation email
        const customerEmailResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: `Apple Interiors <${FROM_EMAIL}>`,
                to: [formData.email],
                subject: `Thank you for contacting Apple Interiors - ${formData.name}`,
                html: generateCustomerEmailTemplate(formData)
            })
        });

        const adminSuccess = adminEmailResponse.ok;
        const customerSuccess = customerEmailResponse.ok;

        if (adminSuccess || customerSuccess) {
            res.status(200).json({ 
                success: true, 
                adminEmailSent: adminSuccess,
                customerEmailSent: customerSuccess,
                message: 'Emails sent successfully' 
            });
        } else {
            const adminError = await adminEmailResponse.json();
            const customerError = await customerEmailResponse.json();
            
            res.status(500).json({ 
                error: 'Failed to send emails',
                adminError,
                customerError
            });
        }

    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Generate admin email template
function generateAdminEmailTemplate(formData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Inquiry - Apple Interiors</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Inquiry Received</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Apple Interiors Website</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #eab308; margin-top: 0;">Customer Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #eab308;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
                        <td style="padding: 8px 0;">${formData.name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                        <td style="padding: 8px 0;"><a href="mailto:${formData.email}" style="color: #eab308;">${formData.email}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                        <td style="padding: 8px 0;"><a href="tel:${formData.phone}" style="color: #eab308;">${formData.phone}</a></td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Property Type:</td>
                        <td style="padding: 8px 0;">${formData.type || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                        <td style="padding: 8px 0;">${formData.location || 'Not specified'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px 0; font-weight: bold;">Budget:</td>
                        <td style="padding: 8px 0;">${formData.budget || 'Not specified'}</td>
                    </tr>
                </table>
            </div>
            
            ${formData.message ? `
            <h3 style="color: #eab308;">Message:</h3>
            <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #eab308;">
                <p style="margin: 0; white-space: pre-wrap;">${formData.message}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 20px; background: #eab308; color: white; text-align: center; border-radius: 8px;">
                <h3 style="margin: 0 0 10px 0;">Action Required</h3>
                <p style="margin: 0;">Please respond to this inquiry within 24 hours for the best customer experience.</p>
            </div>
            
            <div style="margin-top: 20px; text-align: center;">
                <a href="mailto:${formData.email}" style="display: inline-block; background: #eab308; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px;">Reply via Email</a>
                <a href="tel:${formData.phone}" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px;">Call Customer</a>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p>This email was sent from the Apple Interiors website contact form.</p>
            <p>Apple Interiors | Kukatpally, Hyderabad | +91 9603 9603 37</p>
        </div>
    </body>
    </html>
    `;
}

// Generate customer confirmation email template
function generateCustomerEmailTemplate(formData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting Apple Interiors</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">We've received your inquiry</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #eab308; margin-top: 0;">Dear ${formData.name},</h2>
            
            <p style="font-size: 16px; margin-bottom: 20px;">Thank you for your interest in Apple Interiors! We're excited to help you transform your space into something extraordinary.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #eab308;">
                <h3 style="color: #eab308; margin-top: 0;">Your Inquiry Details:</h3>
                <ul style="list-style: none; padding: 0;">
                    ${formData.type ? `<li style="padding: 5px 0;"><strong>Property Type:</strong> ${formData.type}</li>` : ''}
                    ${formData.location ? `<li style="padding: 5px 0;"><strong>Location:</strong> ${formData.location}</li>` : ''}
                    ${formData.budget ? `<li style="padding: 5px 0;"><strong>Budget:</strong> ${formData.budget}</li>` : ''}
                </ul>
            </div>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #22c55e; margin-top: 0;">What Happens Next?</h3>
                <ol style="margin: 0; padding-left: 20px;">
                    <li style="margin-bottom: 10px;">Our design expert will review your requirements</li>
                    <li style="margin-bottom: 10px;">We'll contact you within 24 hours to discuss your project</li>
                    <li style="margin-bottom: 10px;">Schedule a free consultation at your convenience</li>
                    <li style="margin-bottom: 10px;">Receive a customized design proposal</li>
                </ol>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="color: #eab308; margin-top: 0;">Need Immediate Assistance?</h3>
                <p style="margin-bottom: 20px;">Don't wait! Contact us directly for faster response:</p>
                
                <div style="margin: 20px 0;">
                    <a href="tel:+919603960337" style="display: inline-block; background: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 10px;">📞 Call Now</a>
                    <a href="https://wa.me/919603960337" style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 10px;">💬 WhatsApp</a>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 16px; color: #666;">Visit our website to see our latest work:</p>
                <a href="https://appleinteriors.in/portfolio" style="display: inline-block; background: #eab308; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px;">View Portfolio</a>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 14px;">
            <p><strong>Apple Interiors</strong></p>
            <p>Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3<br>
            Sreenivasa Nagar, Kukatpally, Hyderabad - 500072</p>
            <p>📞 +91 9603 9603 37 | +91 9160 6778 99<br>
            📧 aravind.bandaru@appleinteriors.in</p>
        </div>
    </body>
    </html>
    `;
}
