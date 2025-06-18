"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GoogleReviewsProps {
  placeId: string;
  apiKey?: string;
  language?: string;
}

const GoogleReviews = ({
  placeId,
  apiKey,
  language = "en",
}: GoogleReviewsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // Skip if already loaded or no container
    if (scriptLoaded.current || !containerRef.current) return;

    // Create script element
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${language}`;
    script.async = true;
    script.defer = true;
    script.onload = initializeWidget;
    
    // Add script to document
    document.head.appendChild(script);
    
    // Clean up
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey, language]);

  const initializeWidget = () => {
    // Use type assertion for the entire window object
    const win = window as any;
    if (!win.google || !containerRef.current) return;
    
    const { google } = win;
    
    // Create a PlacesService instance
    const service = new google.maps.places.PlacesService(containerRef.current);
    
    // Request place details including reviews
    service.getDetails(
      {
        placeId: placeId,
        fields: ["name", "rating", "reviews", "user_ratings_total"],
      },
      (place: any, status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          renderReviews(place);
        } else {
          console.error("Error fetching Google reviews:", status);
          if (containerRef.current) {
            containerRef.current.innerHTML = 
              '<p class="text-red-500">Error loading Google Reviews. Please try again later.</p>';
          }
        }
      }
    );
    
    scriptLoaded.current = true;
  };

  const renderReviews = (place: any) => {
    if (!containerRef.current) return;
    
    // Clear the container
    containerRef.current.innerHTML = "";
    
    // Create header with business info
    const header = document.createElement("div");
    header.className = "flex flex-col items-center mb-6";
    
    const name = document.createElement("h3");
    name.className = "text-xl font-semibold mb-2";
    name.textContent = place.name;
    
    const ratingContainer = document.createElement("div");
    ratingContainer.className = "flex items-center gap-2 mb-1";
    
    const ratingStars = document.createElement("div");
    ratingStars.className = "flex items-center";
    
    // Add stars based on rating
    const rating = Math.round(place.rating * 2) / 2; // Round to nearest 0.5
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.className = "text-yellow-400";
      if (i <= rating) {
        star.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
      } else if (i - 0.5 === rating) {
        star.innerHTML = `<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
      } else {
        star.innerHTML = `<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>`;
      }
      ratingStars.appendChild(star);
    }
    
    const ratingText = document.createElement("span");
    ratingText.className = "text-sm text-gray-600 dark:text-gray-400";
    ratingText.textContent = `${place.rating} out of 5 (${place.user_ratings_total} reviews)`;
    
    ratingContainer.appendChild(ratingStars);
    ratingContainer.appendChild(ratingText);
    
    header.appendChild(name);
    header.appendChild(ratingContainer);
    
    // Add "View on Google" link
    const viewLink = document.createElement("a");
    viewLink.href = `https://search.google.com/local/reviews?placeid=${placeId}`;
    viewLink.target = "_blank";
    viewLink.rel = "noopener noreferrer";
    viewLink.className = "text-blue-600 hover:underline text-sm mt-2";
    viewLink.textContent = "View all reviews on Google";
    header.appendChild(viewLink);
    
    containerRef.current.appendChild(header);
    
    // Create reviews container
    const reviewsContainer = document.createElement("div");
    reviewsContainer.className = "space-y-6";
    
    // Add reviews (limit to 5)
    const reviews = place.reviews?.slice(0, 5) || [];
    
    reviews.forEach((review: any) => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow-sm";
      
      const reviewHeader = document.createElement("div");
      reviewHeader.className = "flex items-center mb-2";
      
      const authorImage = document.createElement("img");
      authorImage.src = review.profile_photo_url;
      authorImage.alt = review.author_name;
      authorImage.className = "w-10 h-10 rounded-full mr-3";
      
      const authorInfo = document.createElement("div");
      
      const authorName = document.createElement("p");
      authorName.className = "font-medium text-gray-900 dark:text-white";
      authorName.textContent = review.author_name;
      
      const reviewDate = document.createElement("p");
      reviewDate.className = "text-xs text-gray-500 dark:text-gray-400";
      reviewDate.textContent = new Date(review.time * 1000).toLocaleDateString();
      
      authorInfo.appendChild(authorName);
      authorInfo.appendChild(reviewDate);
      
      reviewHeader.appendChild(authorImage);
      reviewHeader.appendChild(authorInfo);
      
      const reviewRating = document.createElement("div");
      reviewRating.className = "flex items-center mb-2";
      
      for (let i = 1; i <= 5; i++) {
        const star = document.createElement("span");
        star.className = i <= review.rating ? "text-yellow-400" : "text-gray-300";
        star.innerHTML = `<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>`;
        reviewRating.appendChild(star);
      }
      
      const reviewText = document.createElement("p");
      reviewText.className = "text-gray-700 dark:text-gray-300";
      reviewText.textContent = review.text;
      
      reviewElement.appendChild(reviewHeader);
      reviewElement.appendChild(reviewRating);
      reviewElement.appendChild(reviewText);
      
      reviewsContainer.appendChild(reviewElement);
    });
    
    containerRef.current.appendChild(reviewsContainer);
  };

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-500 font-medium mb-4 tracking-wide uppercase text-sm"
          >
            Google Reviews
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            What People Are Saying
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            See what our clients are saying about us on Google
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div 
            ref={containerRef} 
            className="min-h-[200px] flex items-center justify-center"
          >
            <p className="text-gray-500">Loading Google Reviews...</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviews; 