import NextImage from 'next/image';
import { useState } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
}

export function Image({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  quality = 85,
  fill = false,
  loading,
  ...props
}: ImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className={`overflow-hidden ${fill ? 'relative' : ''} ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        sizes={sizes}
        quality={quality}
        priority={priority}
        fill={fill}
        loading={loading}
        onLoadingComplete={() => setLoading(false)}
        {...props}
      />
    </div>
  );
} 