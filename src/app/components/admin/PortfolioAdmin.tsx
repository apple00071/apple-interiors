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

export default function PortfolioAdmin({ initialItems, categories }: PortfolioAdminProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add new portfolio item
  const handleAddItem = async (formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to add portfolio item');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Update portfolio item
  const handleUpdateItem = async (id: number, formData: FormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update portfolio item');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete portfolio item
  const handleDeleteItem = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/portfolio', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete portfolio item');
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add new item form */}
      <form onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleAddItem(formData);
      }} className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Add New Portfolio Item</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Category</label>
            <select name="category" required className="w-full p-2 border rounded">
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-2">Images</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Item'}
        </button>
      </form>

      {/* List of existing items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="border rounded p-4">
            <p className="text-gray-600 mb-2">{item.category}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              {item.image_paths.map((image, index) => (
                <div key={index} className="relative aspect-video">
                  <Image
                    src={image}
                    alt={`Portfolio Image ${index + 1}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => handleDeleteItem(item.id)}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 