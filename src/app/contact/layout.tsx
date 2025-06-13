import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "../globals.css";
import Header from '../components/Header';
import JsonLd from '../components/JsonLd';

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

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth light" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/icon.png" sizes="any" />
        <link rel="shortcut icon" type="image/png" href="/icon.png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <JsonLd />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
      >
        <Header />
        <main className="min-h-screen flex-1">
          {children}
        </main>
        {/* No footer included for contact page */}
      </body>
    </html>
  );
} 