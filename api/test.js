module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Handle GET and POST requests
    if (req.method === 'GET' || req.method === 'POST') {
        return res.status(200).json({
            success: true,
            message: 'Test API is working!',
            method: req.method,
            timestamp: new Date().toISOString()
        });
    }

    // Method not allowed
    return res.status(405).json({
        success: false,
        error: 'Method not allowed'
    });
};
