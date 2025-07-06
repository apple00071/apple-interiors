"use client";

import { useState } from 'react';
import Image from 'next/image';
import SectionHeading from './ui/SectionHeading';

interface Category {
  id: number;
  name: string;
}

interface PortfolioItem {
  id: number;
  image_paths: string[];
  category: string;
}

interface PortfolioProps {
  items: PortfolioItem[];
  categories: Category[];
}

const MAX_IMAGES = 6;

export default function Portfolio({ items, categories }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Bedroom');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!Array.isArray(items) || !Array.isArray(categories)) {
    console.error('Invalid props:', { items, categories });
    return null;
  }

  if (!items.length || !categories.length) {
    return null;
  }

  // Get all images for the selected category
  const selectedItems = items.filter(item => item.category === selectedCategory);
  const allImages = selectedItems.flatMap(item => 
    item.image_paths.map(path => ({
      src: path,
      category: item.category
    }))
  ).slice(0, MAX_IMAGES); // Limit to 6 images

  return (
    <>
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Section Title */}
          <SectionHeading 
            title="Featured Projects"
            subtitle="Our Portfolio"
            subtitleFirst={true}
          />

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.name
                    ? 'bg-[#FFD93D] text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Portfolio grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allImages.map((image, index) => (
              <div 
                key={index} 
                className="group cursor-pointer"
                onClick={() => setSelectedImage(image.src)}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={image.src}
                    alt={`${image.category} Project`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full max-w-6xl h-[80vh]">
            <Image
              src={selectedImage}
              alt="Enlarged portfolio image"
              fill
              className="object-contain"
              sizes="100vw"
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              onClick={() => setSelectedImage(null)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
} 