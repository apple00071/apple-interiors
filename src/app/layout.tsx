import { initializeDatabase } from './lib/db';
import './globals.css';
import { Metadata } from 'next';
import { Providers } from './components/Providers';
import RootLayoutClient from './components/RootLayoutClient';

// Initialize database
initializeDatabase().catch(console.error);

export const metadata: Metadata = {
  title: 'Apple Interiors',
  description: 'Interior Design and Decoration Services in Hyderabad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
