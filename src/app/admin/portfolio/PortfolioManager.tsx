"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Project = {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  area: string;
  year: string;
};

export default function PortfolioManager() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [project, setProject] = useState<Project>({
    id: 0,
    title: "",
    category: "",
    description: "",
    location: "",
    area: "",
    year: new Date().getFullYear().toString()
  });
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // First create the project
      const projectResponse = await fetch('/api/admin/portfolio/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!projectResponse.ok) {
        throw new Error('Failed to create project');
      }

      const { projectId } = await projectResponse.json();

      // Then upload images if any are selected
      if (selectedFiles && selectedFiles.length > 0) {
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
          formData.append('images', file);
        });
        formData.append('projectId', projectId.toString());

        const imageResponse = await fetch('/api/admin/portfolio/images', {
          method: 'POST',
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload images');
        }
      }

      // Reset form and refresh data
      setProject({
        id: 0,
        title: "",
        category: "",
        description: "",
        location: "",
        area: "",
        year: new Date().getFullYear().toString()
      });
      setSelectedFiles(null);
      router.refresh();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            value={project.category}
            onChange={(e) => setProject({ ...project, category: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="Living Room">Living Room</option>
            <option value="Dining">Dining</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Kitchen">Kitchen</option>
            <option value="False Ceiling">False Ceiling</option>
            <option value="Pooja Room">Pooja Room</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Title
          </label>
          <input
            type="text"
            value={project.title}
            onChange={(e) => setProject({ ...project, title: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            value={project.description}
            onChange={(e) => setProject({ ...project, description: e.target.value })}
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              value={project.location}
              onChange={(e) => setProject({ ...project, location: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Area (sq ft)
            </label>
            <input
              type="text"
              value={project.area}
              onChange={(e) => setProject({ ...project, area: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Year
            </label>
            <input
              type="text"
              value={project.year}
              onChange={(e) => setProject({ ...project, year: e.target.value })}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Images
          </label>
          <input
            type="file"
            onChange={(e) => setSelectedFiles(e.target.files)}
            className="w-full p-2 border rounded-md"
            multiple
            accept="image/*"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2 px-4 bg-primary text-white rounded-md ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
        >
          {isUploading ? 'Uploading...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
} 