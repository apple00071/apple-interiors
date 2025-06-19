"use client";

import { useState, useEffect } from "react";
import Contact from "../components/Contact";
import WhatsAppWidget from "../components/WhatsAppWidget";

// Metadata needs to be in a separate layout.tsx or loading.tsx file in Next.js 13+
export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <>
      <main className="pt-20">
        <Contact />
        {isMounted && <WhatsAppWidget />}
      </main>
    </>
  );
} 