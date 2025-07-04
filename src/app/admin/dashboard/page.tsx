'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import portfolioData from '@/app/data/portfolio.json';
import { signOut, useSession } from 'next-auth/react';

interface PortfolioImage {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: string;
  year: string;
  location: string;
  area: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

const MAX_IMAGES_PER_CATEGORY = 6;

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [categories] = useState<string[]>(portfolioData.categories);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    // Load portfolio images
    if (status === 'authenticated') {
      fetch('/api/admin/portfolio')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPortfolioImages(data.data);
          }
        })
        .catch(error => console.error('Error loading portfolio:', error));
    }
  }, [status]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageToReplace?: PortfolioImage) => {
    const file = e.target.files?.[0];
    if (!file || !selectedCategory) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', imageToReplace?.title || file.name);
    formData.append('description', imageToReplace?.description || '');
    formData.append('category', selectedCategory);

    try {
      // If replacing an image, delete the old one first
      if (imageToReplace) {
        await fetch(`/api/admin/portfolio/${imageToReplace.id}`, {
          method: 'DELETE',
        });
      }

      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        
        // Refresh portfolio images
        const portfolioResponse = await fetch('/api/admin/portfolio');
        const portfolioData = await portfolioResponse.json();
        if (portfolioData.success) {
          setPortfolioImages(portfolioData.data);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/admin/portfolio/${imageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Image deleted successfully!' });
        setPortfolioImages(prev => prev.filter(img => img.id !== imageId));
      } else {
        setMessage({ type: 'error', text: data.message || 'Delete failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while deleting' });
    }
  };

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>, imageToReplace: PortfolioImage) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', imageToReplace.title);
    formData.append('description', imageToReplace.description);
    formData.append('category', imageToReplace.category);
    formData.append('replaceImageId', imageToReplace.id.toString());

    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Image replaced successfully!' });
        
        // Refresh portfolio images
        const portfolioResponse = await fetch('/api/admin/portfolio');
        const portfolioData = await portfolioResponse.json();
        if (portfolioData.success) {
          setPortfolioImages(portfolioData.data);
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'Replace failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let videoId = youtubeUrl;
      if (youtubeUrl.includes('youtube.com')) {
        const url = new URL(youtubeUrl);
        videoId = url.searchParams.get('v') || '';
      } else if (youtubeUrl.includes('youtu.be')) {
        videoId = youtubeUrl.split('/').pop() || '';
      }

      if (!videoId) {
        setMessage({ type: 'error', text: 'Invalid YouTube URL' });
        return;
      }

      const response = await fetch('/api/admin/process-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Process video updated successfully!' });
        setYoutubeUrl('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update video' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/admin/login' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredImages = selectedCategory 
    ? portfolioImages.filter(img => img.category === selectedCategory)
    : portfolioImages;

  const getImageCount = (category: string) => {
    return portfolioImages.filter(img => img.category === category).length;
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Category Selection */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Select Category to Manage</h2>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => {
                const count = getImageCount(category);
                return (
                  <option key={category} value={category}>
                    {category} ({count}/6 images)
                  </option>
                );
              })}
            </select>
            {selectedCategory && (
              <p className="mt-2 text-sm text-gray-500">
                {getImageCount(selectedCategory)}/6 images in this category
              </p>
            )}
          </div>

          {/* Process Video Update */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Update Process Video</h2>
            <form onSubmit={handleVideoUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  YouTube Video URL
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  This will update the process video shown on the home page
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded hover:bg-primary-700 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Video'}
              </button>
            </form>
          </div>
        </div>

        {/* Portfolio Images Grid */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {selectedCategory ? `${selectedCategory} Images` : 'All Portfolio Images'}
            {selectedCategory && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({getImageCount(selectedCategory)}/6 images)
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedCategory && getImageCount(selectedCategory) < MAX_IMAGES_PER_CATEGORY && (
              <div className="relative h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">Upload New Image</p>
                </div>
              </div>
            )}
            
            {filteredImages.map((image, index) => {
              const isHidden = selectedCategory && 
                portfolioImages
                  .filter(img => img.category === selectedCategory)
                  .findIndex(img => img.id === image.id) >= MAX_IMAGES_PER_CATEGORY;

              return (
                <div
                  key={image.id}
                  className="relative bg-white rounded-lg shadow overflow-hidden group"
                >
                  <div className="relative h-48">
                    <Image
                      src={image.images[0]}
                      alt={image.title}
                      fill
                      className="object-cover"
                    />
                    {selectedCategory === image.category && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700">
                          Replace Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleReplaceImage(e, image)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                    {isHidden && (
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                        Hidden
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {selectedCategory && getImageCount(selectedCategory) >= MAX_IMAGES_PER_CATEGORY && (
            <p className="mt-4 text-yellow-600 text-sm">
              This category has reached the maximum limit of 6 images. Please delete an existing image before adding a new one.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 