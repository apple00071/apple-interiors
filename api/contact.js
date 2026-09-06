const { Resend } = require('resend');

// Email configuration
const EMAIL_CONFIG = {
    from: process.env.FROM_EMAIL || 'Apple Interiors <noreply@appleinteriors.in>',
    adminEmail: process.env.ADMIN_EMAIL || 'aravind.bandaru@appleinteriors.in',
    companyName: 'Apple Interiors',
    companyPhone: '+91 9603 9603 37',
    companyWebsite: 'https://appleinteriors.in'
};

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '86400',
};

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map();
const RATE_LIMIT = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3, // Max 3 submissions per 15 minutes per IP
    blockDuration: 60 * 60 * 1000 // Block for 1 hour after exceeding limit
};

// Suspicious patterns for content filtering
const SUSPICIOUS_PATTERNS = [
    /\b(viagra|cialis|casino|poker|loan|debt|crypto|bitcoin)\b/i,
    /\b(click here|visit now|act now|limited time)\b/i,
    /https?:\/\/[^\s]+/g, // URLs in messages
    /(.)\1{4,}/g, // Repeated characters (aaaaa)
    /[^\w\s@.-]/g, // Special characters (excluding common ones)
];

// Common spam keywords
const SPAM_KEYWORDS = [
    'seo', 'marketing', 'promotion', 'offer', 'deal', 'discount',
    'free', 'money', 'earn', 'business opportunity', 'investment'
];

// Simple CSRF token generation (in production, use crypto.randomBytes)
function generateCSRFToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// CSRF token validation
function validateCSRFToken(token) {
    if (!token || typeof token !== 'string') return false;

    // Token should be at least 10 characters
    if (token.length < 10) return false;

    // For development, accept any token that looks valid
    // In production, you'd want more sophisticated validation
    return true;
}

// Rate limiting functions
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection?.remoteAddress ||
        req.socket?.remoteAddress ||
        'unknown';
}

function checkRateLimit(ip) {
    // Bypass rate limiting for localhost / development
    if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip === 'unknown') {
        return { allowed: true, remaining: 99 };
    }

    const now = Date.now();
    const clientData = rateLimitStore.get(ip) || { requests: [], blockedUntil: 0 };

    // Check if client is currently blocked
    if (clientData.blockedUntil > now) {
        return {
            allowed: false,
            resetTime: clientData.blockedUntil,
            reason: 'IP temporarily blocked due to too many requests'
        };
    }

    // Clean old requests outside the window
    clientData.requests = clientData.requests.filter(time => now - time < RATE_LIMIT.windowMs);

    // Check if limit exceeded
    if (clientData.requests.length >= RATE_LIMIT.maxRequests) {
        clientData.blockedUntil = now + RATE_LIMIT.blockDuration;
        rateLimitStore.set(ip, clientData);
        return {
            allowed: false,
            resetTime: clientData.blockedUntil,
            reason: 'Rate limit exceeded. Too many submissions.'
        };
    }

    // Add current request
    clientData.requests.push(now);
    rateLimitStore.set(ip, clientData);

    return {
        allowed: true,
        remaining: RATE_LIMIT.maxRequests - clientData.requests.length
    };
}

// Content filtering functions
function containsSuspiciousContent(text) {
    if (!text || typeof text !== 'string') return false;

    // Check for suspicious patterns
    for (const pattern of SUSPICIOUS_PATTERNS) {
        if (pattern.test(text)) {
            return true;
        }
    }

    // Check for spam keywords
    const lowerText = text.toLowerCase();
    const spamKeywordCount = SPAM_KEYWORDS.filter(keyword =>
        lowerText.includes(keyword.toLowerCase())
    ).length;

    // Flag if multiple spam keywords found
    return spamKeywordCount >= 2;
}

function validateHoneypot(data) {
    // Check for honeypot fields that should be empty
    const honeypotFields = ['website', 'url', 'company_name', 'fax'];

    for (const field of honeypotFields) {
        if (data[field] && data[field].trim() !== '') {
            return false; // Bot detected
        }
    }

    return true;
}

// Enhanced validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{9,14}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

function validateFormData(data) {
    const errors = [];

    // Basic validation
    if (!data.fullName || data.fullName.trim().length < 2) {
        errors.push('Full name is required and must be at least 2 characters');
    }

    if (!data.emailAddress || !validateEmail(data.emailAddress)) {
        errors.push('Valid email address is required');
    }

    if (!data.phoneNumber || !validatePhone(data.phoneNumber)) {
        errors.push('Valid phone number is required');
    }

    // Anti-spam validation
    if (!validateHoneypot(data)) {
        errors.push('Spam detected');
    }

    // Content filtering
    const fieldsToCheck = [data.fullName, data.emailAddress, data.message, data.projectDetails];
    for (const field of fieldsToCheck) {
        if (containsSuspiciousContent(field)) {
            errors.push('Message contains inappropriate content');
            break;
        }
    }

    // Check for overly long content (potential spam)
    if (data.message && data.message.length > 2000) {
        errors.push('Message is too long');
    }

    // Check for minimum message length (too short might be spam)
    if (data.message && data.message.trim().length < 10) {
        errors.push('Please provide a more detailed message');
    }

    return errors;
}

// Email template functions
function generateAdminEmailHTML(formData) {
    const timestamp = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'short'
    });

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
            <title>New Lead Inquiry - Apple Interiors</title>
        </head>
        <body style="font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #f5f5f4; margin: 0; padding: 30px 10px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;">
                
                <!-- Brand Header with Official Logo -->
                <div style="background-color: #ffffff; padding: 26px 20px 20px 20px; text-align: center; border-bottom: 3px solid #eab308;">
                    <a href="https://appleinteriors.in" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="https://appleinteriors.in/images/New-logo.png" alt="Apple Interiors" width="190" style="display: block; margin: 0 auto 8px auto; max-width: 190px; height: auto;" />
                    </a>
                    <p style="margin: 0; color: #a16207; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">
                        New Client Inquiry
                    </p>
                </div>
                
                <div style="padding: 32px 28px;">
                    <h2 style="color: #1f2937; font-size: 22px; font-weight: 600; text-transform: uppercase; letter-spacing: -0.5px; margin: 0 0 20px 0; border-bottom: 2px solid #f3f4f6; padding-bottom: 12px;">
                        Customer Details
                    </h2>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                        <tr>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; width: 34%; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Name:</td>
                            <td style="padding: 10px 0; color: #374151; font-size: 15px; font-weight: 500;">${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Email:</td>
                            <td style="padding: 10px 0; font-size: 15px;">
                                <a href="mailto:${formData.emailAddress}" style="color: #a16207; text-decoration: none; font-weight: 600;">${formData.emailAddress}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Phone:</td>
                            <td style="padding: 10px 0; font-size: 15px;">
                                <a href="tel:${formData.phoneNumber}" style="color: #a16207; text-decoration: none; font-weight: 600;">${formData.phoneNumber}</a>
                            </td>
                        </tr>
                        ${formData.propertyType ? `
                        <tr>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Property Type:</td>
                            <td style="padding: 10px 0; color: #374151; font-size: 15px;">${formData.propertyType}</td>
                        </tr>
                        ` : ''}
                        ${formData.projectLocation ? `
                        <tr>
                            <td style="padding: 10px 0; font-weight: 600; color: #1f2937; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Location:</td>
                            <td style="padding: 10px 0; color: #374151; font-size: 15px;">${formData.projectLocation}</td>
                        </tr>
                        ` : ''}
                        ${formData.countryResidence ? `
                        <tr>
                            <td style="padding: 10px 0; font-weight: 600; color: #eab308; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Living In:</td>
                            <td style="padding: 10px 0; color: #1f2937; font-size: 15px; font-weight: 700;">🌍 ${formData.countryResidence}</td>
                        </tr>
                        ` : ''}
                    </table>

                    ${(formData.projectMessage || formData.projectScope) ? `
                    <div style="background-color: #fefce8; border-left: 4px solid #eab308; padding: 18px 20px; border-radius: 10px; margin-bottom: 28px;">
                        <h4 style="color: #a16207; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">Customer Requirements</h4>
                        <p style="color: #1f2937; font-size: 14px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${formData.projectMessage || formData.projectScope}</p>
                    </div>
                    ` : ''}

                    <!-- Quick Action Buttons for Admin -->
                    <div style="text-align: center; margin: 24px 0 10px 0;">
                        <a href="tel:${formData.phoneNumber}" 
                           style="display: inline-block; background: #1f2937; color: #ffffff; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 6px 8px 6px;">
                            📞 Call Client
                        </a>
                        <a href="https://wa.me/${formData.phoneNumber.replace(/[^\d]/g, '')}?text=Hi%20${encodeURIComponent(formData.fullName)}%2C%20thank%20you%20for%20contacting%20Apple%20Interiors.%20I%20received%20your%20inquiry%20and%20would%20like%20to%20discuss%20your%20home%20interior%20requirements." 
                           style="display: inline-block; background: #25d366; color: #ffffff; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 6px 8px 6px;">
                            💬 WhatsApp
                        </a>
                        <a href="mailto:${formData.emailAddress}?subject=Re: Your Interior Design Inquiry with Apple Interiors" 
                           style="display: inline-block; background: #eab308; color: #1f2937; padding: 12px 22px; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 6px 8px 6px;">
                            ✉️ Reply Email
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 18px 20px; text-align: center; color: #78716c; font-size: 12px;">
                    <p style="margin: 0 0 4px 0;">Received on ${timestamp}</p>
                    <p style="margin: 0;">Apple Interiors Lead System • Hyderabad</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateCustomerEmailHTML(formData) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
            <title>Thank You for Contacting Apple Interiors</title>
        </head>
        <body style="font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #374151; background-color: #f5f5f4; margin: 0; padding: 30px 10px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #e7e5e4;">
                
                <!-- Brand Header with Official Logo -->
                <div style="background-color: #ffffff; padding: 28px 20px 22px 20px; text-align: center; border-bottom: 3px solid #eab308;">
                    <a href="https://appleinteriors.in" target="_blank" style="text-decoration: none; display: inline-block;">
                        <img src="https://appleinteriors.in/images/New-logo.png" alt="Apple Interiors" width="200" style="display: block; margin: 0 auto 8px auto; max-width: 200px; height: auto;" />
                    </a>
                    <p style="margin: 0; color: #a16207; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2.5px;">
                        Best Interior Designers in Hyderabad
                    </p>
                </div>
                
                <div style="padding: 36px 30px;">
                    <span style="color: #eab308; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">
                        Consultation Request Received
                    </span>
                    <h1 style="color: #1f2937; font-size: 26px; font-weight: 600; text-transform: uppercase; letter-spacing: -0.5px; margin: 0 0 16px 0;">
                        Thank you, ${formData.fullName}!
                    </h1>
                    
                    <p style="color: #4b5563; font-size: 15px; margin: 0 0 24px 0; line-height: 1.65;">
                        We have received your details. Our Senior Interior Design Director is reviewing your requirements and will connect with you within 24 hours to arrange your consultation.
                    </p>

                    <!-- Summary Box -->
                    <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 16px; padding: 22px; margin-bottom: 28px;">
                        <h3 style="color: #1f2937; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0;">
                            📋 Your Request Summary
                        </h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; width: 34%; font-size: 13px; text-transform: uppercase;">Name:</td>
                                <td style="padding: 6px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${formData.fullName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; font-size: 13px; text-transform: uppercase;">Phone:</td>
                                <td style="padding: 6px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${formData.phoneNumber}</td>
                            </tr>
                            ${formData.propertyType ? `
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; font-size: 13px; text-transform: uppercase;">Configuration:</td>
                                <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">${formData.propertyType}</td>
                            </tr>
                            ` : ''}
                            ${formData.projectLocation ? `
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; font-size: 13px; text-transform: uppercase;">Location:</td>
                                <td style="padding: 6px 0; color: #1f2937; font-size: 14px;">${formData.projectLocation}</td>
                            </tr>
                            ` : ''}
                            ${formData.countryResidence ? `
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #6b7280; font-size: 13px; text-transform: uppercase;">Living In:</td>
                                <td style="padding: 6px 0; color: #a16207; font-size: 14px; font-weight: 600;">🌍 ${formData.countryResidence}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>

                    <!-- What Happens Next Box -->
                    <div style="background-color: #fefce8; border: 1px solid #fef08a; border-radius: 16px; padding: 22px; margin-bottom: 28px;">
                        <h3 style="color: #a16207; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">
                            ✨ Next Steps
                        </h3>
                        <ul style="color: #713f12; margin: 0; padding-left: 20px; font-size: 13px; line-height: 1.7;">
                            <li>Our senior designer reviews your floorplan and project scope</li>
                            <li>We schedule a 3D visualization video call around your schedule</li>
                            <li>Receive transparent, itemized factory-finish quotation</li>
                            <li>Zero hassle turnkey execution with 10-year warranty</li>
                        </ul>
                    </div>

                    <!-- Immediate Assistance -->
                    <div style="text-align: center; padding: 10px 0 10px 0;">
                        <p style="color: #1f2937; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px;">
                            Need Immediate Assistance?
                        </p>
                        <a href="tel:+919603960337" 
                           style="display: inline-block; background: #1f2937; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 6px 8px 6px;">
                            📞 +91 9603 9603 37
                        </a>
                        <a href="https://wa.me/919603960337?text=Hi%20Apple%20Interiors%2C%20I%20just%20submitted%20a%20consultation%20request%20on%20your%20website%20and%20would%20like%20to%20connect." 
                           style="display: inline-block; background: #25d366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin: 0 6px 8px 6px;">
                            💬 Connect on WhatsApp
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #fafaf9; border-top: 1px solid #e7e5e4; padding: 22px 20px; text-align: center; color: #78716c; font-size: 12px; line-height: 1.6;">
                    <p style="margin: 0 0 6px 0; font-weight: 600; color: #1f2937;">Apple Interiors</p>
                    <p style="margin: 0 0 4px 0;">Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3, Kukatpally, Hyderabad 500085</p>
                    <p style="margin: 0;"><a href="https://appleinteriors.in" style="color: #a16207; text-decoration: none;">www.appleinteriors.in</a></p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Main handler function
module.exports = async function handler(req, res) {
    const startTime = Date.now();
    const clientIP = getClientIP(req);

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Only POST requests are accepted.'
        });
    }

    // Check rate limiting
    const rateLimitResult = checkRateLimit(clientIP);
    if (!rateLimitResult.allowed) {
        console.log(`Rate limit exceeded for IP: ${clientIP}`, {
            reason: rateLimitResult.reason,
            resetTime: new Date(rateLimitResult.resetTime).toISOString()
        });

        return res.status(429).json({
            success: false,
            error: rateLimitResult.reason,
            retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        });
    }

    // Check API key
    if (!process.env.RESEND_API_KEY) {
        console.warn('RESEND_API_KEY environment variable is not set');
        // In local development or environments without RESEND_API_KEY, simulate successful receipt
        if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
            console.log('✅ Form submission received (Development Mode):', {
                fullName: req.body?.fullName,
                email: req.body?.emailAddress,
                phone: req.body?.phoneNumber,
                propertyType: req.body?.propertyType,
                location: req.body?.projectLocation,
                country: req.body?.countryResidence
            });
            return res.status(200).json({
                success: true,
                message: 'Thank you! Your consultation request has been received. Our team will contact you within 24 hours.'
            });
        }
        return res.status(500).json({
            success: false,
            error: 'Email service is not properly configured. Please try again later.'
        });
    }

    try {
        const formData = req.body;

        // Extract CSRF token early so we can safely log its presence
        const csrfToken = formData._csrfToken || req.headers['x-csrf-token'];

        // Comprehensive submission logging for security analysis
        const submissionLog = {
            ip: clientIP,
            timestamp: new Date().toISOString(),
            userAgent: req.headers['user-agent'],
            referer: req.headers.referer,
            origin: req.headers.origin,
            contentLength: req.headers['content-length'],
            hasHoneypotData: !!(formData.website || formData.url || formData.company_name || formData.fax),
            honeypotFields: {
                website: formData.website || null,
                url: formData.url || null,
                company_name: formData.company_name || null,
                fax: formData.fax || null
            },
            hasCSRFToken: Boolean(csrfToken),
            formFields: Object.keys(formData).filter(key => !key.startsWith('_')),
            rateLimitRemaining: rateLimitResult.remaining
        };

        console.log('Form submission attempt:', submissionLog);

        // Validate CSRF token
        if (csrfToken) {
            if (!validateCSRFToken(csrfToken)) {
                console.log('Invalid CSRF token:', {
                    ip: clientIP,
                    token: csrfToken?.substring(0, 10) + '...'
                });

                return res.status(403).json({
                    success: false,
                    error: 'Invalid or expired security token. Please refresh the page and try again.'
                });
            }
            delete formData._csrfToken; // Remove from form data
        }

        // Parse and analyze client-side behavior data
        let behaviorAnalysis = null;
        if (formData._behaviorAnalysis) {
            try {
                behaviorAnalysis = JSON.parse(formData._behaviorAnalysis);
                delete formData._behaviorAnalysis; // Remove from form data
            } catch (e) {
                console.warn('Failed to parse behavior analysis:', e);
            }
        }

        // Enhanced bot detection based on behavior analysis
        if (behaviorAnalysis && behaviorAnalysis.isSuspicious) {
            console.log('Suspicious behavior detected:', {
                ip: clientIP,
                behaviorAnalysis,
                suspiciousIndicators: behaviorAnalysis.suspiciousIndicators
            });

            // For now, log but don't block (you can change this to block if needed)
            // return res.status(400).json({
            //     success: false,
            //     error: 'Suspicious activity detected'
            // });
        }

        // Validate form data (includes anti-spam checks)
        const validationErrors = validateFormData(formData);
        if (validationErrors.length > 0) {
            console.log('Validation failed:', {
                ip: clientIP,
                errors: validationErrors,
                behaviorAnalysis,
                formData: { ...formData, emailAddress: '[REDACTED]', phoneNumber: '[REDACTED]' }
            });

            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: validationErrors
            });
        }

        // Initialize client only after env check
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Send admin notification email
        const adminEmailResult = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: EMAIL_CONFIG.adminEmail,
            subject: `🏠 New Contact Inquiry from ${formData.fullName}`,
            html: generateAdminEmailHTML(formData)
        });

        // Send customer confirmation email
        const customerEmailResult = await resend.emails.send({
            from: EMAIL_CONFIG.from,
            to: formData.emailAddress,
            subject: `Thank you for contacting ${EMAIL_CONFIG.companyName}`,
            html: generateCustomerEmailHTML(formData)
        });

        // Calculate processing time
        const processingTime = Date.now() - startTime;

        // Log success
        console.log('Emails sent successfully:', {
            admin: adminEmailResult.data?.id,
            customer: customerEmailResult.data?.id,
            timestamp: new Date().toISOString(),
            customerName: formData.fullName,
            customerEmail: formData.emailAddress,
            ip: clientIP,
            processingTime: `${processingTime}ms`,
            rateLimitRemaining: rateLimitResult.remaining
        });

        return res.status(200).json({
            success: true,
            message: 'Your message has been sent successfully! We will contact you within 24 hours.',
            emailIds: {
                admin: adminEmailResult.data?.id,
                customer: customerEmailResult.data?.id
            }
        });

    } catch (error) {
        console.error('Contact form submission error:', {
            message: error.message,
            name: error.name,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            ip: clientIP,
            userAgent: req.headers['user-agent'],
            formData: { ...req.body, emailAddress: '[REDACTED]', phoneNumber: '[REDACTED]' }
        });

        // Handle specific Resend API errors
        let errorMessage = 'Failed to send your message. Please try again.';
        let statusCode = 500;

        if (error.name === 'validation_error' || error.message?.includes('validation')) {
            errorMessage = 'There was an issue with the email addresses. Please check and try again.';
            statusCode = 400;
        } else if (error.message?.includes('rate limit') || error.message?.includes('too many')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            statusCode = 429;
        } else if (error.message?.includes('unauthorized') || error.message?.includes('invalid')) {
            errorMessage = 'Email service authentication failed. Please try again later.';
            statusCode = 401;
        }

        return res.status(statusCode).json({
            success: false,
            error: errorMessage,
            fallback: {
                whatsapp: `https://wa.me/919160577899?text=Hi%2C%20I%20tried%20to%20submit%20the%20contact%20form%20but%20encountered%20an%20issue.%20My%20name%20is%20${encodeURIComponent(req.body?.fullName || 'Customer')}%20and%20I%20would%20like%20to%20discuss%20interior%20design%20services.`,
                phone: EMAIL_CONFIG.companyPhone
            }
        });
    }
};
