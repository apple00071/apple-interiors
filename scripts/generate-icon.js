const sharp = require('sharp');
const fs = require('fs').promises;

async function generateIcon() {
  try {
    // Read the source icon
    const iconBuffer = await fs.readFile('icon.png');
    
    // Save it directly to public directory
    await fs.writeFile('public/icon.png', iconBuffer);
    
    // Also generate a larger version for PWA
    await sharp(iconBuffer)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile('public/icon-192.png');

    console.log('Icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcon(); 