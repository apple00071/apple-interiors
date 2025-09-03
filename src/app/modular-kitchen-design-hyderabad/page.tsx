import { Metadata } from 'next';
import ServicePageTemplate, { generateServiceMetadata } from '../utils/service-page-template';

const serviceData = {
  title: 'Apple Interiors - Best Modular Kitchen Designers in Hyderabad | Custom Kitchen Solutions',
  description: 'Expert Modular Kitchen Design Solutions in Hyderabad by Apple Interiors. ✓Custom Designs ✓Quality Materials ✓Space Optimization ✓10 Year Warranty. Get your dream kitchen today!',
  keywords: 'modular kitchen hyderabad, modular kitchen designers hyderabad, kitchen interior designers hyderabad, kitchen cabinets hyderabad, kitchen renovation hyderabad, modern kitchen design hyderabad, kitchen manufacturers hyderabad, kitchen remodeling hyderabad, best modular kitchen hyderabad, affordable modular kitchen',
  path: 'modular-kitchen-design-hyderabad',
  heading: 'Modular Kitchen Design Services in Hyderabad',
  introText: 'Transform your kitchen into a modern, functional space with our custom modular kitchen solutions. We combine aesthetics with efficiency to create kitchens that make cooking a joy and storage a breeze.',
  servicesList: [
    'Custom Kitchen Layout Design',
    'High-Quality Cabinet Materials',
    'Premium Hardware & Accessories',
    'Efficient Storage Solutions',
    'Designer Countertops',
    'Modern Kitchen Appliances Integration',
    'Specialized Storage Units',
    'Task Lighting Solutions',
    'Ventilation Systems',
    'Anti-bacterial Countertops'
  ],
  faqList: [
    {
      question: 'What is the cost of a modular kitchen in Hyderabad?',
      answer: 'The cost of a modular kitchen in Hyderabad typically ranges from ₹2 lakhs to ₹8 lakhs, depending on the size, materials, and accessories chosen. We offer various packages to suit different budgets while maintaining quality.'
    },
    {
      question: 'How long does it take to install a modular kitchen?',
      answer: 'A complete modular kitchen installation usually takes 15-20 days from design approval to completion. This includes manufacturing, delivery, and installation.'
    },
    {
      question: 'What materials do you use for modular kitchens?',
      answer: 'We use high-quality materials like BWP plywood, MDF, particle board with laminate/acrylic/PU finish, and premium hardware from brands like Hettich and Hafele. All materials are moisture-resistant and durable.'
    },
    {
      question: 'Do you provide warranty for modular kitchens?',
      answer: 'Yes, we provide a 10-year warranty on the modular kitchen structure and a 5-year warranty on hardware. This covers manufacturing defects and normal wear and tear.'
    },
    {
      question: 'Can you modify my existing kitchen into a modular kitchen?',
      answer: 'Yes, we can renovate your existing kitchen into a modular kitchen. Our team will assess the space, suggest optimal layouts, and handle the complete transformation process.'
    }
  ],
  minPrice: 200000
};

export const metadata: Metadata = generateServiceMetadata(serviceData);

export default function ModularKitchenDesign() {
  return <ServicePageTemplate {...serviceData} />;
} 