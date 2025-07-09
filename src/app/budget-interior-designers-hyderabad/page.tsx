import { Metadata } from 'next';
import RedirectToHome from '@/components/RedirectToHome';

export const metadata: Metadata = {
  title: 'Apple Interiors - Affordable Interior Designers in Hyderabad | Budget Interior Design',
  description: 'Best Budget Interior Designers in Hyderabad. Apple Interiors offers cost-effective home interior solutions. ✓Affordable Packages ✓Quality Materials ✓EMI Options ✓Free Consultation',
  keywords: 'budget interior designers hyderabad, affordable interior design hyderabad, low cost interior designers, cheap interior designers hyderabad, interior design packages hyderabad, small budget interior design, budget home interior design, cost effective interior design, interior design price hyderabad, budget interior designers kukatpally, emi interior design hyderabad, interior design under 5 lakhs',
};

export default function BudgetInteriorDesigners() {
  return <RedirectToHome />;
} 