"use client";

import Contact from "../components/Contact";

// Metadata needs to be in a separate layout.tsx or loading.tsx file in Next.js 13+
export default function ContactPage() {
  return (
    <>
      <main className="pt-20">
        <Contact />
      </main>
    </>
  );
} 