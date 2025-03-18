"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { scrollY } = useScroll();
  
  // Check for dark mode on component mount and when color scheme changes
  useEffect(() => {
    // Check initial color scheme
    if (typeof window !== 'undefined') {
      const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeQuery.matches);
      
      // Add listener for changes
      const darkModeListener = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      
      darkModeQuery.addEventListener('change', darkModeListener);
      
      // Add body class to prevent scrolling when menu is open
      if (isMenuOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
      
      return () => {
        darkModeQuery.removeEventListener('change', darkModeListener);
        document.body.classList.remove('overflow-hidden');
      };
    }
  }, [isMenuOpen]);
  
  // Transform properties based on scroll position and color scheme
  const headerBackground = useTransform(
    scrollY,
    [0, 80],
    isDarkMode 
      ? ["rgba(15, 15, 15, 0.95)", "rgba(15, 15, 15, 0.98)"] 
      : ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.98)"]
  );
  
  const headerHeight = useTransform(
    scrollY,
    [0, 80],
    ["5rem", "4rem"]
  );
  
  const logoScale = useTransform(
    scrollY,
    [0, 80],
    [1, 0.9]
  );

  // Animation variants for mobile menu
  const menuVariants = {
    closed: { 
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        duration: 0.25,
        ease: "easeInOut",
        when: "afterChildren"
      },
      transitionEnd: { 
        display: "none" 
      }
    },
    open: { 
      opacity: 1,
      y: 0,
      height: "calc(100vh - var(--header-height-mobile))",
      display: "block",
      transition: {
        duration: 0.35,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    }
  };
  
  const menuItemVariants = {
    closed: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.15, ease: "easeIn" }
    },
    open: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" }
    }
  };

  // Close menu when clicking on links
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <motion.header
        style={{ 
          background: headerBackground,
          height: headerHeight,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)" // For Safari support
        }}
        className="fixed top-0 left-0 right-0 z-[100] px-4 transition-colors shadow-sm dark:shadow-black/30 w-full"
      >
        <div className="container mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div 
            style={{ scale: logoScale }}
            className="flex items-center z-[101]" // Increased z-index to stay above menu
          >
            <Link href="#home" className="flex items-center" onClick={handleLinkClick}>
              <div className="relative h-10 w-32 md:h-16 md:w-56">
                <Image
                  src="/images/New-logo.png"
                  alt="Apple Interiors Logo"
                  fill
                  className="object-contain"
                  priority
                  unoptimized={true}
                />
              </div>
            </Link>
          </motion.div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
              >
                <Link
                  href={link.href}
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-300 text-sm font-medium relative group py-2"
                >
                  {link.name}
                  <motion.span 
                    className="absolute left-0 right-0 bottom-0 h-0.5 bg-primary origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <Link
                href="#contact"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 inline-flex items-center"
              >
                <motion.span
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  Get Quote
                </motion.span>
              </Link>
            </motion.div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center space-y-1.5 z-[101]" // Increased z-index
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-0.5 block ${isDarkMode ? 'bg-white' : 'bg-foreground'}`}
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-0.5 block ${isDarkMode ? 'bg-white' : 'bg-foreground'}`}
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`w-6 h-0.5 block ${isDarkMode ? 'bg-white' : 'bg-foreground'}`}
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu overlay - improved for better touch interaction */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-[90] md:hidden mobile-menu-overlay"
          onClick={() => setIsMenuOpen(false)}
        ></motion.div>
      )}

      {/* Mobile menu - improved for better spacing and touch targets */}
      <motion.div
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
        className="fixed top-[4rem] left-0 right-0 bg-white dark:bg-foreground dark:border-t dark:border-white/10 backdrop-blur-lg md:hidden overflow-hidden shadow-lg z-[95] mobile-scroll"
      >
        <nav className="container mx-auto py-6 px-4 overflow-y-auto h-full">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                variants={menuItemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className="border-b border-gray-100 dark:border-white/10 pb-3" // Added border for visual separation
              >
                <Link
                  href={link.href}
                  className="text-foreground dark:text-white hover:text-primary transition-colors duration-300 text-lg font-medium block py-4" // Increased padding for better touch
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div 
              variants={menuItemVariants}
              className="pt-6 mt-4" // Increased spacing
            >
              <Link
                href="#contact"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-4 rounded-lg font-medium transition-colors duration-300 inline-block w-full text-center"
                onClick={handleLinkClick}
              >
                Get Quote
              </Link>
            </motion.div>
          </div>
          
          {/* Mobile social links */}
          <motion.div
            variants={menuItemVariants}
            className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10"
          >
            <p className="text-sm text-foreground/60 dark:text-white/60 mb-4">Connect with us</p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-foreground dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-foreground dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-foreground dark:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </motion.div>
        </nav>
      </motion.div>
    </>
  );
} 