import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

interface Category {
  name: string;
}

interface PortfolioItem {
  category: string;
  image_count: number;
}

async function verifyData() {
  try {
    const sql = neon(process.env.DATABASE_URL!);

    // Check categories
    const categoriesResult = await sql`
      SELECT name FROM categories ORDER BY name;
    `;
    console.log(`Found ${categoriesResult.length} categories:`);
    (categoriesResult as Category[]).forEach(category => {
      console.log(`- ${category.name}`);
    });

    // Check portfolio items
    const portfolioItemsResult = await sql`
      SELECT category, array_length(image_paths, 1) as image_count
      FROM portfolio_items
      ORDER BY category;
    `;
    console.log(`\nFound ${portfolioItemsResult.length} portfolio items:`);
    (portfolioItemsResult as PortfolioItem[]).forEach(item => {
      console.log(`- Category: ${item.category}, Images: ${item.image_count}`);
    });

  } catch (error) {
    console.error('Failed to verify data:', error);
    process.exit(1);
  }
  process.exit(0);
}

verifyData(); 