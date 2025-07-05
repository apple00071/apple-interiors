"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Define all available categories
const DEFAULT_CATEGORIES = [
  'Living Room',
  'Dining',
  'Bedroom',
  'Kitchen',
  'False Ceiling'
];

interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  year: string;
  location: string;
  area: string;
}

// Add a helper function to handle base path
const useBasePath = () => {
  const pathname = usePathname();
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? '' : '';
};

// Add a helper function to handle image paths
const useImagePath = () => {
  const basePath = useBasePath();
  return (imagePath: string) => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    // Only add slash if basePath exists
    return basePath ? `${basePath}/${cleanPath}` : cleanPath;
  };
};

export default function Portfolio() {
  const getImagePath = useImagePath();
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(DEFAULT_CATEGORIES[0]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) {
          throw new Error('Failed to fetch portfolio data');
        }
        const data = await response.json();
        setPortfolioItems(data.items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setLoading(false);
      }
    };

    fetchPortfolioData();
    setIsMounted(true);
  }, []);

  const filteredItems = portfolioItems.filter(item => {
    const itemCategory = item.category.toLowerCase().replace(/-/g, ' ');
    const selectedCategory = activeCategory.toLowerCase();
    return itemCategory === selectedCategory;
  });

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

  if (!isMounted || loading) {
    return <div className="min-h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <section id="portfolio" className="py-16 md:py-20 lg:py-24 bg-white dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Our Portfolio
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredItems.slice(0, 6).map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div 
                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                <Image
                  src={getImagePath(item.images[0])}
                  alt="Portfolio Image"
                  fill
                  className="object-cover"
                  unoptimized={false}
                  quality={75}
                  priority={index < 4}
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative max-w-7xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute right-4 top-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="relative">
                  {/* Main Image */}
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={getImagePath(selectedItem.images[currentImageIndex])}
                      alt="Portfolio Image"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/20 backdrop-blur-md text-white hover:bg-yellow-500/30 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500/20 backdrop-blur-md text-white hover:bg-yellow-500/30 transition-colors"
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