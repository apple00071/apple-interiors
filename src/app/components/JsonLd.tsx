export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Apple Interiors",
    "image": "https://appleinteriors.in/images/New-logo.png",
    "@id": "https://appleinteriors.in",
    "url": "https://appleinteriors.in",
    "telephone": ["+919603960337", "+919160677899", "+914048544775"],
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3",
      "addressLocality": "Kukatpally",
      "addressRegion": "Telangana",
      "postalCode": "500072",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.4739535,
      "longitude": 78.3998180
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/appleinteriors.net/",
      "https://www.instagram.com/appleinteriors.hyderabad/",
      "https://www.youtube.com/@appleinteriors-hyderabad"
    ],
    "areaServed": "Hyderabad",
    "description": "Transform your space with Apple Interiors - Hyderabad's leading interior design company. Specializing in residential, commercial, and renovation projects with 10+ years of experience.",
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Interior Design",
          "description": "Full-service interior design solutions tailored to your style and needs"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Space Planning",
          "description": "Optimize your space with our expert planning services"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Furniture",
          "description": "Bespoke furniture design and manufacturing"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 