"use client";

import React, { useState } from "react";
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
  const { scrollY } = useScroll();
  
  // Transform properties based on scroll position
  const headerBackground = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0.9)", "rgba(255, 255, 255, 0.95)"]
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
      transitionEnd: { display: "none" }
    },
    open: { 
      opacity: 1,
      y: 0,
      display: "block",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const menuItemVariants = {
    closed: { opacity: 0, x: -10 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.header
      style={{ 
        background: headerBackground,
        height: headerHeight,
        backdropFilter: "blur(12px)"
      }}
      className="fixed top-0 left-0 right-0 z-50 px-4 transition-colors"
    >
      <div className="container mx-auto flex items-center justify-between h-full">
        {/* Logo */}
        <motion.div 
          style={{ scale: logoScale }}
          className="flex items-center"
        >
          <Link href="#home" className="flex items-center">
            <div className="relative h-12 w-40 md:h-16 md:w-56">
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
                className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium relative group"
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
          className="md:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1.5 z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-0.5 bg-foreground block"
          />
          <motion.span
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-0.5 bg-foreground block"
          />
          <motion.span
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-6 h-0.5 bg-foreground block"
          />
        </motion.button>
      </div>

      {/* Mobile menu */}
      <motion.div
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={menuVariants}
        className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg md:hidden overflow-hidden shadow-lg z-40"
      >
        <nav className="container mx-auto py-6 px-4">
          <div className="flex flex-col space-y-5">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                variants={menuItemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 text-lg font-medium block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            <motion.div 
              variants={menuItemVariants}
              className="pt-4"
            >
              <Link
                href="#contact"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg font-medium transition-colors duration-300 inline-block w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Quote
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.div>
    </motion.header>
  );
} 