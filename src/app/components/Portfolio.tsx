"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import portfolioData from "../data/portfolio.json";

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
  const [categories] = useState<string[]>(portfolioData.categories);
  const [portfolioItems] = useState<PortfolioItem[]>(portfolioData.items);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems = portfolioItems.filter(item => {
    console.log(`Filtering item: ${item.title}, Category: ${item.category}, Active Category: ${activeCategory}`);
    return item.category === activeCategory;
  });

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

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-[#FAFAFA] dark:bg-[#111111]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium mb-3 tracking-wide uppercase text-sm"
          >
            Our Portfolio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white mb-6"
          >
            Featured Work
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 text-sm transition-all duration-300 rounded-full
                  ${activeCategory === category
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                {category}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredItems.reduce((allImages, item) => {
            // Add all images from this item to the array
            item.images.forEach(image => {
              if (!allImages.some(existing => existing.url === image)) {
                allImages.push({
                  url: image,
                  title: item.title,
                  location: item.location,
                  item: item
                });
              }
            });
            return allImages;
          }, [] as Array<{ url: string; title: string; location: string; item: PortfolioItem }>)
          // Take only the first 6 images
          .slice(0, 6)
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
                  src={imageData.url}
                  alt={`${imageData.title} - Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized={false}
                  quality={75}
                  priority={index < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={(e) => {
                    console.error(`Failed to load image: ${imageData.url}`);
                    e.currentTarget.src = '/images/placeholder.jpg';
                  }}
                />
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
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
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
                      src={selectedItem.images[currentImageIndex]}
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm">
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