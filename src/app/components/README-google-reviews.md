# Google Reviews Components

This directory contains two components for displaying Google Reviews on your website:

## 1. GoogleReviewsWidget (Recommended)

This component uses an iframe embed from SociableKit to display Google Reviews. It doesn't require an API key and is very easy to set up.

### Usage

```jsx
import GoogleReviewsWidget from "./components/GoogleReviewsWidget";
import { GOOGLE_PLACE_ID } from "./config/google-reviews";

// In your component or page:
<GoogleReviewsWidget placeId={GOOGLE_PLACE_ID} />
```

## 2. GoogleReviews (Advanced)

This component uses the Google Places API to fetch and display reviews. It requires a Google Maps API key with the Places API enabled.

### Usage

```jsx
import GoogleReviews from "./components/GoogleReviews";
import { GOOGLE_MAPS_API_KEY, GOOGLE_PLACE_ID, GOOGLE_REVIEWS_LANGUAGE } from "./config/google-reviews";

// In your component or page:
<GoogleReviews 
  placeId={GOOGLE_PLACE_ID}
  apiKey={GOOGLE_MAPS_API_KEY}
  language={GOOGLE_REVIEWS_LANGUAGE}
/>
```

## Setup Instructions

1. Find your Google Place ID:
   - Go to https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
   - Enter your business name and location
   - Copy the Place ID that appears

2. Update the configuration file:
   - Open `src/app/config/google-reviews.ts`
   - Replace `YOUR_GOOGLE_PLACE_ID` with your actual Place ID

3. (Optional) If using the GoogleReviews component:
   - Get a Google Maps API key from https://console.cloud.google.com/
   - Enable the Places API and Maps JavaScript API
   - Create credentials (API key)
   - Restrict the API key to only the APIs you need
   - Update `GOOGLE_MAPS_API_KEY` in the config file

## Customization

Both components can be customized by modifying their respective files:

- `GoogleReviewsWidget.tsx`: Customize the iframe embed and styling
- `GoogleReviews.tsx`: Customize the display of reviews fetched from the Google Places API

## Troubleshooting

- If the GoogleReviewsWidget iframe doesn't load, check that your Place ID is correct
- If the GoogleReviews component shows an error, check that your API key is valid and has the Places API enabled
- For both components, ensure your business has reviews on Google 