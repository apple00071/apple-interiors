import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

export default function SEO({
  title = 'Apple Interiors | Modern Interior Design',
  description = 'Transform your space with Apple Interiors - Expert interior design services for residential, commercial, and renovation projects.',
  image = '/images/og-image.jpg',
  article = false,
}: SEOProps) {
  const router = useRouter();
  const canonicalUrl = `https://appleinteriors.in${router.asPath}`;

  return (
    <Head>
      {/* Performance optimizations */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      
      {/* Preload critical assets */}
      <link rel="preload" as="image" href="/images/New-logo.png" />
      
      {/* Resource hints */}
      <link rel="prerender" href="https://appleinteriors.in/about" />
      <link rel="prerender" href="https://appleinteriors.in/services" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Mobile viewport optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Color scheme */}
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      
      {/* PWA related */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="apple-mobile-web-app-title" content="Apple Interiors" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="SAMEORIGIN" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Cache control */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
    </Head>
  );
} 