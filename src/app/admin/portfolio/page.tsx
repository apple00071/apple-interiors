import { getPortfolioItems, getCategories } from '@/app/lib/db';
import PortfolioAdmin from '@/app/components/admin/PortfolioAdmin';

export default async function AdminPortfolioPage() {
  const items = await getPortfolioItems();
  const categories = await getCategories();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Portfolio Management</h1>
      <PortfolioAdmin initialItems={items} categories={categories} />
    </div>
  );
} 