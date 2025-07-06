import './globals.css';
import { Metadata } from 'next';
import { Providers } from './components/Providers';
import RootLayoutClient from './components/RootLayoutClient';

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
