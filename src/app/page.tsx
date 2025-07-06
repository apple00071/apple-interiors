import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Testimonials from "./components/Testimonials";
import Brands from "./components/Brands";
import ProcessVideo from "./components/ProcessVideo";
import { getPortfolioItems, getCategories } from './lib/db';
import { Suspense } from 'react';

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
