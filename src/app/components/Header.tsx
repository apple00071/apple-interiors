// @ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, HTMLMotionProps, MotionStyle } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Variants } from "framer-motion";
import type { StaticImageData } from "next/image";
import type { LinkProps } from "next/link";
import type { ImageProps } from "next/image";

declare module 'react' {
  interface JSX {
    IntrinsicElements: {
      [elemName: string]: any;
    }
  }
}

// Extend the Image component props
interface CustomImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  className?: string;
}

// Define types for motion components
interface MotionHeaderProps extends HTMLMotionProps<"header"> {
  children: React.ReactNode;
}

interface MotionDivProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

interface MotionButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
}

interface MotionSpanProps extends HTMLMotionProps<"span"> {
  children?: React.ReactNode;
}

// Define types for custom elements
type CustomLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

type CustomImageProps = Omit<ImageProps, "src"> & {
  src: string;
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Contact", href: "/contact" },
];

export default function Header(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();
  
  // Add body class to prevent scrolling when menu is open
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isMenuOpen) {
        document.body.classList.add('overflow-hidden');
      } else {
        document.body.classList.remove('overflow-hidden');
      }
      
      return () => {
        document.body.classList.remove('overflow-hidden');
      };
    }
  }, [isMenuOpen]);

  // Handle scroll behavior
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY < lastScrollY || currentScrollY < 50) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setIsVisible(false);
        }
        
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);
  
  // Transform properties based on scroll position
  const headerBackground = useTransform(
    scrollY,
    [0, 80],
    ["rgba(255, 255, 255, 0.95)", "rgba(255, 255, 255, 0.98)"]
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
  const menuVariants: Variants = {
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
  
  const menuItemVariants: Variants = {
    closed: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.15, ease: "easeInOut" }
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

  // Menu styling variables
  const menuBgColor = 'bg-white';
  const menuTextColor = 'text-foreground';
  const menuBorderColor = 'border-gray-100';

  const headerStyle: MotionStyle = {
    background: headerBackground,
    height: headerHeight,
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    transform: isVisible ? "translateY(0)" : "translateY(-100%)",
  };

  return (
    <>
      <motion.header
        style={headerStyle}
        className="fixed top-0 left-0 right-0 z-[100] px-4 transition-all duration-300 shadow-sm w-full"
      >
        <div className="container mx-auto flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div 
            style={{ scale: logoScale }}
            className="flex items-center z-[101]"
          >
            <Link href="/" className="flex items-center" onClick={handleLinkClick}>
              <div className="relative h-10 w-32 md:h-16 md:w-56">
                <Image
                  src="/images/New-logo.png"
                  alt="Apple Interiors Logo"
                  fill
                  className="object-contain"
                  priority
                  unoptimized
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
                  className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium relative group py-2"
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
            
            {/* Social Media Icons */}
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/appleinteriors.hyderabad/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/appleinteriors.net/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@appleinteriors-hyderabad"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-yellow-500 transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </nav>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center space-y-1.5 z-[101] bg-gray-100 rounded-md"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 block bg-gray-800"
            />
            <motion.span
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 block bg-gray-800"
            />
            <motion.span
              animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-6 h-0.5 block bg-gray-800"
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu - improved for better spacing and touch targets */}
      <motion.div
        initial="closed"
        animate={isMenuOpen ? "open" : "closed"}
        variants={{
          closed: { 
            opacity: 0,
            height: 0,
            transition: {
              duration: 0.3,
              ease: "easeInOut",
              when: "afterChildren"
            },
            transitionEnd: { 
              display: "none" 
            }
          },
          open: { 
            opacity: 1,
            height: "calc(100vh - 4rem)",
            display: "block",
            transition: {
              duration: 0.4,
              ease: "easeOut",
              when: "beforeChildren"
            }
          }
        }}
        className={`fixed top-[4rem] left-0 right-0 ${menuBgColor} backdrop-blur-lg md:hidden overflow-hidden shadow-lg z-[95]`}
        style={{
          maxHeight: "calc(100vh - 4rem)"
        }}
      >
        <nav className="container mx-auto py-6 px-4 overflow-y-auto h-full">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <motion.div
                key={link.name}
                variants={menuItemVariants}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
                className={`border-b ${menuBorderColor} pb-3`}
              >
                <Link
                  href={link.href}
                  className={`hover:text-primary transition-colors duration-300 text-xl font-medium block py-4 ${menuTextColor}`}
                  onClick={handleLinkClick}
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
        </nav>
      </motion.div>
    </>
  );
} 