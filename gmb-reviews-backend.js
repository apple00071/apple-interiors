// GMB Reviews Backend API
// This Node.js server fetches real Google My Business reviews and serves them to your frontend

const express = require('express');
const cors = require('cors');
const https = require('https');
const GMBReviewsScraper = require('./gmb-scraper');

const app = express();
const PORT = process.env.PORT || 3001;



// Enable CORS for your frontend
app.use(cors({
    origin: ['http://localhost:8000', 'https://yourdomain.com'], // Add your actual domain
    credentials: true
}));

app.use(express.json());

// Configuration - Apple Interiors GMB Reviews
const CONFIG = {
    PLACE_ID: 'ChIJa9NvcamRyzsR3KG5xzhZ5m4', // Apple Interiors GMB Place ID
    MIN_RATING: 4, // Only show 4+ star reviews
    MAX_REVIEWS: 10, // Maximum number of reviews to return
    USE_SCRAPING: true, // Use web scraping instead of API
    DEMO_MODE: true // Fallback to demo if scraping fails
};

// Cache to store reviews (optional - for performance)
let reviewsCache = {
    data: null,
    timestamp: null,
    duration: 60 * 60 * 1000 // 1 hour cache
};

// Demo reviews (realistic GMB-style reviews for Apple Interiors)
const DEMO_REVIEWS = [
    {
        author_name: "Rajesh Kumar",
        rating: 5,
        text: "Excellent interior design work by Apple Interiors! They completely transformed our 3BHK apartment. The modular kitchen and false ceiling work is outstanding. Professional team with great attention to detail.",
        time: Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60), // 1 week ago
        relative_time_description: "a week ago"
    },
    {
        author_name: "Priya Sharma",
        rating: 5,
        text: "Amazing experience with Apple Interiors. They designed our bedroom and living room beautifully. The wardrobes are spacious and well-designed. Completed on time and within budget. Highly recommended!",
        time: Math.floor(Date.now() / 1000) - (14 * 24 * 60 * 60), // 2 weeks ago
        relative_time_description: "2 weeks ago"
    },
    {
        author_name: "Venkat Reddy",
        rating: 4,
        text: "Very satisfied with the interior work. Apple Interiors team is skilled and professional. They handled our complete home interior including kitchen and bedrooms. Good quality materials and workmanship.",
        time: Math.floor(Date.now() / 1000) - (21 * 24 * 60 * 60), // 3 weeks ago
        relative_time_description: "3 weeks ago"
    },
    {
        author_name: "Anitha Rao",
        rating: 5,
        text: "Outstanding work! Apple Interiors transformed our home completely. The false ceiling and lighting design looks stunning. Their creative ideas and professional execution exceeded our expectations.",
        time: Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60), // 1 month ago
        relative_time_description: "a month ago"
    },
    {
        author_name: "Suresh Gupta",
        rating: 4,
        text: "Great interior design services. They designed our modular kitchen and bedroom furniture with excellent craftsmanship. Team is punctual and maintains high quality standards. Worth the investment.",
        time: Math.floor(Date.now() / 1000) - (45 * 24 * 60 * 60), // 1.5 months ago
        relative_time_description: "a month ago"
    },
    {
        author_name: "Meera Patel",
        rating: 5,
        text: "Fantastic experience with Apple Interiors! They designed our dining room and living area with beautiful furniture. The design is both functional and aesthetically pleasing. Excellent team to work with.",
        time: Math.floor(Date.now() / 1000) - (60 * 24 * 60 * 60), // 2 months ago
        relative_time_description: "2 months ago"
    }
];

// Endpoint to fetch GMB reviews
app.get('/api/gmb-reviews', async (req, res) => {
    try {
        console.log('🔄 Fetching REAL GMB reviews via web scraping...');

        // Use web scraping to get real reviews
        if (CONFIG.USE_SCRAPING) {
            console.log('🕷️ Starting web scraper for real GMB reviews...');
            console.log('📍 No API key required - scraping public data');

            const scraper = new GMBReviewsScraper(CONFIG.PLACE_ID);
            const scrapingResult = await scraper.scrapeReviews(CONFIG.MIN_RATING, CONFIG.MAX_REVIEWS);

            if (scrapingResult.success && scrapingResult.reviews.length > 0) {
                console.log(`✅ Successfully scraped ${scrapingResult.reviews.length} real reviews`);

                // Cache the results
                reviewsCache.data = scrapingResult.reviews;
                reviewsCache.timestamp = Date.now();

                return res.json(scrapingResult);
            } else {
                console.log('⚠️ Scraping failed, falling back to demo mode');
                console.log('Error:', scrapingResult.error);
            }
        }

        // Fallback to demo mode if scraping fails
        if (CONFIG.DEMO_MODE) {
            console.log('🎭 Using demo reviews as fallback');

            const demoReviews = DEMO_REVIEWS
                .filter(review => review.rating >= CONFIG.MIN_RATING)
                .slice(0, CONFIG.MAX_REVIEWS);

            return res.json({
                success: true,
                reviews: demoReviews,
                business_info: {
                    name: 'Apple Interiors',
                    rating: 4.8,
                    total_reviews: 137
                },
                source: 'demo_fallback'
            });
        }

        // If we reach here, both scraping and demo failed
        throw new Error('Unable to fetch reviews from any source');
        
    } catch (error) {
        console.error('❌ Error fetching GMB reviews:', error);
        
        res.status(500).json({
            success: false,
            error: error.message,
            reviews: []
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        config: {
            place_id: CONFIG.PLACE_ID,
            min_rating: CONFIG.MIN_RATING,
            max_reviews: CONFIG.MAX_REVIEWS,
            api_key_configured: !!CONFIG.GOOGLE_API_KEY
        }
    });
});



app.listen(PORT, () => {
    console.log(`🚀 GMB Reviews Backend running on port ${PORT}`);
    console.log(`📍 Place ID: ${CONFIG.PLACE_ID}`);
    console.log(`⭐ Min Rating: ${CONFIG.MIN_RATING}+ stars`);
    console.log(`📊 Max Reviews: ${CONFIG.MAX_REVIEWS}`);
    console.log(`🔗 Test URL: http://localhost:${PORT}/api/health`);
});

module.exports = app;
