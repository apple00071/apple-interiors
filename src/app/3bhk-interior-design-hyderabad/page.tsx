import { Metadata } from 'next';
import ServicePageTemplate, { generateServiceMetadata } from '../utils/service-page-template';

const serviceData = {
  title: 'Apple Interiors - Best 3BHK Interior Designers in Hyderabad | Luxury Home Interiors',
  description: 'Premium 3BHK Interior Design Solutions in Hyderabad by Apple Interiors. ✓Modular Kitchen ✓Designer Wardrobes ✓False Ceiling ✓Living Room ✓Custom Furniture. Transform your 3BHK into a luxury home!',
  keywords: '3bhk interior design hyderabad, 3bhk house interior design, luxury apartment interior designers hyderabad, 3bhk flat interior design, 3bhk interior packages hyderabad, 3bhk interior cost hyderabad, modern apartment interior design, premium interior design 3bhk, modern 3bhk design, complete home interior 3bhk',
  path: '3bhk-interior-design-hyderabad',
  heading: '3BHK Interior Design Services in Hyderabad',
  introText: 'Transform your 3BHK apartment into a luxurious living space with Apple Interiors. We specialize in creating sophisticated and functional interiors that maximize space utilization and reflect your lifestyle aspirations.',
  servicesList: [
    'Modern Modular Kitchen with Island',
    'Designer Bedroom Wardrobes',
    'Contemporary False Ceiling Design',
    'Premium TV Unit & Entertainment Area',
    'Custom Living Room Design',
    'Space-optimized Storage Solutions',
    'High-end Bathroom Designs',
    'Premium Materials & Finishes',
    'Complete Electrical & Plumbing Work',
    'Designer Wall Treatments & Painting'
  ],
  faqList: [
    {
      question: 'How much does a 3BHK interior design cost in Hyderabad?',
      answer: 'The cost of 3BHK interior design in Hyderabad typically ranges from ₹8 lakhs to ₹20 lakhs, depending on the materials, designs, and customizations chosen. We offer flexible packages to suit different budgets while maintaining quality.'
    },
    {
      question: 'How long does it take to complete a 3BHK interior project?',
      answer: 'A complete 3BHK interior project usually takes 45-60 days from design approval to completion. This timeline includes all aspects from modular kitchen to wardrobes and false ceiling installation.'
    },
    {
      question: 'Do you provide warranty for your interior work?',
      answer: 'Yes, we provide warranties ranging from 1-10 years depending on the product and material. Our modular kitchen and wardrobes come with a 10-year warranty against manufacturing defects.'
    },
    {
      question: 'Can you help with material selection?',
      answer: 'Absolutely! Our expert designers will guide you through material selection, considering factors like durability, aesthetics, and budget. We work with trusted brands and provide samples for your approval.'
    },
    {
      question: 'Do you handle complete 3BHK renovation projects?',
      answer: 'Yes, we handle end-to-end 3BHK renovation projects including design, demolition, civil work, electrical, plumbing, carpentry, painting, and final finishing. You get a single point of contact for the entire project.'
    }
  ],
  minPrice: 800000
};

export const metadata: Metadata = generateServiceMetadata(serviceData);

export default function ThreeBHKInteriorDesign() {
  return <ServicePageTemplate {...serviceData} />;
} 