'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  category_id: string;
  image_url: string;
}

const categories = [
  { id: 'living-room', name: 'Living Room' },
  { id: 'dining', name: 'Dining' },
  { id: 'bedroom', name: 'Bedroom' },
  { id: 'kitchen', name: 'Kitchen' },
  { id: 'false-ceiling', name: 'False Ceiling' }
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  const fetchPortfolioItems = async () => {
    try {
      console.log('Fetching portfolio items...');
      const response = await fetch('/api/admin/portfolio');
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio items');
      }
      const data = await response.json();
      console.log('API Response:', data);
      setPortfolioItems(data.data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
      alert('Failed to load portfolio items');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedCategory) return;
    
    const file = e.target.files[0];
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', selectedCategory);

    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload portfolio item');
      }

      await fetchPortfolioItems();
      alert('Portfolio item uploaded successfully!');
    } catch (error) {
      console.error('Error uploading portfolio item:', error);
      alert('Failed to upload portfolio item. Please try again.');
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  const handleUpdate = async (e: React.ChangeEvent<HTMLInputElement>, itemId: number) => {
    if (!e.target.files || !e.target.files[0] || !selectedCategory) return;
    
    const file = e.target.files[0];
    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', selectedCategory);
    formData.append('id', itemId.toString());

    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update portfolio item');
      }

      await fetchPortfolioItems();
      alert('Portfolio item updated successfully!');
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      alert('Failed to update portfolio item. Please try again.');
    } finally {
      setUploading(false);
      // Reset the file input
      e.target.value = '';
    }
  };

  // Filter items based on selected category
  const filteredItems = selectedCategory 
    ? portfolioItems.filter(item => {
        console.log('Filtering item:', {
          itemCategory: item.category_id,
          selectedCategory,
          matches: item.category_id === selectedCategory
        });
        return item.category_id === selectedCategory;
      })
    : [];

  console.log('Current State:', {
    selectedCategory,
    totalItems: portfolioItems.length,
    filteredItems: filteredItems.length
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Management</h1>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-lg text-center transition-colors ${
              selectedCategory === category.id
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="font-semibold">{category.name}</div>
          </button>
        ))}
      </div>

      {/* Selected Category Content */}
      {selectedCategory && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upload New Image Card */}
            <div className="relative group border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 h-48 flex items-center justify-center">
              <label className="cursor-pointer text-center">
                <div className="text-gray-500 mb-2">+ Add New Image</div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Existing Images */}
            {filteredItems.map((item) => (
              <div key={item.id} className="relative group border rounded-lg overflow-hidden">
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                    <Image
                      src={item.image_url}
                      alt={`Portfolio item - ${item.category_id}`}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        console.error('Error loading image:', {
                          url: item.image_url,
                          category: item.category_id,
                          error: e
                        });
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                      unoptimized={true}
                      priority={true}
                    />
                  </div>
                  {/* Update Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600">
                      Update Image
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleUpdate(e, item.id)}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
                <div className="p-2 text-sm text-gray-500">
                  Image URL: {item.image_url}
                  <br />
                  Category: {item.category_id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedCategory && (
        <div className="text-center text-gray-500 mt-8">
          Please select a category to manage images
        </div>
      )}
    </div>
  );
}