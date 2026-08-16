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
            <title>New Contact Form Submission</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏠 New Contact Inquiry</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">${EMAIL_CONFIG.companyName}</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #495057; margin: 0 0 15px 0; font-size: 20px;">👤 Customer Information</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #6c757d; width: 30%;">Name:</td>
                            <td style="padding: 8px 0; color: #495057;">${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Email:</td>
                            <td style="padding: 8px 0; color: #495057;">
                                <a href="mailto:${formData.emailAddress}" style="color: #007bff; text-decoration: none;">${formData.emailAddress}</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #6c757d;">Phone:</td>
                            <td style="padding: 8px 0; color: #495057;">
                                <a href="tel:${formData.phoneNumber}" style="color: #007bff; text-decoration: none;">${formData.phoneNumber}</a>
                            </td>
                        </tr>
                    </table>
                </div>
                
                ${formData.propertyType || formData.projectLocation ? `
                <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #1976d2; margin: 0 0 15px 0; font-size: 20px;">🏗️ Project Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${formData.propertyType ? `
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #1565c0; width: 30%;">Property Type:</td>
                            <td style="padding: 8px 0; color: #1976d2;">${formData.propertyType}</td>
                        </tr>
                        ` : ''}
                        ${formData.projectLocation ? `
                        <tr>
                            <td style="padding: 8px 0; font-weight: bold; color: #1565c0;">Location:</td>
                            <td style="padding: 8px 0; color: #1976d2;">${formData.projectLocation}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>
                ` : ''}
                
                ${formData.projectMessage ? `
                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    <h2 style="color: #f57c00; margin: 0 0 15px 0; font-size: 20px;">💬 Customer Message</h2>
                    <p style="color: #ef6c00; margin: 0; white-space: pre-wrap; line-height: 1.6;">${formData.projectMessage}</p>
                </div>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="mailto:${formData.emailAddress}?subject=Re: Your Interior Design Inquiry" 
                       style="display: inline-block; background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        📧 Reply via Email
                    </a>
                    <a href="tel:${formData.phoneNumber}" 
                       style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        📞 Call Customer
                    </a>
                    <a href="https://wa.me/${formData.phoneNumber.replace(/[^\d]/g, '')}?text=Hi%20${encodeURIComponent(formData.fullName)}%2C%20thank%20you%20for%20your%20interest%20in%20Apple%20Interiors.%20I%20received%20your%20inquiry%20and%20would%20like%20to%20discuss%20your%20project." 
                       style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        💬 WhatsApp
                    </a>
                </div>
                
                <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; text-align: center; color: #6c757d; font-size: 14px;">
                    <p style="margin: 0;">📅 Received on: ${timestamp}</p>
                    <p style="margin: 5px 0 0 0;">🌐 From: ${EMAIL_CONFIG.companyWebsite}</p>
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
            <title>Thank you for contacting Apple Interiors</title>
        </head>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px;">🏠 ${EMAIL_CONFIG.companyName}</h1>
                <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Best Interior Designers in Hyderabad</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #495057; margin: 0 0 20px 0; font-size: 24px;">Thank you, ${formData.fullName}! 🎉</h2>
                
                <p style="color: #495057; font-size: 16px; margin-bottom: 20px;">
                    We have received your inquiry and are excited to help you transform your space into something beautiful and functional.
                </p>
                
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 18px;">📋 Your Inquiry Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d; width: 30%;">Name:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.fullName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Email:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.emailAddress}</td>
                        </tr>
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Phone:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.phoneNumber}</td>
                        </tr>
                        ${formData.propertyType ? `
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Property Type:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.propertyType}</td>
                        </tr>
                        ` : ''}
                        ${formData.projectLocation ? `
                        <tr>
                            <td style="padding: 6px 0; font-weight: bold; color: #6c757d;">Location:</td>
                            <td style="padding: 6px 0; color: #495057;">${formData.projectLocation}</td>
                        </tr>
                        ` : ''}
                    </table>
                </div>

                ${formData.projectMessage ? `
                <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #f57c00; margin: 0 0 15px 0; font-size: 18px;">💬 Your Message</h3>
                    <p style="color: #ef6c00; margin: 0; white-space: pre-wrap; line-height: 1.6; font-style: italic;">"${formData.projectMessage}"</p>
                </div>
                ` : ''}

                <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="color: #2e7d32; margin: 0 0 15px 0; font-size: 18px;">⏰ What Happens Next?</h3>
                    <ul style="color: #388e3c; margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 8px;">Our design expert will review your requirements</li>
                        <li style="margin-bottom: 8px;">We'll contact you within 24 hours to discuss your project</li>
                        <li style="margin-bottom: 8px;">Schedule a free consultation at your convenience</li>
                        <li style="margin-bottom: 8px;">Receive a customized design proposal</li>
                    </ul>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p style="color: #495057; font-size: 16px; margin-bottom: 20px;">
                        <strong>Need immediate assistance?</strong>
                    </p>
                    <a href="tel:${EMAIL_CONFIG.companyPhone}" 
                       style="display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        📞 Call Us
                    </a>
                    <a href="https://wa.me/919160577899?text=Hi%2C%20I%20just%20submitted%20a%20contact%20form%20and%20would%20like%20to%20discuss%20my%20interior%20design%20project." 
                       style="display: inline-block; background: #25d366; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px 10px 0; font-weight: bold;">
                        💬 WhatsApp
                    </a>
                </div>
                
                <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; text-align: center; color: #6c757d; font-size: 14px;">
                    <p style="margin: 0 0 10px 0;"><strong>${EMAIL_CONFIG.companyName}</strong></p>
                    <p style="margin: 0 0 5px 0;">📞 ${EMAIL_CONFIG.companyPhone}</p>
                    <p style="margin: 0 0 5px 0;">📧 ${EMAIL_CONFIG.adminEmail}</p>
                    <p style="margin: 0;">🌐 ${EMAIL_CONFIG.companyWebsite}</p>
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
        console.error('RESEND_API_KEY environment variable is not set');
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
