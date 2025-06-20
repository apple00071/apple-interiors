'use client';

import { Montserrat, Playfair_Display } from "next/font/google";
import Header from './Header'
import Footer from './Footer'
import { Providers } from './Providers'
import { usePathname } from 'next/navigation';
import JsonLd from './JsonLd'
import GoogleAnalytics from './GoogleAnalytics'

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
  const pathname = usePathname();
  const hideFooterPaths = ['/contact'];
  const shouldShowFooter = !hideFooterPaths.includes(pathname);

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
          <Header />
          <main className="min-h-screen flex-1 relative">
            {children}
          </main>
          {shouldShowFooter && <Footer />}
        </Providers>
      </body>
    </html>
  );
} 