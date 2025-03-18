"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Animation variants for staggered animations
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      delay: custom * 0.1 
    }
  })
};

const serviceItems = [
  {
    title: "Residential Design",
    description: "Transform your home into a beautiful and functional space that reflects your personal style and meets your needs.",
    icon: "/images/services/residential.svg",
    iconFallback: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    )
  },
  {
    title: "Commercial Design",
    description: "Create inspiring workspaces that boost productivity, reflect your brand identity, and impress clients and employees alike.",
    icon: "/images/services/commercial.svg",
    iconFallback: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    title: "Space Planning",
    description: "Optimize your space for functionality and flow, ensuring every square foot is used effectively and purposefully.",
    icon: "/images/services/planning.svg",
    iconFallback: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="3" y1="9" x2="21" y2="9"></line>
        <line x1="9" y1="21" x2="9" y2="9"></line>
      </svg>
    )
  },
  {
    title: "Custom Furniture",
    description: "Get unique, tailor-made furniture pieces designed specifically for your space and needs, ensuring a perfect fit and style match.",
    icon: "/images/services/furniture.svg",
    iconFallback: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 8h-9a2 2 0 0 0-2 2v8H4V6h16v2Z"></path>
        <path d="M4 10a2 2 0 0 1 2-2h9"></path>
        <path d="M12 12v6"></path>
        <path d="M2 19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2H2v2Z"></path>
      </svg>
    )
  },
  {
    title: "Color Consultation",
    description: "Discover the perfect color palette for your space that creates the right mood, complements your style, and brings harmony to your environment.",
    icon: "/images/services/color.svg",
    iconFallback: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="13.5" cy="6.5" r="2.5"></circle>
        <circle cx="17.5" cy="10.5" r="2.5"></circle>
        <circle cx="8.5" cy="7.5" r="2.5"></circle>
        <circle cx="6.5" cy="12.5" r="2.5"></circle>
        <path d="M12 22v-6"></path>
        <path d="M10 16h4"></path>
      </svg>
    )
  },
  {
    title: "Renovation Management",
    description: "Let us handle your renovation from concept to completion, coordinating contractors and ensuring quality results that match your vision.",
    icon: "/images/services/renovation.svg",
    iconFallback: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7-7H4a2 2 0 0 0-2 2v17Z"></path>
        <path d="M16 8h6"></path>
        <path d="M12 18h4"></path>
        <path d="M9 15l-4-4 4-4"></path>
        <path d="M5 11h9"></path>
      </svg>
    )
  }
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          custom={0}
          className="text-center mb-12 md:mb-20 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground dark:text-white">Our <span className="text-primary">Services</span></h2>
          <div className="w-16 md:w-20 h-1 bg-primary mx-auto mb-4 md:mb-6"></div>
          <p className="text-foreground/70 dark:text-white/70 text-sm md:text-base">
            We offer a comprehensive range of interior design services to transform your space into a beautiful, functional environment that reflects your personal style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {serviceItems.map((service, index) => (
            <motion.div
              key={service.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeIn}
              custom={index + 1}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-accent dark:bg-secondary rounded-xl p-6 md:p-8 shadow-md dark:shadow-xl dark:shadow-black/10 flex flex-col h-full transition-all duration-300 hover:shadow-lg"
            >
              {/* Icon */}
              <div className="mb-6 text-primary">
                <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                  <div className="w-6 h-6 md:w-7 md:h-7">
                    {service.iconFallback}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold mb-3 text-foreground dark:text-white">
                {service.title}
              </h3>
              <p className="text-foreground/70 dark:text-slate-300 text-sm md:text-base mt-auto">
                {service.description}
              </p>
              <div className="mt-4 pt-4">
                <a 
                  href="#" 
                  className="inline-flex items-center text-primary font-medium text-sm hover:underline"
                >
                  Learn more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1"
                  >
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 