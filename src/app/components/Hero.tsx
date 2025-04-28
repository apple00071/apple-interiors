"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
];

export default function Hero() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const lastScrollY = useRef(0);
  
  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Determine if scrolled past threshold
      setIsScrolled(currentScrollY > 50);
      
      // Determine scroll direction and hide/show header
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling down & past initial header height
        setHideHeader(true);
      } else {
        // Scrolling up
        setHideHeader(false);
      }
      
      lastScrollY.current = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    if (isMobileMenuOpen) {
      const handleClickOutside = () => {
        setIsMobileMenuOpen(false);
      };
      
      // Add a slight delay to avoid immediate closing when menu is opened
      const timeoutId = setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [isMobileMenuOpen]);

  // Handle scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Fixed Header that changes with scroll - now with hide-on-scroll behavior */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          hideHeader ? '-translate-y-full' : 'translate-y-0'
        }`}
        style={{
          backdropFilter: isScrolled ? 'blur(10px)' : 'blur(5px)',
          background: isScrolled 
            ? 'rgba(255, 255, 255, 0.75)' 
            : 'linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)',
          height: isScrolled ? '4rem' : '5rem',
          boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.05)' : 'none'
        }}
      >
        <div className="container mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <Image
              src="/images/New-logo.png"
              alt="Apple Interiors Logo"
              width={140}
              height={40}
              className="w-32 sm:w-[180px] h-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  isScrolled ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="#contact"
              className={`group inline-flex items-center px-5 py-2.5 rounded-full text-sm font-medium transition-colors duration-300 ${
                isScrolled 
                ? "bg-primary text-black hover:bg-primary/90" 
                : "bg-white text-[#2C2C2C] hover:bg-gray-100"
              }`}
            >
              <span className="flex items-center">
                Contact Us
                <svg 
                  className="ml-2 w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
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
              </span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            aria-label="Toggle menu"
          >
            <span className={`absolute w-6 h-0.5 ${isScrolled ? 'bg-gray-800' : 'bg-white'} transform transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45' : '-translate-y-2'}`}></span>
            <span className={`absolute w-6 h-0.5 ${isScrolled ? 'bg-gray-800' : 'bg-white'} transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`absolute w-6 h-0.5 ${isScrolled ? 'bg-gray-800' : 'bg-white'} transform transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45' : 'translate-y-2'}`}></span>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ 
          paddingTop: isScrolled ? '4rem' : '5rem',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.98)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container mx-auto px-6 sm:px-8 py-6 sm:py-8">
          <nav className="flex flex-col space-y-4 sm:space-y-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xl font-medium text-gray-800 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center text-xl font-medium text-primary hover:text-primary/80 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
              <svg 
                className="ml-2 w-5 h-5" 
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
          </nav>
        </div>
      </div>
      
      {/* Main Hero Section */}
      <section id="home" className="relative min-h-screen w-full overflow-hidden">
        {/* Blurred Background Text - CalmHome style */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full">
            <h2 className="text-[15vw] sm:text-[20vw] font-serif text-[#f1f1f1] dark:text-[#1a1a1a]/10 text-center font-bold opacity-70 blur-[50px]">
              Calm & style preferred
            </h2>
          </div>
        </div>

        {/* Full-width Image Background */}
        <div className="absolute inset-0 w-full h-full">
          {/* Image with curved corner at bottom-left */}
          <div className="relative w-full h-full rounded-bl-[25%] sm:rounded-bl-[40%] overflow-hidden">
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

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center z-20 pt-16 sm:pt-20">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[45%]">
              <div className="font-serif font-medium text-white">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
                  className="text-[2.25rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] leading-[1.1] tracking-[-0.02em]"
                >
                  Let Your Home
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.05, ease: [0.33, 1, 0.68, 1] }}
                  className="text-[2.25rem] sm:text-[3rem] md:text-[4rem] lg:text-[5rem] leading-[1.1] tracking-[-0.02em]"
                >
                  Be Unique
                </motion.div>
              </div>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
                className="mt-4 sm:mt-6 text-base sm:text-lg text-white/90 leading-relaxed max-w-md font-light"
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
                  className="group inline-flex items-center px-5 sm:px-7 py-3 sm:py-3.5 bg-white text-[#2C2C2C] rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300"
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