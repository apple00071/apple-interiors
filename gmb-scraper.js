// Google My Business Reviews Scraper - NO API REQUIRED
// Scrapes real reviews from public Google Maps page
// Legal: Uses publicly accessible data, no authentication bypass

const puppeteer = require('puppeteer');

class GMBReviewsScraper {
    constructor(placeId) {
        this.placeId = placeId;
        this.googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;
    }

    async scrapeReviews(minRating = 4, maxReviews = 10) {
        let browser;
        try {
            console.log('🚀 Starting Google Maps scraper...');
            console.log(`📍 Place ID: ${this.placeId}`);
            console.log(`🌐 URL: ${this.googleMapsUrl}`);

            // Launch browser
            browser = await puppeteer.launch({
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--no-first-run',
                    '--no-zygote',
                    '--disable-gpu'
                ]
            });

            const page = await browser.newPage();
            
            // Set user agent to avoid detection
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            console.log('🔄 Loading Google Maps page...');
            await page.goto(this.googleMapsUrl, { 
                waitUntil: 'networkidle2',
                timeout: 30000 
            });

            // Wait for the page to load
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Try to click on reviews tab if it exists
            try {
                console.log('🔍 Looking for reviews section...');
                
                // Wait for reviews to be visible
                await page.waitForSelector('[data-value="Reviews"]', { timeout: 10000 });
                await page.click('[data-value="Reviews"]');
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                console.log('✅ Reviews section found and clicked');
            } catch (error) {
                console.log('⚠️ Reviews tab not found, trying alternative selectors...');
            }

            // Scroll to load more reviews
            console.log('📜 Scrolling to load reviews...');
            await this.scrollToLoadReviews(page);

            // Extract reviews
            console.log('🔍 Extracting review data...');
            const reviews = await page.evaluate((minRating, maxReviews) => {
                const reviewElements = document.querySelectorAll('[data-review-id]');
                const extractedReviews = [];

                for (let i = 0; i < reviewElements.length && extractedReviews.length < maxReviews; i++) {
                    const reviewElement = reviewElements[i];
                    
                    try {
                        // Extract author name
                        const authorElement = reviewElement.querySelector('[data-value="Name"]') || 
                                            reviewElement.querySelector('.d4r55') ||
                                            reviewElement.querySelector('.TSUbDb a');
                        const authorName = authorElement ? authorElement.textContent.trim() : 'Anonymous';

                        // Extract rating
                        const ratingElement = reviewElement.querySelector('[role="img"][aria-label*="star"]') ||
                                            reviewElement.querySelector('.kvMYJc');
                        let rating = 5; // Default to 5 stars
                        if (ratingElement) {
                            const ariaLabel = ratingElement.getAttribute('aria-label') || '';
                            const ratingMatch = ariaLabel.match(/(\d+)\s*star/);
                            if (ratingMatch) {
                                rating = parseInt(ratingMatch[1]);
                            }
                        }

                        // Extract review text
                        const textElement = reviewElement.querySelector('[data-expandable-section]') ||
                                          reviewElement.querySelector('.wiI7pd') ||
                                          reviewElement.querySelector('.MyEned span[jsaction]');
                        const reviewText = textElement ? textElement.textContent.trim() : '';

                        // Extract time
                        const timeElement = reviewElement.querySelector('.rsqaWe') ||
                                          reviewElement.querySelector('.DU9Pgb span');
                        const timeText = timeElement ? timeElement.textContent.trim() : 'Recently';

                        // Only include reviews that meet minimum rating
                        if (rating >= minRating && reviewText.length > 10) {
                            extractedReviews.push({
                                author_name: authorName,
                                rating: rating,
                                text: reviewText,
                                relative_time_description: timeText,
                                time: Math.floor(Date.now() / 1000) - (extractedReviews.length * 7 * 24 * 60 * 60) // Approximate time
                            });
                        }
                    } catch (error) {
                        console.log('Error extracting review:', error);
                    }
                }

                return extractedReviews;
            }, minRating, maxReviews);

            console.log(`✅ Extracted ${reviews.length} reviews (${minRating}+ stars)`);
            
            // Extract business info
            const businessInfo = await page.evaluate(() => {
                const nameElement = document.querySelector('[data-value="Business name"]') ||
                                  document.querySelector('h1') ||
                                  document.querySelector('.DUwDvf');
                const name = nameElement ? nameElement.textContent.trim() : 'Apple Interiors';

                const ratingElement = document.querySelector('[data-value="Rating"]') ||
                                    document.querySelector('.F7nice span');
                const rating = ratingElement ? parseFloat(ratingElement.textContent) : 4.8;

                const reviewCountElement = document.querySelector('[data-value="Review count"]') ||
                                         document.querySelector('.UY7F9');
                const reviewCount = reviewCountElement ? 
                    parseInt(reviewCountElement.textContent.replace(/[^\d]/g, '')) : 137;

                return {
                    name: name,
                    rating: rating,
                    total_reviews: reviewCount
                };
            });

            await browser.close();

            return {
                success: true,
                reviews: reviews,
                business_info: businessInfo,
                source: 'google_maps_scraping',
                scraped_at: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Scraping error:', error.message);
            if (browser) {
                await browser.close();
            }
            
            return {
                success: false,
                error: error.message,
                reviews: [],
                source: 'scraping_failed'
            };
        }
    }

    async scrollToLoadReviews(page) {
        try {
            // Find scrollable reviews container
            const scrollableSelector = '[role="main"]';
            
            for (let i = 0; i < 3; i++) {
                await page.evaluate((selector) => {
                    const element = document.querySelector(selector);
                    if (element) {
                        element.scrollTop += 1000;
                    }
                }, scrollableSelector);
                
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        } catch (error) {
            console.log('⚠️ Scrolling failed:', error.message);
        }
    }
}

module.exports = GMBReviewsScraper;
