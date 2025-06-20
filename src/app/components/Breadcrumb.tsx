'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  
  // Generate breadcrumb items
  const breadcrumbItems = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    const label = path.charAt(0).toUpperCase() + path.slice(1);
    const position = index + 1;
    
    return { href, label, position };
  });

  // Add home as first item
  const allItems = [
    { href: '/', label: 'Home', position: 1 },
    ...breadcrumbItems.map(item => ({ ...item, position: item.position + 1 }))
  ];

  // Generate schema markup
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': allItems.map(item => ({
      '@type': 'ListItem',
      'position': item.position,
      'item': {
        '@id': `https://appleinteriors.in${item.href}`,
        'name': item.label
      }
    }))
  };

  if (paths.length === 0) return null;

  return (
    <>
      <nav aria-label="Breadcrumb" className="py-4 px-4 md:px-6">
        <ol className="flex items-center space-x-2 text-sm">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              <Link
                href={item.href}
                className={index === allItems.length - 1 
                  ? 'text-gray-600 cursor-default pointer-events-none'
                  : 'text-primary-500 hover:text-primary-600 transition-colors'}
                aria-current={index === allItems.length - 1 ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </>
  );
} 