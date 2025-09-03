"use client";

import { useState, useEffect } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Portfolio from "../components/Portfolio";
import { getPortfolioItems, getCategories } from '../lib/db';

export default function PortfolioPage() {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<{ items: any[]; categories: any[] }>({ items: [], categories: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        const [items, categories] = await Promise.all([
          getPortfolioItems(),
          getCategories()
        ]);
        setData({ items, categories });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading portfolio...</div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation} strict>
      <main className="pt-20">
        <Portfolio items={data.items} categories={data.categories} />
      </main>
    </LazyMotion>
  );
} 