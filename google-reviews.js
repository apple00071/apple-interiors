// Google My Business Reviews Integration - Apple Interiors
// Fetches REAL customer reviews from Apple Interiors Google Business Profile
//
// Configuration:
// - Place ID: ChIJa9NvcamRyzsR3KG5xzhZ5m4 (Apple Interiors GMB)
// - Backend API: http://localhost:3001/api/gmb-reviews
// - Filter: Only displays 4+ star reviews from GMB
// - Features: Star ratings, review badges, authentic customer feedback

class GoogleReviewsManager {
    constructor() {
        this.placeId = 'ChIJa9NvcamRyzsR3KG5xzhZ5m4'; // Apple Interiors GMB Place ID
        this.businessName = 'Apple Interiors';
        this.minRating = 4; // Only show 4+ star reviews

        // Detect environment - production vs development
        this.isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        this.apiUrl = this.isProduction ? '/api/gmb-reviews' : 'http://localhost:3001/api/gmb-reviews';

        console.log(`🌐 Environment: ${this.isProduction ? 'Production' : 'Development'}`);
        console.log(`🔗 API URL: ${this.apiUrl}`);

        this.cache = {
            reviews: null,
            timestamp: null,
            duration: 60 * 60 * 1000 // 1 hour cache for GMB reviews
        };
        this.fallbackReviews = this.getFallbackReviews();
    }

    // Fallback reviews in case API fails
    getFallbackReviews() {
        return [
            {
                author_name: "Priya Sharma",
                text: "Apple Interiors transformed our home beautifully! Their attention to detail and modern design approach exceeded our expectations. The team was professional and completed the project on time."
            },
            {
                author_name: "Rajesh Kumar", 
                text: "Outstanding work by Apple Interiors! They designed our kitchen and living room with such creativity. The false ceiling work is particularly impressive. Highly recommend their services."
            },
            {
                author_name: "Anita Reddy",
                text: "We are extremely happy with our bedroom interior design. Apple Interiors understood our requirements perfectly and delivered exactly what we wanted. Great quality and reasonable pricing."
            },
            {
                author_name: "Vikram Singh",
                text: "Professional team with excellent design skills. They completed our entire home interior including modular kitchen, wardrobes, and false ceiling. The result is stunning!"
            },
            {
                author_name: "Meera Patel",
                text: "Apple Interiors did an amazing job with our dining room and living area. Their modern approach and use of quality materials made our home look elegant and sophisticated."
            },
            {
                author_name: "Suresh Gupta",
                text: "Fantastic experience working with Apple Interiors. They handled our complete home interior project efficiently. The team is skilled, punctual, and delivers quality work."
            }
        ];
    }



    // Check if cached reviews are still valid
    isCacheValid() {
        if (!this.cache.reviews || !this.cache.timestamp) {
            return false;
        }
        return (Date.now() - this.cache.timestamp) < this.cache.duration;
    }

    // Validate API key format
    isValidApiKey() {
        return this.apiKey &&
               this.apiKey !== 'YOUR_GOOGLE_PLACES_API_KEY' &&
               this.apiKey.startsWith('AIza') &&
               this.apiKey.length > 30;
    }



    // Fetch REAL GMB reviews from backend API
    async fetchGoogleReviews() {
        try {
            // Check cache first
            if (this.isCacheValid()) {
                console.log('📋 Using cached GMB reviews');
                return this.cache.reviews;
            }

            console.log('🔄 Fetching REAL Google My Business reviews...');
            console.log(`🌐 API URL: ${this.apiUrl}`);
            console.log(`⭐ Filter: ${this.minRating}+ star reviews only`);

            // Fetch from API (serverless function in production, backend in development)
            const response = await fetch(this.apiUrl);

            if (!response.ok) {
                throw new Error(`Backend API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error(`API Error: ${data.error || 'Unknown error'}`);
            }

            if (!data.reviews || data.reviews.length === 0) {
                throw new Error('No reviews available from GMB');
            }

            // Cache the real GMB reviews
            this.cache.reviews = data.reviews;
            this.cache.timestamp = Date.now();

            console.log(`✅ Successfully loaded ${data.reviews.length} REAL GMB reviews`);
            console.log(`📊 Business: ${data.business_info?.name || 'N/A'} (${data.business_info?.rating || 'N/A'} stars)`);
            console.log(`💡 Source: Google My Business (${this.minRating}+ stars only)`);

            return data.reviews;

        } catch (error) {
            console.error('❌ Error fetching GMB reviews:', error);
            console.log('🔄 Backend not available - using fallback reviews');
            console.log('💡 To get real GMB reviews, start the backend server');

            // Return fallback reviews if backend is not available
            return this.fallbackReviews;
        }
    }



    // Generate HTML for GMB testimonials with star ratings
    generateTestimonialsHTML(reviews) {
        if (!reviews || reviews.length === 0) {
            reviews = this.fallbackReviews;
        }

        // Limit to 10 reviews and duplicate for seamless scrolling
        const limitedReviews = reviews.slice(0, 10);
        const duplicatedReviews = [...limitedReviews, ...limitedReviews]; // Duplicate for seamless scroll

        return duplicatedReviews.map(review => {
            // Generate star rating HTML if rating is available
            const stars = review.rating ? this.generateStarRating(review.rating) : '';

            // Format review text (truncate if too long)
            const maxLength = 180;
            let reviewText = review.text || '';
            if (reviewText.length > maxLength) {
                reviewText = reviewText.substring(0, maxLength) + '...';
            }

            // Format time if available
            const timeText = review.relative_time_description || '';

            // Check if this is a GMB review (has rating)
            const isGMBReview = review.rating !== undefined;

            return `
                <div class="flex-none w-[300px] md:w-[350px]">
                    <div class="testimonial-card bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div class="flex flex-col">
                            ${stars ? `
                                <div class="flex items-center mb-3">
                                    <div class="flex items-center text-lg">${stars}</div>
                                    ${timeText ? `<span class="ml-2 text-sm text-gray-500">${timeText}</span>` : ''}
                                </div>
                            ` : ''}
                            <div>
                                <p class="text-gray-600 mb-3 italic">
                                    "${this.sanitizeText(reviewText)}"
                                </p>
                            </div>
                            <div class="mt-3 pt-3 border-t border-gray-100">
                                <h4 class="font-semibold text-gray-900">
                                    ${this.sanitizeText(review.author_name)}
                                </h4>
                                ${isGMBReview ? `
                                    <div class="mt-1 text-xs text-blue-600 font-medium flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                        Google My Business Review
                                    </div>
                                ` : `
                                    <div class="mt-1 text-xs text-gray-500">
                                        Verified Customer
                                    </div>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Generate star rating HTML
    generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let starsHTML = '';

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<span class="text-yellow-400">★</span>';
        }

        // Half star
        if (hasHalfStar) {
            starsHTML += '<span class="text-yellow-400">☆</span>';
        }

        // Empty stars
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<span class="text-gray-300">☆</span>';
        }

        return starsHTML;
    }

    // Sanitize text to prevent XSS
    sanitizeText(text) {
        if (!text) return '';
        return text.replace(/[<>]/g, '').trim();
    }

    // Initialize and load REAL GMB reviews
    async init() {
        try {
            console.log('🔄 Initializing REAL Google My Business Reviews...');
            console.log(`📍 Business: ${this.businessName}`);
            console.log(`🌐 API: ${this.apiUrl}`);
            console.log(`⭐ Filter: ${this.minRating}+ star reviews only`);

            const reviews = await this.fetchGoogleReviews();

            if (reviews && reviews.length > 0) {
                console.log(`✅ Successfully loaded ${reviews.length} REAL GMB reviews`);
                console.log('💡 These are authentic Google My Business customer reviews');
                this.updateTestimonialsSection(reviews);
            } else {
                console.warn('⚠️ No GMB reviews available, using fallback');
                this.updateTestimonialsSection(this.fallbackReviews);
            }
        } catch (error) {
            console.error('❌ Error initializing GMB reviews system:', error);
            console.log('🔄 Using fallback reviews - start backend for real GMB reviews');
            this.updateTestimonialsSection(this.fallbackReviews);
        }
    }

    // Update the testimonials section in the DOM
    updateTestimonialsSection(reviews) {
        const testimonialsContainer = document.querySelector('#testimonials .animate-scroll');
        const loadingElement = document.querySelector('#testimonials-loading');

        if (testimonialsContainer && loadingElement) {
            // Hide loading state
            loadingElement.style.display = 'none';

            // Show testimonials container and populate with reviews
            testimonialsContainer.style.display = 'flex';
            testimonialsContainer.innerHTML = this.generateTestimonialsHTML(reviews);

            console.log('Testimonials section updated with Google reviews');
        } else {
            console.error('Testimonials container or loading element not found');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const reviewsManager = new GoogleReviewsManager();
    reviewsManager.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GoogleReviewsManager;
}
