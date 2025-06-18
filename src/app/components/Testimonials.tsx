"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GOOGLE_PLACE_ID } from "../config/google-reviews";

const testimonials = [
  {
    id: 1,
    content: "I'm extremely happy with the interior work done by Apple Interiors for our independent house. Their design sense, attention to detail, and commitment to timelines are the best. The team was professional, responsive, and made the entire process smooth and enjoyable. I highly recommend them for anyone looking for quality interiors with a personal touch!",
    author: "Srinivas Kothuri"
  },
  {
    id: 2,
    content: "Apple interiors have been awesome!!! They were able to put to life what I had always dreamed of! They are prompt, reliable, honest, CREATIVE, ARTISTIC, and nice all at the same time which is not always easy to find designers like them! I highly recommend Apple interiors!",
    author: "Samatha Yeluri"
  },
  {
    id: 3,
    content: "We had an awesome experience with Apple interiors company for completing our Mayfair apartment interiors. Aravind garu is always reachable and he listens very well to our requirements/requests and complete the work with great quality. We liked the overall output of the interior work and the material used is of great quality. I definitely suggest Apple interiors for others as well.",
    author: "Srikanth Ande"
  }
];

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isGoogleReviewsLoaded, setIsGoogleReviewsLoaded] = useState(false);
  const [googleReviewsError, setGoogleReviewsError] = useState(false);
  const [googleReviews, setGoogleReviews] = useState<{ author: string; content: string }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const scriptLoaded = useRef(false);

  const nextTestimonial = () => {
    if (googleReviews.length > 0) {
      setActiveTestimonial((prev) => (prev + 1) % googleReviews.length);
    } else {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (googleReviews.length > 0) {
      setActiveTestimonial((prev) => (prev - 1 + googleReviews.length) % googleReviews.length);
    } else {
      setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  // Check if Google Place ID is valid
  const hasValidPlaceId = GOOGLE_PLACE_ID && GOOGLE_PLACE_ID !== "YOUR_GOOGLE_PLACE_ID";

  // Function to handle iframe load events
  const handleIframeLoad = () => {
    setIsGoogleReviewsLoaded(true);
  };

  // Function to handle iframe error events
  const handleIframeError = () => {
    setGoogleReviewsError(true);
  };

  // Fetch Google reviews data
  useEffect(() => {
    if (!hasValidPlaceId || scriptLoaded.current) return;

    const fetchGoogleReviews = () => {
      // Create script element
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (!window.google || !window.google.maps || !window.google.maps.places) {
          setGoogleReviewsError(true);
          return;
        }
        
        // Create a hidden div for PlacesService
        const placesDiv = document.createElement("div");
        placesDiv.style.display = "none";
        document.body.appendChild(placesDiv);
        
        const service = new window.google.maps.places.PlacesService(placesDiv);
        
        service.getDetails(
          {
            placeId: GOOGLE_PLACE_ID,
            fields: ["reviews"]
          },
          (place: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && place && place.reviews) {
              const reviews = place.reviews.map((review: any) => ({
                author: review.author_name,
                content: review.text
              }));
              setGoogleReviews(reviews);
            } else {
              setGoogleReviewsError(true);
            }
          }
        );
      };
      
      script.onerror = () => {
        setGoogleReviewsError(true);
      };
      
      document.head.appendChild(script);
      scriptLoaded.current = true;
    };

    fetchGoogleReviews();
    
    return () => {
      // Cleanup
      if (scriptLoaded.current) {
        const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
        scripts.forEach(script => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
      }
    };
  }, [hasValidPlaceId]);

  // Determine which testimonials to show
  const currentTestimonials = googleReviews.length > 0 ? googleReviews : testimonials;
  const currentTestimonial = currentTestimonials[activeTestimonial] || currentTestimonials[0];

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
            {googleReviews.length > 0 ? "Google Reviews" : "Testimonials"}
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            What Our Clients Say
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            {googleReviews.length > 0 
              ? "See what our clients are saying about us on Google" 
              : "Hear from our satisfied clients about their experience working with Apple Interiors"
            }
          </motion.p>
        </div>

        {/* Google Reviews Widget (hidden but used for visual display) */}
        {hasValidPlaceId && (
          <div className="hidden">
            <iframe 
              ref={iframeRef}
              src={`https://widgets.sociablekit.com/google-reviews/iframe/${GOOGLE_PLACE_ID}`} 
              title="Google Reviews Widget" 
              width="100%" 
              height="600" 
              frameBorder="0"
              className="rounded-lg shadow-lg"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
            ></iframe>
          </div>
        )}

        {/* Testimonials Display (Shows Google Reviews or fallback testimonials) */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
            <button
              onClick={prevTestimonial}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <span className="text-xl font-bold">&larr;</span>
            </button>
            <button
              onClick={nextTestimonial}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <span className="text-xl font-bold">&rarr;</span>
            </button>
          </div>

          {/* Testimonials Slider */}
          <div className="relative overflow-hidden">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-primary/10 dark:text-primary/20">
                <span className="text-4xl">&ldquo;</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mb-8 font-serif italic">
                  &ldquo;{currentTestimonial.content}&rdquo;
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {currentTestimonial.author}
                  </h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Navigation Dots */}
          <div className="hidden sm:flex justify-center space-x-2 mt-8">
            {currentTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 ${
                  index === activeTestimonial
                    ? "bg-primary w-5 md:w-8"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* View all Google Reviews link */}
        {googleReviews.length > 0 && (
          <div className="mt-8 text-center">
            <a 
              href={`https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>View all reviews on Google</span>
              <span className="ml-1">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
} 