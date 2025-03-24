import mysql from 'mysql2/promise';

export async function createConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  location: string;
  area: string;
  year: string;
  images: string;
}

export async function getPortfolioData() {
  const connection = await createConnection();
  
  try {
    // Get all categories
    const [categoriesResult] = await connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM portfolio_categories ORDER BY name'
    );
    const categories = categoriesResult as Category[];

    // Get all projects with their images
    const [projectsResult] = await connection.execute<mysql.RowDataPacket[]>(`
      SELECT 
        p.*,
        c.name as category,
        GROUP_CONCAT(i.image_url ORDER BY i.image_order) as images
      FROM portfolio_projects p
      JOIN portfolio_categories c ON p.category_id = c.id
      LEFT JOIN portfolio_images i ON p.id = i.project_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    const projects = projectsResult as Project[];

    // Format the projects data
    const formattedProjects = projects.map((project) => ({
      id: project.id,
      title: project.title,
      category: project.category,
      description: project.description,
      location: project.location,
      area: project.area,
      year: project.year,
      images: project.images ? project.images.split(',') : []
    }));

    return {
      categories: categories.map(cat => cat.name),
      projects: formattedProjects
    };
  } finally {
    await connection.end();
  }
} 