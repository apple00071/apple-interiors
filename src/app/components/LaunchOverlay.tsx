"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

export default function LaunchOverlay() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 text-center"
      >
        <Image
          src="/images/New-logo.png"
          alt="Apple Interiors Logo"
          width={200}
          height={80}
          className="mx-auto mb-6"
        />
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to the New Apple Interiors
        </h2>
        
        <p className="text-gray-600 mb-8">
          We're excited to introduce our completely redesigned website with a fresh look and enhanced experience.
        </p>

        <div className="space-y-4">
          <motion.a
            href="/"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="block w-full py-4 px-8 bg-yellow-500 text-white rounded-full font-semibold text-lg hover:bg-yellow-600 transition-colors duration-300"
          >
            Experience Our New Website
          </motion.a>
          
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300"
          >
            Return to Classic Site
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10">
          <div className="w-20 h-20 rounded-full bg-yellow-500/10" />
        </div>
        <div className="absolute -bottom-8 -right-8">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10" />
        </div>
      </motion.div>
    </motion.div>
  );
} 