"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Testimonials() {
  const [expandedCards, setExpandedCards] = useState<{ [key: number]: boolean }>({});
  const [reviews, setReviews] = useState<Array<{ name: string; text: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const TEXT_LIMIT = 150;

  useEffect(() => {
    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch('/api/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          throw new Error('Invalid reviews data');
        }
      } catch (error) {
        console.error('Error fetching Google reviews:', error);
        setError('Unable to load reviews at the moment. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleReviews();
  }, []);

  const handleReadMore = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const truncateText = (text: string) => {
    if (text.length <= TEXT_LIMIT) return text;
    return text.slice(0, TEXT_LIMIT).trim() + "...";
  };

  return (
    <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-500 font-medium mb-2 tracking-wide uppercase text-sm"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            What Our Clients Say
          </motion.h2>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading reviews...
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            {error}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No reviews available at the moment.
          </div>
        ) : (
          <div className="relative overflow-hidden mx-auto max-w-[95vw]">
            <motion.div 
              className="flex flex-nowrap gap-6 py-4"
              animate={{
                x: [0, -2000],
                transition: {
                  x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 60,
                    ease: "linear"
                  }
                }
              }}
            >
              {[...reviews, ...reviews].map((review, index) => (
                <motion.div
                  key={index}
                  className="flex-none w-[300px] md:w-[350px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <motion.div 
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    layout
                    transition={{ layout: { duration: 0.3 } }}
                  >
                    <div className="flex flex-col">
                      <div>
                        <motion.p 
                          className="text-gray-600 dark:text-gray-300 mb-3 italic"
                          layout="position"
                        >
                          "{expandedCards[index] ? review.text : truncateText(review.text)}"
                        </motion.p>
                        {review.text.length > TEXT_LIMIT && (
                          <button
                            onClick={() => handleReadMore(index)}
                            className="text-yellow-500 hover:text-yellow-600 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 rounded-md px-2 py-1 transition-colors duration-200"
                            aria-label={expandedCards[index] ? "Read less" : "Read more"}
                          >
                            {expandedCards[index] ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {review.name}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
} 