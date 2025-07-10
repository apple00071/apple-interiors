import React from 'react';
import { generateMetadata } from '../utils/metadata';

export const metadata = generateMetadata({
  title: "About Us",
  description: "Learn about Apple Interiors - Hyderabad's premier interior design firm with 7 years of experience in creating stunning spaces for homes and businesses.",
  path: "/about",
  ogImage: "/images/about-banner.jpg"
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
} 