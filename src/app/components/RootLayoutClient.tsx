'use client';

import { useState, useEffect } from 'react';
import { Montserrat, Playfair_Display } from "next/font/google";
import Header from './Header'
import Footer from './Footer'
import { Providers } from './Providers'
import { usePathname } from 'next/navigation';
import JsonLd from './JsonLd'
import GoogleAnalytics from './GoogleAnalytics'
import { LazyMotion, domAnimation } from 'framer-motion';

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

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const hideFooterPaths = ['/contact'];
  const shouldShowFooter = pathname ? !hideFooterPaths.includes(pathname) : true;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll reset in a way that won't affect hydration
  useEffect(() => {
    if (mounted) {
      window.scrollTo(0, 0);
    }
  }, [pathname, mounted]);

  return (
    <html lang="en" className="scroll-smooth light" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" sizes="any" />
        <link rel="shortcut icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <JsonLd />
        <GoogleAnalytics />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Providers>
          <LazyMotion features={domAnimation} strict>
            <Header />
            <main className="min-h-screen flex-1 relative">
              {/* Use a no-flash loading approach */}
              <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
              </div>
              {!mounted && (
                <div className="min-h-screen flex items-center justify-center">
                  <div className="animate-pulse text-gray-600">Loading...</div>
                </div>
              )}
            </main>
            {shouldShowFooter && <Footer />}
          </LazyMotion>
        </Providers>
      </body>
    </html>
  );
} 