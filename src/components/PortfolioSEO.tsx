import Head from 'next/head';

interface PortfolioSEOProps {
  images: Array<{
    src: string;
    category: string;
  }>;
}

export default function PortfolioSEO({ images }: PortfolioSEOProps) {
  // Generate ImageObject structured data for each image
  const imageStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Apple Interiors Portfolio Gallery',
    description: 'Interior Design Portfolio by Apple Interiors - Best Interior Designers in Hyderabad',
    image: images.map((img, index) => ({
      '@type': 'ImageObject',
      contentUrl: `https://appleinteriors.in${img.src}`,
      name: `${img.category} Design by Apple Interiors Hyderabad`,
      description: generateSEODescription(img.category),
      creditText: 'Apple Interiors',
      copyrightNotice: '© Apple Interiors',
      creator: {
        '@type': 'Organization',
        name: 'Apple Interiors',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3, Sreenivasa Nagar, Kukatpally',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          postalCode: '500072',
          addressCountry: 'IN'
        },
        telephone: ['+91 9603 9603 37', '+91 9160 6778 99'],
        sameAs: [
          'https://www.facebook.com/appleinteriors.net',
          'https://www.instagram.com/appleinteriors.hyderabad',
          'https://www.youtube.com/@appleinteriors-hyderabad'
        ]
      }
    }))
  };

  // Generate organization structured data
  const organizationStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Apple Interiors',
    description: 'Leading Interior Design Company in Hyderabad specializing in residential and commercial interior design services',
    url: 'https://appleinteriors.in',
    telephone: ['+91 9603 9603 37', '+91 9160 6778 99'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3, Sreenivasa Nagar, Kukatpally',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500072',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '17.4849',
      longitude: '78.4138'
    },
    areaServed: ['Kukatpally', 'HITEC City', 'Madhapur', 'Hyderabad'],
    sameAs: [
      'https://www.facebook.com/appleinteriors.net',
      'https://www.instagram.com/appleinteriors.hyderabad',
      'https://www.youtube.com/@appleinteriors-hyderabad'
    ]
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(imageStructuredData)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData)
        }}
      />
      
      {/* Meta tags for social sharing */}
      <meta property="og:title" content="Interior Design Portfolio - Apple Interiors Hyderabad" />
      <meta property="og:description" content="View our stunning interior design portfolio featuring modern living rooms, bedrooms, kitchens, and more. Best interior designers in Hyderabad." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://appleinteriors.in/portfolio" />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Interior Design Portfolio - Apple Interiors Hyderabad" />
      <meta name="twitter:description" content="View our stunning interior design portfolio featuring modern living rooms, bedrooms, kitchens, and more. Best interior designers in Hyderabad." />
      
      {/* Add meta tags for each image */}
      {images.map((img, index) => (
        <meta
          key={index}
          property="og:image"
          content={`https://appleinteriors.in${img.src}`}
        />
      ))}
      <meta property="og:image:type" content="image/webp" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="800" />
      
      {/* Additional SEO meta tags */}
      <meta name="description" content="Explore Apple Interiors' portfolio of premium interior design projects in Hyderabad. View our modern living rooms, bedrooms, modular kitchens, and false ceiling designs." />
      <meta name="keywords" content="interior design portfolio, interior designers hyderabad, home interior designs, modular kitchen designs, false ceiling designs, bedroom designs, living room designs" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://appleinteriors.in/portfolio" />
    </Head>
  );
}

function generateSEODescription(category: string): string {
  const descriptions: { [key: string]: string } = {
    'Living Room': 'Premium living room interior design in Hyderabad featuring modern TV units, false ceiling, and custom furniture. Perfect blend of style and comfort by Apple Interiors.',
    'Dining': 'Elegant dining room designs in Hyderabad with custom crockery units, modern lighting, and space-saving solutions. Created by Apple Interiors.',
    'Bedroom': 'Luxurious bedroom interior design in Hyderabad with custom wardrobes, false ceiling, and ambient lighting. Expert craftsmanship by Apple Interiors.',
    'Kitchen': 'Modern modular kitchen design in Hyderabad with premium accessories, smart storage solutions, and ergonomic layout. Designed by Apple Interiors.',
    'False Ceiling': 'Designer false ceiling solutions in Hyderabad featuring LED lighting, POP work, and contemporary designs. Professional installation by Apple Interiors.'
  };

  return descriptions[category] || `Professional ${category} interior design by Apple Interiors, Hyderabad's leading interior design company.`;
} 