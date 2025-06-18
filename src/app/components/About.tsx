"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "Creative Design",
    description: "Innovative and unique design solutions tailored to your style and needs.",
    icon: "🎨"
  },
  {
    title: "Expert Planning",
    description: "Detailed space planning and layout optimization for maximum functionality.",
    icon: "📐"
  },
  {
    title: "Quality Materials",
    description: "Premium materials and finishes that ensure lasting beauty and durability.",
    icon: "⭐"
  }
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-yellow-500 font-medium mb-4 tracking-wide uppercase"
            >
              About Us
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            >
              Crafting Beautiful Living Spaces
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 mb-8"
            >
              At Apple Interiors, we believe that great design has the power to transform spaces and enhance lives. Our team of expert designers combines creativity with functionality to create interiors that reflect your unique style and meet your specific needs.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-yellow-500/10 dark:bg-yellow-500/20 flex items-center justify-center text-yellow-500 mb-4 text-2xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 