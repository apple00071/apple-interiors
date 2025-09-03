import { Metadata } from 'next';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import { getPortfolioItems, getCategories } from '../lib/db';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Apple Interiors - Best 2BHK Interior Designers in Hyderabad | Complete Home Interiors',
  description: 'Complete 2BHK Interior Design Solutions in Hyderabad by Apple Interiors. ✓Modular Kitchen ✓Wardrobes ✓False Ceiling ✓TV Unit ✓Storage Solutions ✓Free Quote. Transform your 2BHK into a dream home!',
  keywords: '2bhk interior design hyderabad, 2bhk house interior design, apartment interior designers hyderabad, 2bhk flat interior design, 2bhk interior packages hyderabad, 2bhk interior cost hyderabad, small apartment interior design, budget interior design 2bhk, modern 2bhk design, complete home interior 2bhk',
  alternates: {
    canonical: 'https://appleinteriors.in/2bhk-interior-design-hyderabad'
  },
  openGraph: {
    title: 'Best 2BHK Interior Designers in Hyderabad | Apple Interiors',
    description: 'Transform your 2BHK apartment with our expert interior design services. Get modular kitchen, wardrobes, false ceiling & more. Free consultation available!',
    url: 'https://appleinteriors.in/2bhk-interior-design-hyderabad',
    type: 'website',
    images: [
      {
        url: 'https://appleinteriors.in/images/New-logo.png',
        width: 800,
        height: 600,
        alt: 'Apple Interiors - 2BHK Interior Design Services in Hyderabad'
      }
    ]
  }
};

// JSON-LD for this specific service
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: '2BHK Interior Design Services in Hyderabad',
  provider: {
    '@type': 'LocalBusiness',
    name: 'Apple Interiors',
    image: 'https://appleinteriors.in/images/New-logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500072',
      addressCountry: 'IN'
    },
    telephone: ['+91 96039 60337', '+91 91606 77899'],
    priceRange: '₹₹₹'
  },
  areaServed: {
    '@type': 'City',
    name: 'Hyderabad'
  },
  description: 'Complete 2BHK interior design solutions including modular kitchen, wardrobes, false ceiling, TV unit, and storage solutions. We offer customized designs that maximize space utilization and enhance functionality.',
  offers: {
    '@type': 'Offer',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'INR',
      minPrice: '300000'
    }
  }
};

async function TwoBHKPortfolio() {
  const items = await getPortfolioItems();
  const categories = await getCategories();
  // Filter items relevant to 2BHK if possible
  return <Portfolio items={items} categories={categories} />;
}

export default function TwoBHKInteriorDesign() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen">
        <Hero />
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
              2BHK Interior Design Services in Hyderabad
            </h1>
            <div className="max-w-3xl mx-auto text-lg text-gray-700">
              <p className="mb-6">
                Transform your 2BHK apartment into a stunning living space with Apple Interiors. 
                We specialize in creating functional and aesthetically pleasing interiors that 
                maximize space utilization and reflect your personal style.
              </p>
              <h2 className="text-2xl font-semibold mb-4">Our 2BHK Interior Services Include:</h2>
              <ul className="list-disc pl-6 mb-6">
                <li>Modular Kitchen Design</li>
                <li>Bedroom Wardrobes</li>
                <li>False Ceiling Design</li>
                <li>TV Unit & Entertainment Area</li>
                <li>Space-saving Storage Solutions</li>
                <li>Custom Furniture Design</li>
                <li>Complete Electrical & Plumbing Work</li>
                <li>Interior Painting & Wall Treatments</li>
              </ul>
              <p className="mb-6">
                Get a free consultation and quote for your 2BHK interior design project. 
                Our experts will help you choose the best materials and designs within your budget.
              </p>
            </div>
          </div>
        </section>
        <Services />
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-gray-600">Loading portfolio items...</p>
          </div>
        }>
          <TwoBHKPortfolio />
        </Suspense>
      </main>
    </>
  );
} 