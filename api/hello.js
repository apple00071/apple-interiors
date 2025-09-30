module.exports = async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Simple response
    return res.status(200).json({
        success: true,
        message: 'Hello from Apple Interiors API!',
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url
    });
};
