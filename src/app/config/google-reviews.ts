// Google Reviews Configuration

// To find your Google Place ID:
// 1. Go to https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
// 2. Enter your business name and location
// 3. Copy the Place ID that appears

// To get a Google Maps API key:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project
// 3. Enable the Places API and Maps JavaScript API
// 4. Create credentials (API key)
// 5. Restrict the API key to only the APIs you need

export const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key
export const GOOGLE_PLACE_ID = "YOUR_GOOGLE_PLACE_ID"; // Replace with your business Place ID
export const GOOGLE_REVIEWS_LANGUAGE = "en"; // Language for reviews (e.g., 'en' for English)

// If you prefer not to use an API key, you can use the GoogleReviewsWidget component
// which uses an iframe embed from SociableKit instead of the Google Places API 