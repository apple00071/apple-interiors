"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    content: "Apple Interiors transformed our home beyond our expectations. Their attention to detail and creative solutions made our space both beautiful and functional.",
    author: "Priya Reddy",
    role: "Homeowner",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
    rating: 5
  },
  {
    id: 2,
    content: "Working with Apple Interiors was a fantastic experience. They understood our vision perfectly and delivered a stunning office space that our employees love.",
    author: "Rajesh Kumar",
    role: "CEO, Tech Solutions",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
    rating: 5
  },
  {
    id: 3,
    content: "The team's professionalism and expertise are unmatched. They completed our restaurant renovation on time and within budget, exceeding our expectations.",
    author: "Anita Sharma",
    role: "Restaurant Owner",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200",
    rating: 5
  }
];

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 md:py-32 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-medium mb-4 tracking-wide uppercase text-sm"
          >
            Testimonials
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            What Our Clients Say
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Hear from our satisfied clients about their experience working with Apple Interiors
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between z-10 pointer-events-none">
            <button
              onClick={prevTestimonial}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
              aria-label="Previous testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="pointer-events-auto w-12 h-12 rounded-full bg-white/80 dark:bg-gray-800/80 shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
              aria-label="Next testimonial"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          {/* Testimonials Slider */}
          <div className="relative overflow-hidden">
            <motion.div
              key={activeTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-primary/10 dark:text-primary/20">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-6">
                  <Image
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].author}
                    fill
                    className="object-cover rounded-full"
                    unoptimized={true}
                  />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mb-8 font-serif italic">
                  &ldquo;{testimonials[activeTestimonial].content}&rdquo;
                </p>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {testimonials[activeTestimonial].author}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Testimonial Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                  index === activeTestimonial
                    ? "bg-primary w-8"
                    : "bg-gray-300 dark:bg-gray-700 hover:bg-primary/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 