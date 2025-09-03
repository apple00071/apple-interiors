import { Metadata } from 'next';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  path?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}

interface ServiceStructuredDataProps {
  name: string;
  description: string;
  image: string;
  path: string;
  priceRange?: string;
  areaServed?: string[];
  serviceType?: string[];
  faqList?: Array<{
    question: string;
    answer: string;
  }>;
}

export function generateMetadata({
  title,
  description,
  keywords,
  path = '',
  ogImage = '/images/New-logo.png',
  structuredData
}: SEOProps): Metadata & { structuredData?: { __html: string } } {
  const baseUrl = 'https://appleinteriors.in';
  const url = `${baseUrl}${path}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Apple Interiors - Best Interior Designers in Hyderabad',
      images: [
        {
          url: `${baseUrl}${ogImage}`,
          width: 800,
          height: 600,
          alt: title,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}${ogImage}`],
      creator: '@appleinteriors.hyderabad',
      site: '@appleinteriors.hyderabad',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
    },
    other: {
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'black',
      'apple-mobile-web-app-title': title,
      'format-detection': 'telephone=yes,date=yes,address=yes,email=yes',
      'mobile-web-app-capable': 'yes',
      'msapplication-TileColor': '#ffffff',
      'msapplication-config': '/browserconfig.xml',
      'theme-color': '#ffffff',
    },
    manifest: '/manifest.json',
    icons: {
      icon: [
        { url: '/favicon.ico' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png' },
      ],
    },
    structuredData: structuredData ? {
      __html: JSON.stringify(structuredData)
    } : undefined,
  };
}

export function generateServiceStructuredData({
  name,
  description,
  image,
  path,
  priceRange = '₹₹₹',
  areaServed = ['Hyderabad', 'Telangana'],
  serviceType = [],
  faqList = []
}: ServiceStructuredDataProps) {
  const baseUrl = 'https://appleinteriors.in';
  const url = `${baseUrl}${path}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Apple Interiors',
      image: `${baseUrl}${image}`,
      '@id': baseUrl,
      url: baseUrl,
      telephone: ['+91 96039 60337', '+91 91606 77899'],
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
        latitude: 17.502950,
        longitude: 78.393001
      },
      priceRange,
      areaServed: areaServed.map(area => ({
        '@type': 'City',
        name: area
      }))
    },
    serviceType,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    ...(faqList.length > 0 && {
      mainEntity: faqList.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    })
  };
}

export function generateOrganizationStructuredData() {
  const baseUrl = 'https://appleinteriors.in';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Apple Interiors',
    alternateName: 'Apple Interiors Hyderabad',
    url: baseUrl,
    logo: `${baseUrl}/images/New-logo.png`,
    sameAs: [
      'https://www.facebook.com/appleinteriors.net/',
      'https://www.instagram.com/appleinteriors.hyderabad/',
      'https://www.youtube.com/@appleinteriors-hyderabad'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: ['+91 96039 60337', '+91 91606 77899'],
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Hindi', 'Telugu']
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3, Sreenivasa Nagar, Kukatpally',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500072',
      addressCountry: 'IN'
    }
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
} 