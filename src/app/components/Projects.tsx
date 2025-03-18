"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Project categories and data
const categories = ["All", "Residential", "Commercial", "Renovation"];

const projects = [
  {
    id: 1,
    title: "Modern Apartment",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=800",
    description: "A contemporary apartment design featuring clean lines and minimalist aesthetics.",
    year: "2023",
    location: "New York",
    area: "2,400 sq ft"
  },
  {
    id: 2,
    title: "Corporate Office",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800",
    description: "A productive workspace designed for collaboration and creativity.",
    year: "2023",
    location: "London",
    area: "5,000 sq ft"
  },
  {
    id: 3,
    title: "Vintage Home",
    category: "Renovation",
    image: "https://images.unsplash.com/photo-1600607687644-a19e8c18a3e5?q=80&w=800",
    description: "A complete renovation of a vintage home maintaining its classic charm.",
    year: "2023",
    location: "Paris",
    area: "3,200 sq ft"
  },
  {
    id: 4,
    title: "Kitchen Design",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800",
    description: "Modern kitchen design focusing on functionality and aesthetics.",
    year: "2023",
    location: "Tokyo",
    area: "450 sq ft"
  },
  {
    id: 5,
    title: "Hotel Lobby",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800",
    description: "A luxurious hotel lobby that makes a stunning first impression.",
    year: "2023",
    location: "Dubai",
    area: "3,800 sq ft"
  },
  {
    id: 6,
    title: "Bathroom",
    category: "Renovation",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800",
    description: "A modern bathroom renovation with premium fixtures and elegant design.",
    year: "2023",
    location: "Singapore",
    area: "180 sq ft"
  }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<null | typeof projects[0]>(null);
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-24 md:py-32 bg-[#FAFAFA] dark:bg-[#111111]">
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
            Featured Projects
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setIsHovered(project.id)}
              onHoverEnd={() => setIsHovered(null)}
              className="group relative"
            >
              <div 
                className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5"
                onClick={() => setSelectedProject(project)}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  unoptimized={true}
                />
                <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-black/80 transition-opacity duration-300 ${isHovered === project.id ? 'opacity-100' : 'opacity-0'}`}>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white/80 text-sm mb-2">{project.category}</p>
                    <h3 className="text-white text-xl font-medium mb-1">{project.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{project.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Project Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-5xl bg-white dark:bg-[#111111] rounded-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-square">
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                      unoptimized={true}
                    />
                  </div>
                  <div className="p-8 md:p-12">
                    <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-4">
                      {selectedProject.category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4">
                      {selectedProject.title}
                    </h3>
                    <p className="text-black/70 dark:text-white/70 mb-8">
                      {selectedProject.description}
                    </p>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-black/50 dark:text-white/50 mb-1">Location</p>
                        <p className="font-medium text-black dark:text-white">{selectedProject.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-black/50 dark:text-white/50 mb-1">Year</p>
                        <p className="font-medium text-black dark:text-white">{selectedProject.year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-black/50 dark:text-white/50 mb-1">Area</p>
                        <p className="font-medium text-black dark:text-white">{selectedProject.area}</p>
                      </div>
                    </div>
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