export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://appleinteriors.in",
    "name": "Apple Interiors",
    "image": "https://appleinteriors.in/images/New-logo.png",
    "url": "https://appleinteriors.in",
    "telephone": "+91-XXX-XXX-XXXX",
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Street Address",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500XXX",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "XX.XXXXX",
      "longitude": "XX.XXXXX"
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
      "opens": "10:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/appleinteriors",
      "https://www.instagram.com/appleinteriors",
      "https://www.linkedin.com/company/appleinteriors"
    ],
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
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 