"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  // Track mouse position for mobile parallax effect (only used on desktop)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for parallax effect on desktop
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    // Only add listener on desktop devices
    if (window.innerWidth > 768) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section 
      id="home" 
      className="relative h-screen flex items-center bg-accent dark:bg-background overflow-hidden"
    >
      {/* Animated background blob */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-1/2 h-1/2 bg-primary/10 dark:bg-primary/5 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center md:text-left max-w-xl mx-auto md:mx-0"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="uppercase tracking-wide text-sm sm:text-base md:text-lg font-semibold text-foreground dark:text-white/80 mb-2 sm:mb-3"
            >
              Welcome to Apple Interiors
            </motion.h2>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 md:leading-tight text-foreground dark:text-white"
            >
              THE ART OF <span className="text-primary">INTERIOR</span> DESIGN!
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-foreground/70 dark:text-white/70 mb-6 sm:mb-8 text-sm sm:text-base max-w-lg mx-auto md:mx-0"
            >
              Transform your space into a masterpiece with our premium interior design solutions. We create beautiful, functional spaces that reflect your unique style and personality.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href="#projects"
                className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium uppercase tracking-wide text-xs sm:text-sm transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
              >
                Our Works 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Hero image with parallax effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden md:block relative"
          >
            <div className="relative h-[400px] md:h-[450px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  position: 'relative',
                  // Apply mouse movement parallax effect
                  x: mousePosition.x * 15,
                  y: mousePosition.y * 15
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920"
                  alt="Modern interior design showcase"
                  fill
                  priority
                  className="object-cover rounded-2xl"
                  unoptimized={true}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Mobile only image */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative md:hidden mt-4 mb-6"
          >
            <div className="relative h-[250px] rounded-xl overflow-hidden shadow-lg mx-auto max-w-xs">
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920"
                alt="Modern interior design showcase"
                fill
                priority
                className="object-cover"
                unoptimized={true}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer" 
      >
        <Link href="#about" className="flex flex-col items-center">
          <span className="text-xs md:text-sm text-foreground/60 dark:text-white/60 mb-2">Scroll Down</span>
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-primary"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
} 