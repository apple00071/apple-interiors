import { Metadata } from 'next';
import RedirectToHome from '@/components/RedirectToHome';

export const metadata: Metadata = {
  title: 'Apple Interiors - Luxury Villa Interior Designers in Hyderabad | Premium Home Interiors',
  description: 'Expert Villa Interior Designers in Hyderabad. Apple Interiors creates luxurious, personalized villa interiors. ✓Custom Designs ✓Premium Materials ✓Turnkey Solutions ✓Free Consultation',
  keywords: 'villa interior design hyderabad, luxury villa interiors hyderabad, villa interior designers hyderabad, villa renovation hyderabad, duplex house interior design, luxury home interior design, villa interior packages, villa interior cost hyderabad, modern villa design, premium villa interiors',
};

export default function VillaInteriorDesign() {
  return <RedirectToHome />;
} 