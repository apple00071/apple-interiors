const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateFavicon() {
  try {
    // Create the ICO file
    await sharp('public/images/New-logo.png')
      .resize(32, 32)
      .toFile('public/favicon.ico');

    console.log('Favicon generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 