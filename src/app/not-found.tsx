import { Metadata, Viewport } from "next";
import Link from "next/link";
import React from 'react'

export const metadata: Metadata = {
  title: "Page Not Found | Apple Interiors",
  description: "The page you are looking for does not exist. Return to Apple Interiors homepage.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function NotFound(): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center px-4 lg:px-40 mb-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. Please check the URL or return to our homepage.
        </p>
        <div className="space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
          >
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 ml-4"
          >
            Contact Support
          </Link>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500">
        <p>Need help? Contact us at:</p>
        <a href="tel:+919603960337" className="text-primary-600 hover:text-primary-700">+91 96039 60337</a>
        <span className="mx-2">|</span>
        <a href="mailto:appleinteriorsinfra@gmail.com" className="text-primary-600 hover:text-primary-700">appleinteriorsinfra@gmail.com</a>
      </div>
    </div>
  );
}
