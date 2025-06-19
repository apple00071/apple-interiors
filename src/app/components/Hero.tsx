// @ts-nocheck
"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <>
      {/* Main Hero Section */}
      <section id="home" className="relative min-h-screen w-full overflow-hidden">
        {/* Blurred Background Text - CalmHome style */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="text-[15vw] sm:text-[20vw] font-serif text-[#f1f1f1] text-center font-bold opacity-70 blur-[50px]">
              Calm & style preferred
            </h2>
          </div>
        </div>

        {/* Full-width Image Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* Image with curved corner at bottom-left */}
          <div className="relative w-full h-full rounded-bl-[20%] sm:rounded-bl-[30%] overflow-hidden">
            <div style={{ 
              position: 'absolute', 
              borderRadius: 'inherit',
              top: 0, 
              right: 0, 
              bottom: 0, 
              left: 0 
            }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full w-full"
              >
                <Image
                  src="/images/20250322_211720.jpg"
                  alt="Modern Living Room Interior Design"
                  fill
                  className="object-cover"
                  priority
                  quality={100}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-20 pt-16 sm:pt-20">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[45%]">
              <div className="font-serif font-medium text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.75rem] leading-[1.1] tracking-[-0.02em] text-white whitespace-nowrap font-bold"
                  style={{
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  Let Your Home Be Unique
                </motion.div>
              </div>
            
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                className="mt-4 sm:mt-6 text-base sm:text-lg text-white leading-relaxed max-w-md font-semibold"
                style={{
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                Discover our expertise in indoor decorating, tailored to make your home uniquely beautiful and inviting.
              </motion.p>
            
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                className="mt-6 sm:mt-10"
              >
                <Link
                  href="/contact"
                  className="group inline-flex items-center px-5 sm:px-7 py-3 sm:py-3.5 bg-yellow-500 text-white rounded-full text-sm font-medium hover:bg-yellow-600 transition-colors duration-300"
                >
                  Contact Us
                  <svg
                    className="ml-2 w-4 sm:w-5 h-4 sm:h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 