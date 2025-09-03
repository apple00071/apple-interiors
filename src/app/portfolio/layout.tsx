import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio | Apple Interiors',
  description: 'Explore our portfolio of interior design projects, showcasing our expertise in living rooms, dining spaces, bedrooms, kitchens, and false ceilings.',
  openGraph: {
    title: 'Portfolio | Apple Interiors',
    description: 'Explore our portfolio of interior design projects, showcasing our expertise in living rooms, dining spaces, bedrooms, kitchens, and false ceilings.',
    images: ['/images/og-image.jpg'],
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 