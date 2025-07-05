import type { Metadata, Viewport } from "next";
import "./globals.css";
import { initDb } from './lib/init-db';
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppWidget from "./components/WhatsAppWidget";
import { Providers } from "./components/Providers";

// Initialize the database
initDb();

export const metadata: Metadata = {
  title: {
    template: '%s | Apple Interiors',
    default: 'Apple Interiors | Modern Interior Design',
  },
  description: "Transform your space with Apple Interiors - Expert interior design services for residential, commercial, and renovation projects with 10+ years of experience.",
  keywords: ["interior design", "home renovation", "commercial interiors", "office design", "luxury interiors", "Hyderabad interior designer", "modern interior design"],
  authors: [{ name: "Apple Interiors" }],
  creator: "Apple Interiors",
  publisher: "Apple Interiors",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://appleinteriors.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Apple Interiors | Modern Interior Design',
    description: 'Transform your space with Apple Interiors - Hyderabad\'s leading interior design company.',
    url: 'https://appleinteriors.in',
    siteName: 'Apple Interiors',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Apple Interiors - Premium Interior Design',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apple Interiors | Modern Interior Design',
    description: 'Transform your space with Apple Interiors - Hyderabad\'s leading interior design company.',
    images: ['/images/twitter-image.jpg'],
    creator: '@appleinteriors',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}
