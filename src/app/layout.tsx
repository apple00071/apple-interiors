import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import JsonLd from './components/JsonLd'

export const dynamic = 'force-static';

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

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
    icon: [
      {
        url: "/icon.png",
        type: "image/png",
      }
    ],
    shortcut: ["/icon.png"],
    apple: [
      {
        url: "/icon.png",
        type: "image/png",
      }
    ],
  },
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <JsonLd />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
