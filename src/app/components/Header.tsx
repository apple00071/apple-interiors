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
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8 }}
            >
              <Link
                href="/contact"
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
            <motion.div 
              variants={menuItemVariants}
              className="pt-6 mt-4"
            >
              <Link
                href="/contact"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-4 rounded-lg font-medium transition-colors duration-300 inline-block w-full text-center"
                onClick={handleLinkClick}
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </nav>
      </motion.div>
    </>
  );
} 