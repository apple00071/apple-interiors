"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import portfolioData from "../data/portfolio.json";
import { usePathname } from "next/navigation";

// Add a helper function to handle base path
const useBasePath = () => {
  const pathname = usePathname();
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? '' : '';  // Removed '/applenew' since we're using Vercel
};

// Add a helper function to handle image paths
const useImagePath = () => {
  const basePath = useBasePath();
  return (imagePath: string) => {
    // Remove leading slash if present
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${basePath}/${cleanPath}`;
  };
};

type PortfolioItem = {
  id: number;
  title: string;
  category: string;
  images: string[];
  description: string;
  year: string;
  location: string;
  area: string;
};

export default function Portfolio() {
  const getImagePath = useImagePath();
  const [categories] = useState<string[]>(portfolioData.categories);
  const [portfolioItems] = useState<PortfolioItem[]>(portfolioData.items);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredItems = portfolioItems.filter(item => item.category === activeCategory);

  console.log(`Total filtered items: ${filteredItems.length}`);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === selectedItem.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedItem.images.length - 1 : prev - 1
      );
    }
  };

  const handleItemClick = (item: PortfolioItem) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  if (!isMounted) {
    return null; // Return nothing until client-side hydration is complete
  }

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-[#FAFAFA] dark:bg-[#111111]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary-500 font-medium mb-4 tracking-wide uppercase"
          >
            Our Portfolio
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Featured Projects
          </motion.h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                    : "bg-gray-100 text-gray-600 hover:bg-primary-500/10 hover:text-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-primary-500/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredItems.reduce((allImages, item) => {
            // Only take the first image from each item
            if (!allImages.some(existing => existing.url === item.images[0])) {
              allImages.push({
                url: item.images[0],
                title: item.title,
                location: item.location,
                item: item
              });
            }
            return allImages;
          }, [] as Array<{ url: string; title: string; location: string; item: PortfolioItem }>)
          .map((imageData, index) => (
            <motion.div
              key={`${imageData.item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div 
                className="relative aspect-square overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5 cursor-pointer group"
                onClick={() => handleItemClick(imageData.item)}
              >
                <Image
                  src={getImagePath(imageData.url)}
                  alt={`${imageData.title} - ${imageData.location}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  unoptimized={false}
                  quality={75}
                  priority={index < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{imageData.title}</h3>
                    <p className="text-sm opacity-90">{imageData.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Portfolio Item Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => {
                setSelectedItem(null);
                setCurrentImageIndex(0);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-7xl bg-black rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button */}
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    setCurrentImageIndex(0);
                  }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-primary-500/20 backdrop-blur-md text-white hover:bg-primary-500/30 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Main Image Container */}
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={getImagePath(selectedItem.images[currentImageIndex])}
                      alt={`Portfolio Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      unoptimized={false}
                      quality={90}
                      sizes="(max-width: 1536px) 100vw, 1536px"
                      priority
                    />
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-primary-500/20 backdrop-blur-md text-white hover:bg-primary-500/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-primary-500/20 backdrop-blur-md text-white hover:bg-primary-500/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-primary-500/20 backdrop-blur-md text-white text-sm">
                    {currentImageIndex + 1} / {selectedItem.images.length}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
} 