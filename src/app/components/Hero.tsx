"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Hero() {
  return (
    <section id="home" className="relative h-screen overflow-hidden">
      {/* Full-width Image Background */}
      <div className="absolute inset-0 w-full h-full">
        {/* Image with curved corner at bottom-left */}
        <div className="relative w-full h-full rounded-bl-[40%] overflow-hidden">
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
                src="/images/Untitled design (9).png"
                alt="Modern Interior Design"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Integrated Header and Content */}
      <div className="absolute inset-0 flex flex-col z-20">
        {/* Header/Navigation */}
        <div className="w-full py-6 px-8">
          <div className="container mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <Image
                src="/images/New-logo.png"
                alt="Apple Interiors Logo"
                width={180}
                height={50}
                className="object-contain"
                priority
              />
            </Link>

            {/* Navigation Links - Hidden on mobile */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white text-sm font-medium hover:text-white/80 transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Left Content Area */}
          <div className="relative w-full lg:w-[45%] h-full flex items-center">
            <div className="px-8 md:px-12 lg:px-16 xl:px-20 max-w-2xl mx-auto lg:mx-0 lg:ml-auto">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                className="font-normal text-[2.5rem] md:text-[3.5rem] lg:text-[4.5rem] leading-[1.1] tracking-[-0.02em] text-white"
              >
                Let Your Home
                <br />
                Be Unique
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                className="mt-6 text-lg text-white/90 leading-relaxed max-w-md"
              >
                Discover our expertise in indoor decorating, tailored to make your home uniquely beautiful and inviting.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
                className="mt-10"
              >
                <a
                  href="#contact"
                  className="group inline-flex items-center px-7 py-3.5 bg-white text-[#2C2C2C] rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300"
                >
                  Contact Us
                  <svg 
                    className="ml-2 w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-1" 
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
                </a>
              </motion.div>
            </div>
          </div>
          <div className="relative w-full lg:w-[55%] h-full"></div>
        </div>
      </div>
    </section>
  );
} 