import { NextResponse } from 'next/server';

const GOOGLE_API_KEY = "AIzaSyA4vDnagg1GLN1aNHs6UIx7H5nXm1uR4gM";
const GOOGLE_PLACE_ID = "ChIJa9NvcamRyzsR3KG5xzhZ5m4";

export async function GET() {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews&key=${GOOGLE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews from Google Places API');
    }

    const data = await response.json();
    
    if (!data.result || !Array.isArray(data.result.reviews)) {
      return NextResponse.json({ reviews: [] });
    }

    // Filter and format reviews
    const reviews = data.result.reviews
      .filter((review: any) => review.rating >= 4)
      .map((review: any) => ({
        name: review.author_name,
        text: review.text
      }));

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
} 