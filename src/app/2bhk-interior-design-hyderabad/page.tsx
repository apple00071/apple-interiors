import { Metadata } from 'next';
import RedirectToHome from '@/components/RedirectToHome';

export const metadata: Metadata = {
  title: 'Apple Interiors - Best 2BHK Interior Designers in Hyderabad | Complete Home Interiors',
  description: 'Complete 2BHK Interior Design Solutions in Hyderabad by Apple Interiors. ✓Modular Kitchen ✓Wardrobes ✓False Ceiling ✓TV Unit ✓Storage Solutions ✓Free Quote. Transform your 2BHK into a dream home!',
  keywords: '2bhk interior design hyderabad, 2bhk house interior design, apartment interior designers hyderabad, 2bhk flat interior design, 2bhk interior packages hyderabad, 2bhk interior cost hyderabad, small apartment interior design, budget interior design 2bhk, modern 2bhk design, complete home interior 2bhk',
};

export default function TwoBHKInteriorDesign() {
  return <RedirectToHome />;
} 