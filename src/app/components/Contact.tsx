"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import { submitContactForm } from "../actions/contact";
import ErrorBoundary from "./ErrorBoundary";

const propertyTypes = ["2BHK", "3BHK", "4BHK", "Villa", "Custom"];

// Lazy load the map component with error boundary
const Map = lazy(() => import('./Map').catch(() => ({ default: () => null })));

// Animation variants
const animations = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 }
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 }
  }
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    location: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const result = await submitContactForm(formData);

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your message! We will get back to you soon.',
        });

        setFormData({
          name: '',
          email: '',
          phone: '',
          type: '',
          location: '',
          message: '',
        });
      } else {
        throw new Error(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setSubmitStatus({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to submit form',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <LazyMotion features={domAnimation}>
      <section id="contact" className="py-16 sm:py-24 md:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 md:mb-24">
            {isMounted ? (
              <>
                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={animations.fadeInUp}
                  className="text-primary font-medium mb-3 sm:mb-4 tracking-wide uppercase text-sm"
                >
                  Contact Us
                </motion.p>
                
                <motion.h2
                  initial="hidden"
                  animate="visible"
                  variants={animations.fadeInUp}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6"
                >
                  Get in Touch
                </motion.h2>
                
                <motion.p
                  initial="hidden"
                  animate="visible"
                  variants={animations.fadeInUp}
                  transition={{ delay: 0.2 }}
                  className="text-base sm:text-lg text-gray-600 dark:text-gray-400"
                >
                  Let&apos;s discuss your project and create something extraordinary together
                </motion.p>
              </>
            ) : (
              <>
                <p className="text-primary font-medium mb-3 sm:mb-4 tracking-wide uppercase text-sm">
                  Contact Us
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Get in Touch
                </h2>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                  Let&apos;s discuss your project and create something extraordinary together
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-24">
            {/* Contact Form */}
            {isMounted ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.fadeInLeft}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus.type && (
                    <div
                      className={`p-4 rounded-lg ${
                        submitStatus.type === 'success'
                          ? 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      pattern="^[+]?[0-9\s()-]{8,20}$"
                      title="Please enter a valid phone number with or without country code"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Property Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="" className="text-gray-500">Select Property Type</option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type} className="text-gray-900 dark:text-white">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all duration-200 text-gray-900 dark:text-white resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-6 rounded-lg bg-primary text-white font-medium transition-all duration-200 ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-primary/90 active:transform active:scale-[0.98]'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <div>
                <form className="space-y-6">
                  {/* Static version for SSR */}
                  <div>
                    <label htmlFor="name-static" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name-static"
                      className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 outline-none text-gray-900 dark:text-white"
                    />
                  </div>
                  {/* Other form fields would go here in static version */}
                </form>
              </div>
            )}

            {/* Contact Information */}
            {isMounted ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={animations.fadeInRight}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Office</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3,<br />
                    Sreenivasa Nagar, Kukatpally, Hyderabad<br />
                    Telangana - 500072.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Contact Info</h3>
                  <div className="space-y-2">
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Email:</span>{' '}
                      <a href="mailto:aravind.bandaru@appleinteriors.in" className="hover:text-primary transition-colors">
                        aravind.bandaru@appleinteriors.in
                      </a>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Mobile:</span>{' '}
                      <span className="flex flex-col">
                        <a href="tel:+919603960337" className="hover:text-primary transition-colors">
                          +91 9603 9603 37
                        </a>
                        <a href="tel:+919160677899" className="hover:text-primary transition-colors">
                          +91 9160 6778 99
                        </a>
                      </span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Landline:</span>{' '}
                      <a href="tel:+914048544775" className="hover:text-primary transition-colors">
                        +91 40 48544775
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Business Hours</h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p>Monday: 9:00 AM - 6:00 PM</p>
                    <p>Tuesday: Closed</p>
                    <p>Wednesday: 9:00 AM - 6:00 PM</p>
                    <p>Thursday: 9:00 AM - 6:00 PM</p>
                    <p>Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 6:00 PM</p>
                    <p>Sunday: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>

                {/* Map */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location</h3>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <ErrorBoundary>
                      <Suspense fallback={
                        <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Loading map...</span>
                        </div>
                      }>
                        {isMounted && <Map />}
                      </Suspense>
                    </ErrorBoundary>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                {/* Static contact info for SSR */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Office</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3,<br />
                    Sreenivasa Nagar, Kukatpally, Hyderabad<br />
                    Telangana - 500072.
                  </p>
                </div>
                {/* Other contact info would go here in static version */}
              </div>
            )}
          </div>
        </div>
      </section>
    </LazyMotion>
  );
} 