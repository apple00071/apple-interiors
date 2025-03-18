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
      duration: 0.5,
      delay: custom * 0.1 
    }
  })
};

export default function Contact() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Project in Mind Section - Similar to the reference site */}
      <section className="bg-secondary py-16 md:py-32 text-center">
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
              className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-3 md:mb-6 text-white"
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
      <section id="contact" className="py-12 md:py-20 bg-foreground">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-8 md:mb-16 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
            >
              Get in <span className="text-primary">Touch</span>
            </motion.h2>
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
            <div className="md:col-span-2">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-6 md:space-y-8"
              >
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/20 p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2">Our Location</h4>
                    <p className="text-white/70 text-xs md:text-sm">123 Design Street, Washington DC, USA</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/20 p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2">Call Us</h4>
                    <p className="text-white/70 text-xs md:text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/20 p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2">Email Us</h4>
                    <p className="text-white/70 text-xs md:text-sm">info@appleinteriors.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="rounded-full bg-primary/20 p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white text-base md:text-lg font-bold mb-1 md:mb-2">Working Hours</h4>
                    <p className="text-white/70 text-xs md:text-sm">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-white/70 text-xs md:text-sm">Saturday: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Contact Form - Right Column */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-3"
            >
              <form className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label htmlFor="name" className="text-white/90 text-xs md:text-sm block mb-1 md:mb-2">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 md:py-3 md:px-4 text-white placeholder-white/50 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-white/90 text-xs md:text-sm block mb-1 md:mb-2">Your Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 md:py-3 md:px-4 text-white placeholder-white/50 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com" 
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="text-white/90 text-xs md:text-sm block mb-1 md:mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 md:py-3 md:px-4 text-white placeholder-white/50 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="How can we help you?" 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-white/90 text-xs md:text-sm block mb-1 md:mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 md:py-3 md:px-4 text-white placeholder-white/50 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about your project..." 
                  ></textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white py-2 px-4 md:py-3 md:px-6 rounded-lg font-medium transition-all duration-300 text-xs md:text-sm w-full md:w-auto"
                >
                  Send Message
                </motion.button>
              </form>
            </motion.div>
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
                className="w-8 h-8 md:w-8 md:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.2, backgroundColor: "var(--primary)" }}
                transition={{ duration: 0.2 }}
                href="#" 
                className="w-8 h-8 md:w-8 md:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
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
                className="w-8 h-8 md:w-8 md:h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white"
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