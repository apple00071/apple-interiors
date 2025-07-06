const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const portfolioData = require('../src/app/data/portfolio.json');

const PRODUCTION_URL = 'https://apple-interiors.vercel.app';
const CATEGORIES = ['living-room', 'dining', 'bedroom', 'kitchen', 'false-ceiling'];

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(`${PRODUCTION_URL}${url}`, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(filepath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', (err) => {
        fs.unlink(filepath);
        reject(err);
      });
    }).on('error', reject);
  });
}

async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Helper function to delay between downloads
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function downloadAllImages() {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Create necessary directories
  await ensureDir(publicDir);
  await ensureDir(path.join(publicDir, 'portfolio'));
  
  // Create all category directories first
  for (const category of CATEGORIES) {
    await ensureDir(path.join(publicDir, 'portfolio', category));
  }
  
  for (const item of portfolioData.items) {
    const categoryDir = path.join(publicDir, 'portfolio', item.category.toLowerCase().replace(/ /g, '-'));
    
    for (const imageUrl of item.images) {
      const filepath = path.join(publicDir, imageUrl);
      try {
        console.log(`Downloading: ${imageUrl}`);
        await downloadImage(imageUrl, filepath);
        console.log(`Successfully downloaded: ${imageUrl}`);
        // Add a small delay between downloads to avoid overwhelming the server
        await delay(100);
      } catch (error) {
        console.error(`Failed to download ${imageUrl}:`, error.message);
      }
    }
  }
}

downloadAllImages().then(() => {
  console.log('Download complete!');
}).catch((error) => {
  console.error('Download failed:', error);
}); 