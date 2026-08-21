// Geolocation API for International / NRI Visitor Detection
// Reads Vercel's edge headers without external API dependencies

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Cache-Control': 's-maxage=3600, stale-while-revalidate'
};

module.exports = async function handler(req, res) {
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed. Only GET requests are accepted.'
        });
    }

    try {
        // Vercel edge headers
        const country = req.headers['x-vercel-ip-country'] || req.query.test_country || null;
        const city = req.headers['x-vercel-ip-city'] || null;
        const region = req.headers['x-vercel-ip-country-region'] || null;

        // Visitor is NRI / International if country is detected and NOT India (IN)
        const isNRI = country ? (country.toUpperCase() !== 'IN') : false;

        return res.status(200).json({
            success: true,
            country: country ? country.toUpperCase() : 'UNKNOWN',
            city: city ? decodeURIComponent(city) : null,
            region: region || null,
            isNRI: isNRI
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Internal server error while detecting location'
        });
    }
};
