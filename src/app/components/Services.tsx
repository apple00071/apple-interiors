"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

// Sample services data
const services = [
  {
    title: "Residential Design",
    description: "Transform your home into a beautiful, functional space that reflects your personal style and meets your specific needs.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920",
    features: [
      "Custom furniture selection",
      "Color palette development",
      "Space planning & layout",
      "Material & finish recommendations"
    ]
  },
  {
    title: "Commercial Spaces",
    description: "Create distinctive commercial environments that enhance brand identity, improve functionality and provide memorable experiences.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1920",
    features: [
      "Brand-aligned design concepts",
      "Efficiency-focused layouts",
      "Commercial-grade fixtures",
      "Regulatory compliance"
    ]
  },
  {
    title: "Renovation Projects",
    description: "Breathe new life into existing spaces with renovations that enhance functionality, update aesthetics, and increase property value.",
    image: "https://images.unsplash.com/photo-1600607687644-a24f80c5930b?q=80&w=1920",
    features: [
      "Structure assessment",
      "Modernization planning",
      "Material & design upgrades",
      "Project management"
    ]
  },
  {
    title: "Design Consultation",
    description: "Get expert advice and guidance to help you make informed decisions about your interior design project.",
    image: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?q=80&w=1920",
    features: [
      "Professional design assessment",
      "Budget optimization",
      "Styling recommendations",
      "DIY guidance"
    ]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-16 md:py-24 bg-background dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-primary">Services</span></h2>
            <div className="w-16 md:w-20 h-1 bg-primary mx-auto mb-4 md:mb-6"></div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-sm md:text-base"
          >
            We offer a comprehensive range of interior design services tailored to meet your specific needs, whether you&apos;re looking to transform your home, office, or commercial space.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mt-6 md:mt-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white dark:bg-secondary rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-44 md:h-64">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  unoptimized={true}
                  className="object-cover transition-all duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="absolute bottom-0 left-0 p-4 md:p-6"
                >
                  <h3 className="text-lg md:text-2xl font-bold text-white">{service.title}</h3>
                </motion.div>
              </div>
              
              <div className="p-4 md:p-6">
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 mb-3 md:mb-6">{service.description}</p>
                
                <div className="space-y-2 md:space-y-3">
                  <h4 className="font-semibold text-sm md:text-lg mb-1 md:mb-2 dark:text-white">Key Features:</h4>
                  <ul className="space-y-1 md:space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li 
                        key={featureIndex}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.1 * featureIndex }}
                        className="flex items-center"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mr-2"></div>
                        <span className="text-xs md:text-base text-slate-600 dark:text-slate-300">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#000" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 md:mt-6 px-4 md:px-6 py-2 md:py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 w-full text-xs md:text-base"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-4 md:mb-6">Not sure which service is right for you? We&apos;re here to help!</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="inline-block px-6 md:px-8 py-2.5 md:py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 