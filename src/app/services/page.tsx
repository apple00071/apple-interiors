"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ServicesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary-500 font-medium mb-4 tracking-wide uppercase"
              >
                OUR SERVICES
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                Complete Interior Design Services in Hyderabad
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="prose prose-lg max-w-none text-gray-600 space-y-4"
              >
                <p>
                  At Apple Interiors, we offer a wide range of interior design services in Hyderabad tailored to suit your lifestyle, taste, and budget. Whether you're transforming your home or redesigning your commercial space, we deliver innovative and functional interiors that stand the test of time.
                </p>
                <p>
                  Recognized among the best interior designers in Hyderabad, we specialize in personalized, affordable, and impactful design solutions.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="grid md:grid-cols-2 gap-8 md:gap-12"
              >
                {/* Residential Services */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-4xl mr-3">🏠</span>
                    Residential Interior Design in Hyderabad
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your home should reflect your personality and support your lifestyle. As expert home interior designers in Hyderabad, we create spaces that are stylish, comfortable, and functional.
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Our residential interior services include:
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Full interior solutions for 2BHK, 3BHK, and villas
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Modular kitchens and wardrobes
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Custom furniture design and space planning
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Color palette consultation and lighting design
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Smart storage and apartment optimization
                    </li>
                  </ul>
                  <p className="mt-6 text-gray-600 italic">
                    Searching for affordable interior designers in Hyderabad? We offer transparent pricing with no hidden costs, ensuring exceptional value at every step.
                  </p>
                </div>

                {/* Commercial Services */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                    <span className="text-4xl mr-3">🏢</span>
                    Commercial Interior Design Services
                  </h2>
                  <p className="text-gray-600 mb-6">
                    We deliver high-performance commercial interior design in Hyderabad that enhances productivity and brand presence. Whether you're revamping an office or launching a retail store, our team understands the needs of modern business spaces.
                  </p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    We design interiors for:
                  </h3>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Offices and coworking spaces
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Retail stores and showrooms
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Hospitality and healthcare environments
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-500 mr-2">•</span>
                      Educational and training centers
                    </li>
                  </ul>
                  <p className="mt-6 text-gray-600">
                    With a keen eye for detail and brand alignment, we create spaces that impress clients, inspire employees, and support your business goals.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Smart & Sustainable Design */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 flex items-center justify-center">
                  <span className="text-4xl mr-3">🌿</span>
                  Smart & Sustainable Design
                </h2>
                <div className="prose prose-lg max-w-none text-gray-600">
                  <p className="mb-6">
                    We bring future-ready solutions with smart home interior design in Hyderabad, incorporating automation, intelligent lighting, and voice-controlled features to elevate convenience and comfort.
                  </p>
                  <p>
                    We are also committed to eco-friendly interior design, using sustainable materials like reclaimed wood, bamboo, and energy-efficient lighting—ideal for clients who care about both style and sustainability.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12">
                  Why Choose Apple Interiors?
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Award-winning interior designers in Hyderabad",
                    "Creative, experienced, and detail-oriented team",
                    "Budget-friendly solutions with transparent quotes",
                    "On-time project delivery and quality assurance",
                    "Personalized designs tailored to your lifestyle and goals"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-center space-x-3 text-left bg-white p-6 rounded-lg shadow-lg"
                    >
                      <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-12 text-center">
                  <p className="text-lg text-gray-600 mb-8">
                    Looking to elevate your space with expert interior designers in Hyderabad? Reach out to Apple Interiors today for a free consultation and let us help you design a space that's uniquely yours.
                  </p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href="/contact"
                      className="inline-block bg-yellow-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-600 transition-colors duration-300"
                    >
                      Get Free Consultation
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 