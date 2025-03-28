"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || !isHomePage 
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg" 
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 h-20">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <Link href="/" className="relative z-50">
              <Image
                src="/images/New-logo.png"
                alt="Apple Interiors Logo"
                width={140}
                height={40}
                className="w-32 sm:w-[180px] h-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      pathname === item.href
                        ? "text-primary"
                        : isScrolled || !isHomePage
                          ? "text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                          : "text-white hover:text-white/80"
                    }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/contact"
                className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover-lift
                  ${
                    isScrolled || !isHomePage
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "bg-white text-[#2C2C2C] hover:bg-gray-100"
                  }`}
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative z-50 md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              <div className="relative w-6 h-5">
                <span
                  className={`absolute w-6 h-0.5 transform transition-all duration-300 ${
                    isOpen
                      ? "rotate-45 translate-y-2.5 bg-white"
                      : `rotate-0 translate-y-0.5 ${isScrolled || !isHomePage ? "bg-gray-800" : "bg-white"}`
                  }`}
                />
                <span
                  className={`absolute w-6 h-0.5 transform transition-all duration-300 ${
                    isOpen
                      ? "opacity-0"
                      : `opacity-100 translate-y-2.5 ${isScrolled || !isHomePage ? "bg-gray-800" : "bg-white"}`
                  }`}
                />
                <span
                  className={`absolute w-6 h-0.5 transform transition-all duration-300 ${
                    isOpen
                      ? "-rotate-45 translate-y-2.5 bg-white"
                      : `rotate-0 translate-y-4.5 ${isScrolled || !isHomePage ? "bg-gray-800" : "bg-white"}`
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-primary"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 right-0 w-full bg-primary flex items-center justify-center"
            >
              <div className="flex flex-col items-center space-y-8">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="text-2xl font-medium text-white hover:text-white/80 transition-colors"
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 