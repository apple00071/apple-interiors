"use client";

import { motion } from "framer-motion";

interface GoogleReviewsWidgetProps {
  placeId: string;
}

const GoogleReviewsWidget = ({ placeId }: GoogleReviewsWidgetProps) => {
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
          <div className="flex justify-center">
            <iframe 
              src={`https://widgets.sociablekit.com/google-reviews/iframe/${placeId}`} 
              title="Google Reviews Widget" 
              width="100%" 
              height="800" 
              frameBorder="0"
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
          
          <div className="mt-8 text-center">
            <a 
              href={`https://search.google.com/local/reviews?placeid=${placeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>View all reviews on Google</span>
              <span className="ml-1">↗</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GoogleReviewsWidget; 