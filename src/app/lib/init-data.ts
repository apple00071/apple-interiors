import { addCategory, addPortfolioItem } from './db';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

const categories = [
  'Living Room',
  'Dining',
  'Bedroom',
  'Kitchen',
  'False Ceiling'
];

const portfolioItems = [
  {
    image_paths: [
      '/images/portfolio/living-room/1.webp',
      '/images/portfolio/living-room/4.webp',
      '/images/portfolio/living-room/7.webp',
      '/images/portfolio/living-room/12.webp',
      '/images/portfolio/living-room/13.webp'
    ],
    category: 'Living Room'
  },
  {
    image_paths: [
      '/images/portfolio/dining/1 (2).webp',
      '/images/portfolio/dining/2.webp',
      '/images/portfolio/dining/9.webp',
      '/images/portfolio/dining/10.webp',
      '/images/portfolio/dining/26.webp',
      '/images/portfolio/dining/N2.webp'
    ],
    category: 'Dining'
  },
  {
    image_paths: [
      '/images/portfolio/bedroom/3.webp',
      '/images/portfolio/bedroom/99.webp',
      '/images/portfolio/bedroom/104.webp',
      '/images/portfolio/bedroom/J7.webp',
      '/images/portfolio/bedroom/J8.webp',
      '/images/portfolio/bedroom/N3.webp'
    ],
    category: 'Bedroom'
  },
  {
    image_paths: [
      '/images/portfolio/kitchen/J1.webp',
      '/images/portfolio/kitchen/J2.webp',
      '/images/portfolio/kitchen/J3.webp',
      '/images/portfolio/kitchen/J4.webp',
      '/images/portfolio/kitchen/J8.webp',
      '/images/portfolio/kitchen/J9.webp'
    ],
    category: 'Kitchen'
  },
  {
    image_paths: [
      '/images/portfolio/false-ceiling/2.webp',
      '/images/portfolio/false-ceiling/40.webp',
      '/images/portfolio/false-ceiling/73.webp',
      '/images/portfolio/false-ceiling/96.webp',
      '/images/portfolio/false-ceiling/141.webp',
      '/images/portfolio/false-ceiling/142.webp'
    ],
    category: 'False Ceiling'
  }
];

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const checkResult = await sql`
      SELECT * FROM admin_users WHERE username = ${`applegraphicshyd@gmail.com`}
    `;

    if (checkResult.length > 0) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await sql`
      INSERT INTO admin_users (username, password_hash)
      VALUES (${`applegraphicshyd@gmail.com`}, ${hashedPassword})
    `;

    console.log('Admin user created successfully');
  } catch (error) {
    console.error('Failed to create admin user:', error);
    throw error;
  }
}

export async function initializeData() {
  try {
    // Create admin user first
    await createAdminUser();

    // Add categories
    for (const categoryName of categories) {
      await addCategory({ name: categoryName });
      console.log(`Added category: ${categoryName}`);
    }

    // Add portfolio items
    for (const item of portfolioItems) {
      await addPortfolioItem(item);
      console.log(`Added portfolio item for category: ${item.category}`);
    }

    console.log('Data initialization completed successfully');
  } catch (error) {
    console.error('Failed to initialize data:', error);
    throw error;
  }
} 