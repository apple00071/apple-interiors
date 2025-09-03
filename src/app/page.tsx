import { Metadata } from 'next';
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Brands from "./components/Brands";
import ProcessVideo from "./components/ProcessVideo";
import { getPortfolioItems, getCategories } from './lib/db';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Apple Interiors - Best Interior Designers in Hyderabad | Top Interior Design Company',
  description: 'Leading Interior Design Company in Hyderabad with 7+ years of experience. ✓Residential & Commercial Interiors ✓Modular Kitchen ✓False Ceiling ✓Free Consultation. Get Quote Now!',
  keywords: 'interior designers in hyderabad, best interior designers in hyderabad, interior design company hyderabad, interior designers in kukatpally, home interior designers hyderabad, office interior designers hyderabad, modular kitchen hyderabad, false ceiling contractors hyderabad, wardrobe designers hyderabad, commercial interior designers hyderabad, budget interior designers hyderabad, luxury interior designers hyderabad',
  alternates: {
    canonical: 'https://appleinteriors.in'
  },
  openGraph: {
    title: 'Apple Interiors - Best Interior Designers in Hyderabad',
    description: 'Transform your space with Hyderabad\'s most trusted interior design company. ✓Free Consultation ✓Best Price ✓Quality Materials ✓On-time Delivery',
    url: 'https://appleinteriors.in',
    type: 'website',
    images: [
      {
        url: 'https://appleinteriors.in/images/New-logo.png',
        width: 800,
        height: 600,
        alt: 'Apple Interiors - Best Interior Designers in Hyderabad'
      }
    ]
  }
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function HomePortfolio() {
  const items = await getPortfolioItems();
  const categories = await getCategories();
  return <Portfolio items={items} categories={categories} />;
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <ProcessVideo />
      <Suspense fallback={
        <div className="text-center py-12">
          <p className="text-gray-600">Loading portfolio items...</p>
        </div>
      }>
        <HomePortfolio />
      </Suspense>
      <Testimonials />
      <Brands />
      <About />
    </main>
  );
}
