module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check environment variables (without exposing sensitive data)
    const envCheck = {
        hasResendKey: !!process.env.RESEND_API_KEY,
        hasFromEmail: !!process.env.FROM_EMAIL,
        hasAdminEmail: !!process.env.ADMIN_EMAIL,
        nodeEnv: process.env.NODE_ENV || 'not set',
        vercelEnv: process.env.VERCEL_ENV || 'not set',
        timestamp: new Date().toISOString()
    };

    return res.status(200).json({
        success: true,
        message: 'Environment check API is working!',
        environment: envCheck,
        method: req.method,
        url: req.url
    });
};
