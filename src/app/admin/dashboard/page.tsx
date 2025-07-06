'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/contexts/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface PortfolioItem {
  id: number;
  image_paths: string[];
  category: string;
}

interface Category {
  id: number;
  name: string;
}

// Helper function to format category name for display
function formatCategoryName(category: string): string {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function AdminDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch categories
      const categoriesResponse = await fetch('/api/admin/categories');
      if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);
      if (categoriesData.length > 0) {
        setSelectedCategory(categoriesData[0].name);
      }

      // Fetch portfolio items
      const portfolioResponse = await fetch('/api/admin/portfolio');
      if (!portfolioResponse.ok) throw new Error('Failed to fetch portfolio items');
      const portfolioData = await portfolioResponse.json();
      setPortfolioItems(portfolioData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, itemId: number, imageIndex: number) => {
    if (!e.target.files || !e.target.files[0]) return;

    setUploadingImage(itemId);
    setError('');
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', selectedCategory);
    formData.append('imageIndex', imageIndex.toString());

    try {
      const response = await fetch(`/api/admin/portfolio/${itemId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      
      // Update the portfolioItems state by replacing the image at the specified index
      setPortfolioItems(items =>
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
      setUploadingImage(null);
      // Clear the file input
      e.target.value = '';
    }
  };

  const filteredItems = portfolioItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Portfolio Items</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-64 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {formatCategoryName(category.name)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              // Take only first 6 images
              item.image_paths.slice(0, 6).map((imagePath, imageIndex) => (
                <div key={`${item.id}-${imageIndex}`} className="relative group">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={imagePath}
                      alt={`Portfolio item ${item.id} image ${imageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="space-y-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, item.id, imageIndex)}
                        className="hidden"
                        id={`file-upload-${item.id}-${imageIndex}`}
                      />
                      <label
                        htmlFor={`file-upload-${item.id}-${imageIndex}`}
                        className="block px-3 py-1 text-sm text-white bg-yellow-600 rounded hover:bg-yellow-700 cursor-pointer text-center"
                      >
                        {uploadingImage === item.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Uploading...
                          </div>
                        ) : (
                          'Update Image'
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              ))
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No items found in this category.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}