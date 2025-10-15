// CSRF Token Generation API
// Simple CSRF token generation for form protection

// CORS headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
};

// Simple CSRF token generation (in production, use crypto.randomBytes)
function generateCSRFToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

module.exports = async function handler(req, res) {
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Only GET requests are accepted.'
        });
    }

    try {
        const token = generateCSRFToken();
        
        return res.status(200).json({
            success: true,
            token: token,
            timestamp: Date.now()
        });
    } catch (error) {
        console.error('CSRF token generation error:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Failed to generate CSRF token'
        });
    }
};
