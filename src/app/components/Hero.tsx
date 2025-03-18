"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth - 0.5,
        y: e.clientY / window.innerHeight - 0.5,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  
  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1]
      }
    })
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center overflow-hidden bg-background pt-28 pb-20 md:py-20"
    >
      {/* Background subtle effects */}
      <motion.div
        className="absolute w-60 h-60 md:w-96 md:h-96 rounded-full bg-primary/5 blur-3xl"
        style={{ 
          x: mousePosition.x * -30, 
          y: mousePosition.y * -30,
          top: '30%',
          left: '40%' 
        }}
        animate={{ 
          scale: [1, 1.1, 1],  
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            style={{ y: y1, opacity }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              className="space-y-4 md:space-y-6"
            >
              <div>
                <motion.h1
                  variants={textVariants}
                  custom={1}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
                >
                  THE ART
                </motion.h1>
                <motion.h1
                  variants={textVariants}
                  custom={2}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
                >
                  OF <span className="text-primary">INTERIOR</span>
                </motion.h1>
                <motion.h1
                  variants={textVariants}
                  custom={3}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
                >
                  DESIGN!
                </motion.h1>
              </div>
              
              <motion.p 
                variants={textVariants}
                custom={4}
                className="text-base md:text-lg text-foreground/70 mt-4 md:mt-6 max-w-xl"
              >
                Discover the perfect blend of style, comfort, and functionality. Experience exceptional quality, personalized service, and a seamless transformation.
              </motion.p>
              
              <motion.div
                variants={textVariants}
                custom={5}
                className="mt-6 md:mt-8"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block"
                >
                  <Link 
                    href="#projects"
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 md:px-8 md:py-4 rounded-full text-base font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>OUR WORKS</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="order-1 lg:order-2"
          >
            <motion.div 
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[500px]"
              style={{ 
                x: mousePosition.x * 15,
                y: mousePosition.y * 15
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1920"
                alt="Interior design showcase"
                fill
                unoptimized={true}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 