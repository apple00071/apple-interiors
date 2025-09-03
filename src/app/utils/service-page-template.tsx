import { Metadata } from 'next';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Portfolio from '../components/Portfolio';
import { getPortfolioItems, getCategories } from '../lib/db';
import { Suspense } from 'react';

interface ServicePageProps {
  title: string;
  description: string;
  keywords: string;
  path: string;
  heading: string;
  introText: string;
  servicesList: string[];
  faqList: Array<{ question: string; answer: string; }>;
  minPrice?: number;
}

export function generateServiceMetadata({
  title,
  description,
  keywords,
  path,
}: ServicePageProps): Metadata {
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://appleinteriors.in/${path}`
    },
    openGraph: {
      title,
      description,
      url: `https://appleinteriors.in/${path}`,
      type: 'website',
      images: [
        {
          url: 'https://appleinteriors.in/images/New-logo.png',
          width: 800,
          height: 600,
          alt: title
        }
      ]
    }
  };
}

export function generateServiceJsonLd({
  title,
  description,
  path,
  servicesList,
  faqList,
  minPrice = 300000,
}: ServicePageProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
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
    description,
    url: `https://appleinteriors.in/${path}`,
    serviceType: servicesList,
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'INR',
        minPrice: minPrice.toString()
      }
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: title,
      itemListElement: servicesList.map(service => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service
        }
      }))
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://appleinteriors.in/${path}`
    },
    // Add FAQ Schema
    mainEntity: faqList.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

async function ServicePortfolio() {
  const items = await getPortfolioItems();
  const categories = await getCategories();
  return <Portfolio items={items} categories={categories} />;
}

export default function ServicePageTemplate(props: ServicePageProps) {
  const { heading, introText, servicesList, faqList } = props;
  const jsonLd = generateServiceJsonLd(props);

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
              {heading}
            </h1>
            <div className="max-w-3xl mx-auto text-lg text-gray-700">
              <p className="mb-6">{introText}</p>
              <h2 className="text-2xl font-semibold mb-4">Our Services Include:</h2>
              <ul className="list-disc pl-6 mb-6">
                {servicesList.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
              <p className="mb-6">
                Get a free consultation and quote for your project. 
                Our experts will help you choose the best materials and designs within your budget.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              {faqList.map((faq, index) => (
                <div key={index} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Services />
        <Suspense fallback={
          <div className="text-center py-12">
            <p className="text-gray-600">Loading portfolio items...</p>
          </div>
        }>
          <ServicePortfolio />
        </Suspense>
      </main>
    </>
  );
} 