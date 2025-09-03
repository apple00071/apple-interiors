'use client';

import { useEffect, useRef } from 'react';

export default function Map() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (iframeRef.current) {
        iframeRef.current.src = 'about:blank';
      }
    };
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.0955913802345!2d78.39300109999999!3d17.502949700000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91a9716fd36b%3A0x6ee65938c7b9a1dc!2sApple%20Interiors-%20Hyderabad!5e0!3m2!1sen!2sin!4v1742824428980!5m2!1sen!2sin"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-lg"
    />
  );
} 