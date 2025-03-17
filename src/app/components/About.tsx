"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

const slideInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.215, 0.61, 0.355, 1]
    }
  }
};

export default function About() {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Image side with hover effect */}
          <motion.div 
            variants={slideInLeft}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-2xl relative aspect-[4/5]"
            >
              <Image
                src="https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?q=80&w=800"
                alt="Interior design professional working"
                width={800}
                height={1000}
                className="object-cover h-full w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent"></div>
            </motion.div>
            
            {/* Floating accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-2xl z-0"
            ></motion.div>
            
            {/* Stats box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-8 -right-8 md:right-8 bg-foreground text-white p-6 rounded-xl shadow-xl z-10"
            >
              <div className="flex space-x-8">
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-3xl font-bold text-primary"
                  >
                    12+
                  </motion.h3>
                  <p className="text-sm text-white/70">Years Experience</p>
                </div>
                <div>
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-3xl font-bold text-primary"
                  >
                    200+
                  </motion.h3>
                  <p className="text-sm text-white/70">Projects Completed</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Content side */}
          <motion.div 
            variants={slideInRight}
            className="space-y-6"
          >
            <motion.div variants={fadeUpVariant} custom={1}>
              <h2 className="text-4xl font-bold mb-2">
                About <span className="text-primary">Us</span>
              </h2>
              <div className="w-20 h-1 bg-primary mb-6"></div>
            </motion.div>
            
            <motion.p variants={fadeUpVariant} custom={2} className="text-slate-600 mb-4">
              Apple Interiors has been transforming spaces for over a decade. Our passion for design and attention to detail sets us apart in the industry. We believe that great design has the power to improve lives and create extraordinary experiences.
            </motion.p>
            
            <motion.p variants={fadeUpVariant} custom={3} className="text-slate-600 mb-8">
              Our team of experienced designers and craftsmen work closely with each client to understand their vision, needs, and lifestyle. We combine creativity with functionality to create spaces that are not only beautiful but also practical and livable.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} custom={4}>
              <h3 className="text-2xl font-semibold mb-4">Our Approach</h3>
            </motion.div>
            
            <div className="space-y-4">
              {/* Approach items with hover effects */}
              <motion.div
                variants={fadeUpVariant}
                custom={5}
                whileHover={{ scale: 1.02, backgroundColor: "var(--primary-10)" }}
                className="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-xl">Discover</h4>
                  <p className="text-slate-600 mt-1">We begin by understanding your needs, preferences, and vision for the space.</p>
                </div>
              </motion.div>
              
              <motion.div
                variants={fadeUpVariant}
                custom={6}
                whileHover={{ scale: 1.02, backgroundColor: "var(--primary-10)" }}
                className="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-xl">Design</h4>
                  <p className="text-slate-600 mt-1">Our designers create custom concepts that bring your vision to life.</p>
                </div>
              </motion.div>
              
              <motion.div
                variants={fadeUpVariant}
                custom={7}
                whileHover={{ scale: 1.02, backgroundColor: "var(--primary-10)" }}
                className="flex items-start space-x-4 p-4 rounded-lg transition-all duration-300"
              >
                <div className="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-xl">Deliver</h4>
                  <p className="text-slate-600 mt-1">Our experienced team handles every detail of the implementation process.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
} 