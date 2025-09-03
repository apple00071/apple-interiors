"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SectionHeading from './ui/SectionHeading';
import PortfolioSEO from '../../components/PortfolioSEO';

interface Category {
  id: number;
  name: string;
}

interface PortfolioItem {
  id: number;
  image_paths: string[];
  category: string;
  title?: string;
}

interface PortfolioProps {
  items: PortfolioItem[];
  categories: Category[];
}

const MAX_IMAGES = 6;

// Helper function to format category name for display
function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper function to generate SEO-friendly alt text
function generateAltText(category: string, index: number): string {
  const descriptions: { [key: string]: string[] } = {
    'bedroom': [
      'Luxury Master Bedroom Design by Apple Interiors Hyderabad',
      'Modern Bedroom Interior with Custom Wardrobe',
      'Contemporary Bedroom Design with False Ceiling',
      'Kids Bedroom Interior Design in Hyderabad',
      'Guest Bedroom Design with Study Area',
      'Premium Bedroom Interior with Walk-in Closet'
    ],
    'living-room': [
      'Contemporary Living Room Design by Apple Interiors',
      'Modern Living Room with False Ceiling and TV Unit',
      'Luxury Living Room Interior Design Hyderabad',
      'Spacious Living Room with Premium Furniture',
      'Designer Living Room with LED Lighting',
      'Elegant Living Room with Sofa Set Design'
    ],
    'kitchen': [
      'Modern Modular Kitchen Design by Apple Interiors',
      'Contemporary Kitchen with Island Counter',
      'L-Shaped Modular Kitchen Design Hyderabad',
      'Parallel Kitchen with Premium Accessories',
      'Luxury Kitchen Interior with Breakfast Counter',
      'Smart Kitchen Design with Storage Solutions'
    ],
    'dining': [
      'Elegant Dining Room Design by Apple Interiors',
      'Modern Dining Area with False Ceiling',
      'Contemporary Dining Space with Crockery Unit',
      'Luxury Dining Room Interior Hyderabad',
      'Family Dining Room with Storage Solutions',
      'Premium Dining Area Design with Lighting'
    ],
    'false-ceiling': [
      'Designer False Ceiling by Apple Interiors Hyderabad',
      'Modern LED False Ceiling Design',
      'Contemporary POP False Ceiling',
      'Luxury False Ceiling with Cove Lighting',
      'Premium Gypsum False Ceiling Design',
      'Elegant False Ceiling with Wooden Elements'
    ]
  };

  const categoryKey = category.toLowerCase().replace(' ', '-');
  return descriptions[categoryKey]?.[index] || `${formatCategoryName(category)} Interior Design by Apple Interiors Hyderabad`;
}

export default function Portfolio({ items, categories }: PortfolioProps) {
  const [isClient, setIsClient] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('bedroom');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageDetails, setSelectedImageDetails] = useState<{src: string, alt: string} | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  ).slice(0, MAX_IMAGES);

  if (!isClient) {
    return <div className="min-h-[400px] flex items-center justify-center">
      <div className="animate-pulse">Loading...</div>
    </div>;
  }

  return (
    <>
      <PortfolioSEO images={allImages} />
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
                {formatCategoryName(category.name)}
              </button>
            ))}
          </div>

          {/* Portfolio grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allImages.map((image, index) => (
              <div 
                key={`${image.src}-${index}`}
                className="group cursor-pointer"
                onClick={() => {
                  setSelectedImage(image.src);
                  setSelectedImageDetails({
                    src: image.src,
                    alt: generateAltText(image.category, index)
                  });
                }}
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                  <Image
                    src={image.src}
                    alt={generateAltText(image.category, index)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    quality={75}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImageDetails && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedImage(null);
            setSelectedImageDetails(null);
          }}
        >
          <div className="relative w-full max-w-6xl h-[80vh]">
            <Image
              src={selectedImageDetails.src}
              alt={selectedImageDetails.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
              quality={90}
            />
            <button 
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
                setSelectedImageDetails(null);
              }}
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