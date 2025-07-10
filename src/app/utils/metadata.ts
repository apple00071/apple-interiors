import { Metadata } from 'next';

interface GenerateMetadataProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path,
  ogImage = '/images/og-image.jpg',
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  // Ensure path starts with a slash and remove any trailing slashes
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = normalizedPath.replace(/\/+$/, '');
  
  // Construct the canonical URL
  const url = `https://appleinteriors.in${cleanPath}`;

  return {
    title: {
      absolute: `${title} | Apple Interiors`,
    },
    description,
    keywords: [
      "interior design",
      "home renovation",
      "commercial interiors",
      "office design",
      "luxury interiors",
      "Hyderabad interior designer",
      "modern interior design",
      ...title.toLowerCase().split(' '),
    ],
    authors: [{ name: "Apple Interiors" }],
    creator: "Apple Interiors",
    publisher: "Apple Interiors",
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | Apple Interiors`,
      description,
      url,
      siteName: 'Apple Interiors',
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `https://appleinteriors.in${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Apple Interiors`,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `https://appleinteriors.in${ogImage}`],
      creator: '@appleinteriors',
    },
  };
} 