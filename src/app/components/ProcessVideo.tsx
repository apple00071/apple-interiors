"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProcessVideo() {
  // YouTube embed URL with additional parameters for better mobile experience
  const videoEmbedUrl = "https://www.youtube.com/embed/Av5O1EjRGuA?rel=0&showinfo=0&playsinline=1";
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-500 font-medium mb-3 tracking-wide uppercase text-sm"
          >
            Our Process
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            How We Work
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Watch our detailed process of transforming spaces into beautiful interiors
          </motion.p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Video Container with fallback for mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-xl"
          >
            {isMobile ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <p className="text-gray-600 mb-4 text-center">For the best viewing experience:</p>
                <a 
                  href="https://www.youtube.com/watch?v=Av5O1EjRGuA" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white py-2 px-4 rounded-lg flex items-center"
                >
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                  </svg>
                  Watch on YouTube
                </a>
              </div>
            ) : (
              <iframe
                src={videoEmbedUrl}
                className="absolute inset-0 w-full h-full"
                title="Apple Interiors Design Process"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center" style={{ color: '#eab308' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Initial Consultation</h3>
              <p className="text-gray-600">Understanding your vision and requirements for the perfect space</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center" style={{ color: '#eab308' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Design & Planning</h3>
              <p className="text-gray-600">Creating detailed designs and selecting materials for your space</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-yellow-500/10 flex items-center justify-center" style={{ color: '#eab308' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Execution</h3>
              <p className="text-gray-600">Transforming designs into reality with expert craftsmanship</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 