import { Metadata } from "next";
import AnimatedSection from "../components/AnimatedSection";

export const metadata: Metadata = {
  title: "About Us | Apple Interiors",
  description: "Learn about Apple Interiors - Hyderabad's premier interior design firm with over 10 years of experience in creating stunning spaces for homes and businesses.",
};

export default function AboutPage() {
  const listItems = [
    "Comprehensive turnkey solutions",
    "Transparent pricing and budget-friendly packages",
    "Personalized design tailored to your personality and needs",
    "Timely execution with professional project management",
    "A 5-year warranty on all interior work"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-16">
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <AnimatedSection className="text-center mb-16">
                <p className="text-primary-500 font-medium mb-4 tracking-wide uppercase">
                  About Us
                </p>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  Crafting Dream Spaces Since 2017
                </h1>
              </AnimatedSection>

              {/* Main Content */}
              <AnimatedSection className="space-y-8" delay={0.2}>
                <p className="text-gray-600">
                  Apple Interiors is a Hyderabad-based interior design studio built on the belief that great spaces reflect the personalities of the people who live or work in them. Founded in 2017 by a group of passionate designers, we have grown into one of the most trusted names in interior design in Hyderabad—renowned for our personalized approach, innovative solutions, and unwavering commitment to quality.
                </p>

                <p className="text-gray-600">
                  From cozy apartments to luxurious villas, compact offices to commercial establishments, we deliver end-to-end design and turnkey solutions that balance function with beauty. Our team seamlessly blends traditional Indian aesthetics with contemporary elegance to create timeless, harmonious interiors that feel uniquely yours.
                </p>

                <p className="text-gray-600">
                  At Apple Interiors, we don't just design rooms—we shape environments that elevate your lifestyle. Our philosophy, "We Shape Your Homes", reflects our belief that every space should be peaceful, inspiring, and purposefully crafted. With a transparent, client-first approach, we work closely with you to bring your vision to life—on time and within budget.
                </p>

                <div className="mt-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
                    What sets us apart?
                  </h2>
                  <ul className="space-y-4 list-none pl-0">
                    {listItems.map((item, index) => (
                      <AnimatedSection key={item} delay={0.3 + index * 0.1}>
                        <div className="flex items-center space-x-3 text-gray-600">
                          <span className="text-primary-500 text-lg font-bold">✓</span>
                          <span>{item}</span>
                        </div>
                      </AnimatedSection>
                    ))}
                  </ul>
                </div>

                <AnimatedSection delay={0.8}>
                  <p className="text-gray-600 mt-8">
                    Whether you're transforming your dream home or redefining your business space, Apple Interiors is here to turn your ideas into reality—with elegance, efficiency, and heart.
                  </p>
                </AnimatedSection>

                <AnimatedSection delay={0.9}>
                  <p className="text-xl font-medium text-primary-500 mt-8">
                    Let's design a space that tells your story.
                  </p>
                </AnimatedSection>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
} 