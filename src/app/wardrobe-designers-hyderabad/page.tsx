import { Metadata } from 'next';
import RedirectToHome from '@/components/RedirectToHome';

export const metadata: Metadata = {
  title: 'Apple Interiors - Best Wardrobe Designers in Hyderabad | Custom Wardrobe Solutions',
  description: 'Expert Wardrobe Designers in Hyderabad. Apple Interiors creates custom-built wardrobes & walk-in closets. ✓Modern Designs ✓Space-Saving Solutions ✓Quality Hardware ✓10 Year Warranty',
  keywords: 'wardrobe designers hyderabad, custom wardrobe design hyderabad, built in wardrobe hyderabad, sliding wardrobe designers, modular wardrobe hyderabad, walk in closet design, bedroom wardrobe design, wardrobe manufacturers hyderabad, wardrobe price hyderabad, modern wardrobe designs, wardrobe interior designers, wardrobe solutions hyderabad',
};

export default function WardrobeDesigners() {
  return <RedirectToHome />;
} 