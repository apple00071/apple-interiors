"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Add or replace with your actual brand logos
const brands = [
  {
    name: "Godrej Interio",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Premium furniture and interior solutions"
  },
  {
    name: "Asian Paints",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "High-quality paints and finishes"
  },
  {
    name: "Sleek by Asian Paints",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Luxury modular kitchens"
  },
  {
    name: "Kajaria",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Designer tiles and flooring"
  },
  {
    name: "Hindware",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Premium bathroom fixtures"
  },
  {
    name: "Hafele",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Innovative hardware solutions"
  },
  {
    name: "Saint-Gobain",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Glass and glazing solutions"
  },
  {
    name: "Hettich",
    logo: "/images/brands/placeholder-logo.svg", // Replace with actual path to logo
    description: "Precision furniture fittings"
  }
];

export default function Brands() {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const totalPages = Math.ceil(brands.length / getItemsPerPage());
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  function getItemsPerPage() {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 1024) return 3;
      return 4;
    }
    return 4;
  }
  
  const stopAutoplay = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
      autoplayTimeoutRef.current = null;
    }
  };

  const nextPage = () => {
    setDirection(1);
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setDirection(-1);
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    const startAutoplay = () => {
      stopAutoplay();
      autoplayTimeoutRef.current = setTimeout(() => {
        nextPage();
        startAutoplay();
      }, 3000);
    };

    startAutoplay();

    return () => {
      stopAutoplay();
    };
  }, [totalPages]);

  // Get current visible items
  const itemsPerPage = getItemsPerPage();
  const visibleBrands = brands.slice(
    currentPage * itemsPerPage, 
    Math.min((currentPage + 1) * itemsPerPage, brands.length)
  );

  return (
    <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium mb-3 tracking-wide uppercase text-sm"
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
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-400"
          >
            We collaborate with industry-leading brands to ensure quality, durability, and exceptional design in every project
          </motion.p>
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={nextPage}
              className="pointer-events-auto p-2 rounded-full bg-transparent dark:bg-transparent shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="Next brands"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Carousel Content */}
          <div className="relative h-40 md:h-48 overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div 
                key={currentPage}
                custom={direction}
                initial={{ 
                  x: direction > 0 ? 300 : -300,
                  opacity: 0 
                }}
                animate={{ 
                  x: 0,
                  opacity: 1 
                }}
                exit={{ 
                  x: direction < 0 ? 300 : -300,
                  opacity: 0 
                }}
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
                      className="flex flex-col items-center justify-center"
                    >
                      <div className="relative h-16 sm:h-20 md:h-24 w-full mb-4 p-3 transition-all duration-200">
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          fill
                          className="object-contain filter dark:brightness-90 transition-all duration-200 hover:scale-105"
                          title={brand.description}
                        />
                      </div>
                      <h3 className="text-xs sm:text-sm text-center font-medium text-gray-600 dark:text-gray-400">{brand.name}</h3>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Page Indicator Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  stopAutoplay();
                  setDirection(index > currentPage ? 1 : -1);
                  setCurrentPage(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 focus:outline-none ${
                  index === currentPage
                    ? "bg-primary w-8"
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