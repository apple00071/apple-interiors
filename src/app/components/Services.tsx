"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

const services = [
  {
    title: "Residential Design",
    description: "Transform your home into a personalized sanctuary with our tailored residential interior design services.",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
    features: ["Space Planning", "Custom Furniture", "Color Consultation", "Lighting Design"]
  },
  {
    title: "Commercial Spaces",
    description: "Create impactful commercial environments that enhance productivity and leave lasting impressions on clients.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    features: ["Office Layout", "Brand Integration", "Ergonomic Solutions", "Acoustic Planning"]
  },
  {
    title: "Renovation",
    description: "Breathe new life into existing spaces with our comprehensive renovation and remodeling services.",
    image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=800",
    features: ["Structural Changes", "Material Selection", "Project Management", "Budget Planning"]
  },
  {
    title: "Design Consultation",
    description: "Get expert advice and guidance for your interior design projects with our consultation services.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800",
    features: ["Design Strategy", "Concept Development", "Material Sourcing", "Space Optimization"]
  }
];

export default function Services() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4">Our <span className="text-primary">Services</span></h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600"
          >
            We offer a comprehensive range of interior design services tailored to meet your specific needs, whether you&apos;re looking to transform your home, office, or commercial space.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariant}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-64">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-all duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="absolute bottom-0 left-0 p-6"
                >
                  <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                </motion.div>
              </div>
              
              <div className="p-6">
                <p className="text-slate-600 mb-6">{service.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg mb-2">Key Features:</h4>
                  <ul className="space-y-2">
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
                        <span className="text-slate-600">{feature}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "#000" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 w-full"
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
          className="mt-16 text-center"
        >
          <p className="text-lg text-slate-600 mb-6">Not sure which service is right for you? We&apos;re here to help!</p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="inline-block px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            Contact Us
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
} 