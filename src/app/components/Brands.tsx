"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

// Brand logos configuration
const brands = [
  {
    name: "Logo",
    logo: "/images/brands/logo.png"
  },
  {
    name: "Logo 2",
    logo: "/images/brands/logo2-300x102.png"
  },
  {
    name: "Sleek",
    logo: "/images/brands/Sleek_logo-300x212.jpg"
  },
  {
    name: "Greenply",
    logo: "/images/brands/greenply-logo-469D8F2DFE-seeklogo.com_.png"
  },
  {
    name: "Download",
    logo: "/images/brands/download-300x112.png"
  },
  {
    name: "Hafele",
    logo: "/images/brands/hafele-300x300.jpg"
  },
  {
    name: "Download 2",
    logo: "/images/brands/download.jpg"
  },
  {
    name: "Hettich",
    logo: "/images/brands/hettich-300x225.png"
  }
];

export default function Brands() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4); // Default for SSR
  const [isMounted, setIsMounted] = useState(false);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update items per page based on window size
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setItemsPerPage(2);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(4);
    }

    handleResize(); // Initial call
    setIsMounted(true);
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalPages = Math.ceil(brands.length / itemsPerPage);
  
  const stopAutoplay = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  }, []);

  const nextPage = useCallback(() => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimeoutRef.current = setTimeout(() => {
        nextPage();
        startAutoplay();
      }, 3000);
    };

    startAutoplay();
    return () => stopAutoplay();
  }, [nextPage, stopAutoplay]);

  // Get current visible items
  const visibleBrands = brands.slice(
    currentPage * itemsPerPage,
    Math.min((currentPage + 1) * itemsPerPage, brands.length)
  );

  if (!isMounted) {
    return null; // Return nothing until client-side hydration is complete
  }

  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-yellow-500 font-medium mb-3 tracking-wide uppercase text-sm"
          >
            Our Trusted Partners
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Premium Brands We Work With
          </motion.h2>
        </div>

        {/* Logo Carousel */}
        <div className="relative max-w-6xl mx-auto px-2">
          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between z-10 pointer-events-none">
            <button
              onClick={prevPage}
              className="pointer-events-auto p-2 rounded-full bg-transparent dark:bg-transparent shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Previous brands"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={nextPage}
              className="pointer-events-auto p-2 rounded-full bg-transparent dark:bg-transparent shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next brands"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Carousel Content */}
          <div className="relative h-32 md:h-40 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div 
                key={currentPage}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction < 0 ? 300 : -300, opacity: 0 }}
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 }
                }}
                className="absolute w-full h-full"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 h-full">
                  {visibleBrands.map((brand, index) => (
                    <div
                      key={`${currentPage}-${index}`}
                      className="flex items-center justify-center p-4 overflow-visible"
                    >
                      <div className="relative h-16 sm:h-20 md:h-24 w-full transition-transform duration-300 ease-in-out hover:scale-105 transform-gpu">
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          fill
                          className="object-contain filter dark:brightness-90"
                          onError={(e) => {
                            console.error(`Failed to load logo: ${brand.logo}`);
                            e.currentTarget.src = '/images/brands/placeholder-logo.svg';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page Indicator Dots */}
          <div className="hidden sm:flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  stopAutoplay();
                  setDirection(index > currentPage ? 1 : -1);
                  setCurrentPage(index);
                }}
                className={`w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full transition-all duration-200 focus:outline-none ${
                  index === currentPage
                    ? "bg-primary w-5 md:w-8"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-primary/50"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 