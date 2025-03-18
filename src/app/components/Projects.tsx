"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Project categories and data
const categories = ["All", "Residential", "Commercial", "Renovation", "Consultation"];

const projects = [
  {
    id: 1,
    title: "Modern Apartment",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?q=80&w=800",
    description: "A contemporary apartment design featuring clean lines and minimalist aesthetics."
  },
  {
    id: 2,
    title: "Corporate Office",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800",
    description: "A productive workspace designed for collaboration and creativity."
  },
  {
    id: 3,
    title: "Vintage Home Renovation",
    category: "Renovation",
    image: "https://images.unsplash.com/photo-1600607687644-a19e8c18a3e5?q=80&w=800",
    description: "A complete renovation of a vintage home maintaining its classic charm."
  },
  {
    id: 4,
    title: "Kitchen Redesign",
    category: "Residential",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=800",
    description: "Modern kitchen design focusing on functionality and aesthetics."
  },
  {
    id: 5,
    title: "Boutique Hotel Lobby",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800",
    description: "A luxurious hotel lobby that makes a stunning first impression."
  },
  {
    id: 6,
    title: "Bathroom Upgrade",
    category: "Renovation",
    image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800",
    description: "A modern bathroom renovation with premium fixtures and elegant design."
  }
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<null | typeof projects[0]>(null);

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <section id="projects" className="py-16 md:py-24 bg-accent dark:bg-accent">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">Our <span className="text-primary">Projects</span></h2>
          <div className="w-16 md:w-20 h-1 bg-primary mx-auto mb-4 md:mb-6"></div>
          <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base">
            Explore our portfolio of carefully crafted interior designs across various spaces and styles.
          </p>
        </motion.div>

        {/* Category filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap gap-2 md:gap-3 justify-center mb-8 md:mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 md:px-5 py-1 md:py-2 text-xs md:text-sm font-medium rounded-full transition-all duration-300 shadow-sm
                ${
                  activeCategory === category
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-secondary dark:text-white hover:bg-primary/10 dark:hover:bg-primary/20 text-foreground"
                }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedProject(project)}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-lg shadow-md dark:shadow-black/20 bg-white dark:bg-secondary h-full flex flex-col">
                <div className="relative h-48 md:h-52 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      View Project
                    </button>
                  </div>
                </div>
                <div className="p-4 md:p-5 flex-grow flex flex-col">
                  <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2 text-foreground dark:text-white">{project.title}</h3>
                  <p className="text-foreground/70 dark:text-white/70 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2">{project.description}</p>
                  <div className="mt-auto flex flex-wrap gap-1 md:gap-2">
                    <span className="inline-block bg-foreground/5 dark:bg-white/10 text-foreground/70 dark:text-white/70 rounded-full px-2 py-1 text-[10px] md:text-xs">
                      {project.category}
                    </span>
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 md:p-4"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-secondary rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-[25vh] md:h-[50vh]">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    unoptimized={true}
                    className="object-cover"
                  />
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-6 md:h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="p-4 md:p-8 overflow-y-auto">
                  <div className="flex justify-between items-start mb-2 md:mb-4">
                    <div>
                      <span className="inline-block px-2 md:px-3 py-0.5 md:py-1 bg-primary text-white text-xs rounded-full mb-1 md:mb-2">
                        {selectedProject.category}
                      </span>
                      <h3 className="text-lg md:text-2xl font-bold text-foreground dark:text-white">{selectedProject.title}</h3>
                    </div>
                  </div>
                  <p className="text-xs md:text-base text-slate-600 dark:text-slate-300 mb-3 md:mb-6">{selectedProject.description}</p>
                  <div className="grid grid-cols-2 gap-2 md:gap-4">
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Client</h4>
                      <p className="font-medium text-xs md:text-base text-foreground dark:text-white">Sample Client</p>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Year</h4>
                      <p className="font-medium text-xs md:text-base text-foreground dark:text-white">2023</p>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Area</h4>
                      <p className="font-medium text-xs md:text-base text-foreground dark:text-white">1,200 sq ft</p>
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-0.5 md:mb-1">Location</h4>
                      <p className="font-medium text-xs md:text-base text-foreground dark:text-white">New York, NY</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* View more button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-8 md:mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="px-5 md:px-8 py-2 md:py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors duration-300 shadow-lg hover:shadow-xl text-xs md:text-base"
          >
            View All Projects
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
} 