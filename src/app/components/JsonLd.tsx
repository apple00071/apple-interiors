export default function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": "https://appleinteriors.in",
    "name": "Apple Interiors",
    "image": "https://appleinteriors.in/images/New-logo.png",
    "url": "https://appleinteriors.in",
    "telephone": ["+91 96039 60337", "+91 91606 77899"],
    "priceRange": "₹₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Maneesh Enclave, 1st floor, Bhagya Nagar Phase 3, Sreenivasa Nagar, Kukatpally",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "postalCode": "500072",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 17.385044,
      "longitude": 78.486671
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
      "https://www.facebook.com/appleinteriors.net",
      "https://www.instagram.com/appleinteriors.hyderabad",
      "https://www.youtube.com/@appleinteriors-hyderabad"
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
      "reviewCount": "180"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
} 