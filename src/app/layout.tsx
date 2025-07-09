import './globals.css';
import { Metadata } from 'next';
import { Providers } from './components/Providers';
import RootLayoutClient from './components/RootLayoutClient';
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration';

export const metadata: Metadata = {
  title: 'Apple Interiors - Best Interior Designers in Hyderabad',
  description: 'Top Interior Design Company in Hyderabad with 20+ years experience. Residential & Commercial Interiors, Modular Kitchen, False Ceiling. Get Free Quote!',
  keywords: 'interior designers in hyderabad, best interior designers in hyderabad, interior design company hyderabad, interior designers in kukatpally, home interior designers hyderabad, office interior designers hyderabad, interior decorators hyderabad, modular kitchen hyderabad, false ceiling contractors hyderabad, wardrobe designers hyderabad, commercial interior designers hyderabad, budget interior designers hyderabad, luxury interior designers hyderabad, top 10 interior designers hyderabad, interior design cost hyderabad, interior design packages hyderabad, 2bhk interior design hyderabad, 3bhk interior design hyderabad, villa interior designers hyderabad, apartment interior designers hyderabad, interior design near me, interior designers kukatpally, interior design companies HITEC city, interior designers in telangana, best interior design company kukatpally, affordable interior designers hyderabad, modern interior design hyderabad',
  authors: [{ name: 'Apple Interiors' }],
  creator: 'Apple Interiors',
  publisher: 'Apple Interiors',
  formatDetection: {
    telephone: true,
    date: true,
    address: true,
    email: true,
  },
  metadataBase: new URL('https://appleinteriors.in'),
  alternates: {
    canonical: 'https://appleinteriors.in',
  },
  openGraph: {
    title: 'Apple Interiors - Best Interior Designers in Hyderabad | Top Interior Design Company Kukatpally',
    description: 'Transform your space with Hyderabad\'s most trusted interior design company. ✓Free Consultation ✓Best Price ✓Quality Materials ✓On-time Delivery. Contact Now!',
    url: 'https://appleinteriors.in',
    siteName: 'Apple Interiors - Best Interior Designers in Hyderabad',
    images: [
      {
        url: 'https://appleinteriors.in/images/New-logo.png',
        width: 800,
        height: 600,
        alt: 'Apple Interiors - Best Interior Designers in Hyderabad',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apple Interiors - Best Interior Designers in Hyderabad | Interior Design Company',
    description: 'Leading Interior Design Company in Hyderabad. Get expert interior design services for your home, office & commercial spaces. Contact us for free consultation!',
    images: ['https://appleinteriors.in/images/New-logo.png'],
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
    google: 'ADD_YOUR_GOOGLE_VERIFICATION_CODE',
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'Apple Interiors - Best Interior Designers in Hyderabad',
  description: 'Leading interior design company in Hyderabad offering complete home, office & commercial interior design solutions. Specialists in modular kitchen, false ceiling, wardrobes & luxury interiors.',
  image: 'https://appleinteriors.in/images/New-logo.png',
  '@id': 'https://appleinteriors.in',
  url: 'https://appleinteriors.in',
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
    latitude: 17.385044,
    longitude: 78.486671
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ],
    opens: '09:00',
    closes: '18:00'
  },
  sameAs: [
    'https://www.facebook.com/appleinteriors.net/',
    'https://www.instagram.com/appleinteriors.hyderabad/',
    'https://www.youtube.com/@appleinteriors-hyderabad'
  ],
  priceRange: '₹₹₹',
  areaServed: [
    'Hyderabad',
    'Kukatpally',
    'HITEC City',
    'Madhapur',
    'Gachibowli',
    'Secunderabad',
    'Jubilee Hills',
    'Banjara Hills',
    'Kondapur',
    'Miyapur',
    'Manikonda',
    'Telangana'
  ],
  serviceType: [
    'Residential Interior Design',
    'Commercial Interior Design',
    'Office Interior Design',
    'Modular Kitchen Design',
    'False Ceiling Design',
    'Wardrobe Design',
    'Living Room Interior Design',
    'Bedroom Interior Design',
    'Bathroom Interior Design',
    'Kids Room Interior Design',
    'Villa Interior Design',
    'Apartment Interior Design',
    'Restaurant Interior Design',
    'Retail Store Interior Design',
    'Hotel Interior Design',
    'Hospital Interior Design',
    'School Interior Design',
    'Turnkey Interior Solutions'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: ['+91 96039 60337', '+91 91606 77899'],
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Hindi', 'Telugu'],
    contactOption: ['TollFree', 'HearingImpairedSupported'],
    hoursAvailable: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '18:00'
    }
  },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Interior Design Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Residential Interior Design Packages',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '2BHK Complete Interior Package'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: '3BHK Complete Interior Package'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Villa Interior Package'
            }
          }
        ]
      },
      {
        '@type': 'OfferCatalog',
        name: 'Commercial Interior Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Office Interior Design'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Retail Store Interior Design'
            }
          }
        ]
      }
    ]
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Providers>
          <ServiceWorkerRegistration />
          <RootLayoutClient>{children}</RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
