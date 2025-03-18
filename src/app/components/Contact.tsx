"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1]
    }
  })
};

export default function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Project in Mind Section - Similar to the reference site */}
      <section className="bg-secondary dark:bg-secondary py-16 md:py-32 text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 
              variants={fadeIn} 
              custom={1}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6"
            >
              project in <span className="text-primary">mind?</span>
            </motion.h2>
            
            <motion.button
              variants={fadeIn}
              custom={2}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary hover:bg-primary/90 text-white py-2 px-5 md:py-3 md:px-8 rounded-lg font-medium tracking-wider text-sm md:text-lg mt-3 md:mt-6 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Request A quote
            </motion.button>
            
            <motion.p
              variants={fadeIn}
              custom={3}
              className="text-white/80 mt-4 md:mt-8 max-w-2xl mx-auto text-xs md:text-base px-2 md:px-0"
            >
              Ready to transform your home or office into a stunning and functional space? Our expert team at Apple Interiors is here to help!
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-foreground dark:bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-16 max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white/90 mb-3 text-xs md:text-base"
            >
              Reach us to discover how our services can assist you in accomplishing your objectives.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12">
            {/* Contact Information - Left Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="col-span-1 md:col-span-2 space-y-6 md:space-y-8"
            >
              <div>
                <h3 className="text-base md:text-xl font-semibold mb-3 md:mb-4 text-white">Contact Information</h3>
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-white/90 font-medium text-xs md:text-base">Head Office</p>
                    <p className="text-white/80 text-xs md:text-sm">Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3, Sreenivasa Nagar, Kukatpally, Hyderabad</p>
                    <p className="text-white/80 text-xs md:text-sm">Telangana - 500072</p>
                  </div>
                  <div>
                    <p className="text-white/90 font-medium text-xs md:text-base">Designer Studio</p>
                    <p className="text-white/80 text-xs md:text-sm">H. No: LIG B-29, 1st floor, Dr A S Rao Nagar Opp SBI Kapra Branch, Hyderabad - 500062</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-xs md:text-sm">aravind.bandaru@appleinteriors.in</p>
                  </div>
                  <div>
                    <p className="text-white/80 text-xs md:text-sm">+91 9603 9603 37 | 40485 64775</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base md:text-xl font-semibold mb-3 md:mb-4 text-white">Working Hours</h3>
                <div className="space-y-2 md:space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Monday - Friday:</span>
                    <span className="font-medium text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Saturday:</span>
                    <span className="font-medium text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Sunday:</span>
                    <span className="font-medium text-white">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer links - in a responsive grid on mobile */}
            <div className="col-span-1 md:col-span-3 grid grid-cols-3 gap-4 md:gap-4">
              {/* Footer links - first set */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="col-span-1"
              >
                <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 text-white">Pages</h3>
                <ul className="space-y-2 md:space-y-2">
                  <li><Link href="#home" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Home</Link></li>
                  <li><Link href="#about" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">About Us</Link></li>
                  <li><Link href="#services" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Services</Link></li>
                  <li><Link href="#projects" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Portfolio</Link></li>
                  <li><Link href="#contact" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Contact</Link></li>
                </ul>
              </motion.div>

              {/* Footer links - second set */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="col-span-1"
              >
                <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 text-white">Services</h3>
                <ul className="space-y-2 md:space-y-2">
                  <li><Link href="#services" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Residential Design</Link></li>
                  <li><Link href="#services" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Commercial Spaces</Link></li>
                  <li><Link href="#services" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Renovation</Link></li>
                  <li><Link href="#services" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Design Consultation</Link></li>
                </ul>
              </motion.div>

              {/* Footer links - third set */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="col-span-1"
              >
                <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4 text-white">Legal</h3>
                <ul className="space-y-2 md:space-y-2">
                  <li><Link href="#" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Privacy Policy</Link></li>
                  <li><Link href="#" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Terms of Service</Link></li>
                  <li><Link href="#" className="text-white/80 hover:text-primary transition-colors duration-300 text-xs md:text-sm">Cookie Policy</Link></li>
                </ul>
              </motion.div>
            </div>
          </div>

          <motion.hr 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-white/20 my-8 md:my-8" 
          />

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col md:flex-row justify-between items-center"
          >
            <div className="flex flex-col md:flex-row items-center mb-6 md:mb-0">
              <div className="relative h-10 w-32 md:h-14 md:w-44 mr-2 mb-3 md:mb-0">
                <Image
                  src="/images/New-logo.png"
                  alt="Apple Interiors Logo"
                  fill
                  className="object-contain"
                  unoptimized={true}
                />
              </div>
              <p className="text-white/70 text-xs md:text-sm text-center md:text-left">
                © {currentYear} Apple Interiors. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-3 md:space-x-4">
              <motion.a 
                whileHover={{ scale: 1.2, backgroundColor: "var(--primary)" }}
                transition={{ duration: 0.2 }}
                href="#" 
                className="w-8 h-8 md:w-8 md:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.2, backgroundColor: "var(--primary)" }}
                transition={{ duration: 0.2 }}
                href="#" 
                className="w-8 h-8 md:w-8 md:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.2, backgroundColor: "var(--primary)" }}
                transition={{ duration: 0.2 }}
                href="#" 
                className="w-8 h-8 md:w-8 md:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
} 