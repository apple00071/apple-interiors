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

  // Force menu to be closed on component mount
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Handle scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isHomePage 
            ? isScrolled 
              ? "bg-white/80 backdrop-blur-lg shadow-lg" 
              : "bg-transparent"
            : "bg-white shadow-lg"
        }`}
      >
        <nav className="container mx-auto px-4 h-20">
          <div className="flex items-center justify-between h-full">
            <Link href="/" className="relative z-10">
              <Image
                src="/images/New-logo.png"
                alt="Apple Interiors Logo"
                width={140}
                height={40}
                className="w-32 sm:w-[180px] h-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-300 ${
                    pathname === item.href
                      ? "text-primary-600"
                      : isHomePage && !isScrolled
                        ? "text-white hover:text-primary-200"
                        : "text-gray-600 hover:text-primary-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                href="/contact"
                className={`inline-flex items-center px-4 py-2 rounded-full text-white font-medium text-sm transition-colors duration-300 ${
                  isHomePage && !isScrolled
                    ? "bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    : "bg-primary-500 hover:bg-primary-600"
                }`}
              >
                Contact Us
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={handleMenuToggle}
              className={`md:hidden relative z-10 p-2 -mr-2 ${
                isHomePage && !isScrolled && !isOpen
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={handleMenuToggle}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-xl md:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 h-20">
                  <Link href="/" onClick={handleLinkClick}>
                    <Image
                      src="/images/New-logo.png"
                      alt="Apple Interiors Logo"
                      width={140}
                      height={40}
                      className="w-32 sm:w-[180px] h-auto"
                      priority
                    />
                  </Link>
                  <button
                    onClick={handleMenuToggle}
                    className="p-2 text-gray-600"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <nav className="px-4 py-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleLinkClick}
                        className={`block py-3 text-lg font-medium transition-colors duration-300 ${
                          pathname === item.href
                            ? "text-primary-600"
                            : "text-gray-600 hover:text-primary-600"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/contact"
                      onClick={handleLinkClick}
                      className="mt-4 inline-flex w-full items-center justify-center px-4 py-3 rounded-full bg-primary-500 hover:bg-primary-600 text-white font-medium text-lg transition-colors duration-300"
                    >
                      Contact Us
                    </Link>
                  </nav>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 