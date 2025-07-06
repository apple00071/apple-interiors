'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Category {
  id: number;
  name: string;
}

interface PortfolioItem {
  id: number;
  image_paths: string[];
  category: string;
  created_at?: Date;
  updated_at?: Date;
}

interface PortfolioAdminProps {
  initialItems: PortfolioItem[];
  categories: Category[];
}

// Helper function to format category name for display
function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function PortfolioAdmin({ initialItems, categories }: PortfolioAdminProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Update image in a portfolio item
  const handleImageUpdate = async (e: React.ChangeEvent<HTMLInputElement>, itemId: number, imageIndex: number) => {
    if (!e.target.files || !e.target.files[0]) return;

    setIsLoading(true);
    setError(null);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageIndex', imageIndex.toString());

    try {
      const response = await fetch(`/api/admin/portfolio/${itemId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to update image');

      const data = await response.json();
      
      // Update the portfolioItems state
      setItems(items =>
        items.map(item =>
          item.id === itemId
            ? {
                ...item,
                image_paths: item.image_paths.map((path, idx) =>
                  idx === imageIndex ? data.imagePath : path
                )
              }
            : item
        )
      );

      setSuccessMessage('Image updated successfully');
      setTimeout(() => setSuccessMessage(''), 2000);
    } catch (err) {
      setError('Failed to update image');
      console.error(err);
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* List of existing items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4">
            <p className="text-gray-600 mb-2">{formatCategoryName(item.category)}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {item.image_paths.map((image, index) => (
                <div key={index} className="relative">
                  <div className="relative aspect-video">
                    <Image
                      src={image}
                      alt={`Portfolio Image ${index + 1}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpdate(e, item.id, index)}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 