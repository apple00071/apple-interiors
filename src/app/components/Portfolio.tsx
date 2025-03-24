"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

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
  const [categories] = useState<string[]>([
    "Living Room",
    "Dining",
    "Bedroom",
    "Kitchen",
    "False Ceiling",
    "Pooja Room"
  ]);
  
  const [portfolioItems] = useState<PortfolioItem[]>([
    // Living Room Projects
    {
      id: 1,
      title: "Contemporary Living Space",
      category: "Living Room",
      images: [
        "/images/portfolio/living-room/1.png",
        "/images/portfolio/living-room/2.png",
        "/images/portfolio/living-room/3.png",
        "/images/portfolio/living-room/4.png",
        "/images/portfolio/living-room/7.png",
        "/images/portfolio/living-room/8.png"
      ],
      description: "Modern living room with elegant furnishings and ambient lighting",
      year: "2024",
      location: "Kukatpally, Hyderabad",
      area: "450"
    },
    {
      id: 2,
      title: "Luxurious Family Room",
      category: "Living Room",
      images: [
        "/images/portfolio/living-room/13.png",
        "/images/portfolio/living-room/17.png",
        "/images/portfolio/living-room/19.png",
        "/images/portfolio/living-room/20.png",
        "/images/portfolio/living-room/23.png",
        "/images/portfolio/living-room/26.png"
      ],
      description: "Spacious family living area with premium finishes",
      year: "2024",
      location: "Gachibowli, Hyderabad",
      area: "550"
    },

    // Dining Room Projects
    {
      id: 3,
      title: "Modern Dining Space",
      category: "Dining",
      images: [
        "/images/portfolio/dining/1.png",
        "/images/portfolio/dining/2.png",
        "/images/portfolio/dining/9.png",
        "/images/portfolio/dining/10.png",
        "/images/portfolio/dining/26.png",
        "/images/portfolio/dining/N2.png",
        "/images/portfolio/dining/N3.png",
        "/images/portfolio/dining/N4.png"
      ],
      description: "Contemporary dining area with custom lighting fixtures",
      year: "2024",
      location: "Madhapur, Hyderabad",
      area: "300"
    },
    {
      id: 4,
      title: "Elegant Dining Setup",
      category: "Dining",
      images: [
        "/images/portfolio/dining/2.png",
        "/images/portfolio/dining/9.png",
        "/images/portfolio/dining/10.png",
        "/images/portfolio/dining/26.png",
        "/images/portfolio/dining/N2.png",
        "/images/portfolio/dining/N3.png"
      ],
      description: "Sophisticated dining space with modern aesthetics",
      year: "2024",
      location: "Banjara Hills, Hyderabad",
      area: "350"
    },

    // Bedroom Projects
    {
      id: 5,
      title: "Master Bedroom Suite",
      category: "Bedroom",
      images: [
        "/images/portfolio/bedroom/3.png",
        "/images/portfolio/bedroom/18.png",
        "/images/portfolio/bedroom/21.png",
        "/images/portfolio/bedroom/25.png",
        "/images/portfolio/bedroom/26..png",
        "/images/portfolio/bedroom/27.png",
        "/images/portfolio/bedroom/32.png",
        "/images/portfolio/bedroom/33.png"
      ],
      description: "Luxurious master bedroom with walk-in wardrobe",
      year: "2024",
      location: "Jubilee Hills, Hyderabad",
      area: "400"
    },
    {
      id: 6,
      title: "Modern Guest Bedroom",
      category: "Bedroom",
      images: [
        "/images/portfolio/bedroom/38.png",
        "/images/portfolio/bedroom/49.png",
        "/images/portfolio/bedroom/70.png",
        "/images/portfolio/bedroom/99.png",
        "/images/portfolio/bedroom/104.png",
        "/images/portfolio/bedroom/110.png",
        "/images/portfolio/bedroom/J7.png",
        "/images/portfolio/bedroom/J8.png",
        "/images/portfolio/bedroom/N3.png"
      ],
      description: "Contemporary guest bedroom with minimalist design",
      year: "2024",
      location: "Kondapur, Hyderabad",
      area: "300"
    },

    // Kitchen Projects
    {
      id: 7,
      title: "Modern Modular Kitchen",
      category: "Kitchen",
      images: [
        "/images/portfolio/kitchen/J1.png",
        "/images/portfolio/kitchen/J2.png",
        "/images/portfolio/kitchen/J3.png",
        "/images/portfolio/kitchen/J4.png",
        "/images/portfolio/kitchen/J5.png",
        "/images/portfolio/kitchen/J6.png"
      ],
      description: "Fully equipped modular kitchen with premium appliances",
      year: "2024",
      location: "HITEC City, Hyderabad",
      area: "250"
    },
    {
      id: 8,
      title: "Contemporary Kitchen Design",
      category: "Kitchen",
      images: [
        "/images/portfolio/kitchen/J8.png",
        "/images/portfolio/kitchen/J9.png",
        "/images/portfolio/kitchen/J12.png",
        "/images/portfolio/kitchen/J14.png",
        "/images/portfolio/kitchen/J17.png",
        "/images/portfolio/kitchen/J18.png"
      ],
      description: "Modern kitchen with island and breakfast counter",
      year: "2024",
      location: "Manikonda, Hyderabad",
      area: "280"
    },

    // False Ceiling Projects
    {
      id: 9,
      title: "Elegant Living Room Ceiling",
      category: "False Ceiling",
      images: [
        "/images/portfolio/false-ceiling/1.png",
        "/images/portfolio/false-ceiling/2.png",
        "/images/portfolio/false-ceiling/7.png",
        "/images/portfolio/false-ceiling/8.png",
        "/images/portfolio/false-ceiling/10.png",
        "/images/portfolio/false-ceiling/11.png"
      ],
      description: "Sophisticated false ceiling with LED lighting",
      year: "2024",
      location: "Nallagandla, Hyderabad",
      area: "400"
    },
    {
      id: 10,
      title: "Modern Bedroom Ceiling",
      category: "False Ceiling",
      images: [
        "/images/portfolio/false-ceiling/26.png",
        "/images/portfolio/false-ceiling/27.png",
        "/images/portfolio/false-ceiling/34.png",
        "/images/portfolio/false-ceiling/37.png",
        "/images/portfolio/false-ceiling/40.png",
        "/images/portfolio/false-ceiling/50.png"
      ],
      description: "Contemporary ceiling design with ambient lighting",
      year: "2024",
      location: "Miyapur, Hyderabad",
      area: "320"
    },

    // Since there are no images in the pooja-room directory yet, 
    // I'll temporarily comment out these projects until images are available
    /*
    // Pooja Room Projects
    {
      id: 11,
      title: "Traditional Pooja Room",
      category: "Pooja Room",
      images: [
        "/images/portfolio/pooja-room/pooja-1.jpg",
        "/images/portfolio/pooja-room/pooja-2.jpg",
        "/images/portfolio/pooja-room/pooja-3.jpg"
      ],
      description: "Traditional pooja room with modern elements",
      year: "2024",
      location: "Kompally, Hyderabad",
      area: "100"
    },
    {
      id: 12,
      title: "Contemporary Pooja Space",
      category: "Pooja Room",
      images: [
        "/images/portfolio/pooja-room/pooja-4.jpg",
        "/images/portfolio/pooja-room/pooja-5.jpg",
        "/images/portfolio/pooja-room/pooja-6.jpg"
      ],
      description: "Modern pooja room with traditional aesthetics",
      year: "2024",
      location: "Chandanagar, Hyderabad",
      area: "80"
    }
    */
  ]);
  
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  if (isLoading) {
    return (
      <section className="py-24 md:py-32 bg-[#FAFAFA] dark:bg-[#111111]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
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