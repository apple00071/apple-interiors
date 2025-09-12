const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  // Get the URL path
  let url = req.url;
  
  // Remove query parameters if any
  if (url.includes('?')) {
    url = url.split('?')[0];
  }
  
  // Handle root path
  if (url === '/') {
    url = '/index.html';
  } 
  // Handle clean URLs for main pages
  else if (url === '/about' || url === '/services' || url === '/portfolio' || url === '/contact') {
    url = `${url}.html`;
  }
  // Handle static files
  else if (!url.includes('.')) {
    // Check if this is a file with .html extension
    const htmlPath = path.join(__dirname, `${url}.html`);
    if (fs.existsSync(htmlPath)) {
      url = `${url}.html`;
    }
  }

  // Determine the file path
  const filePath = path.join(__dirname, url);
  
  // Get the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Define content types for different file extensions
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  };

  // Set the content type
  const contentType = contentTypes[extname] || 'application/octet-stream';

  // Read the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          if (err) {
            // If 404.html doesn't exist, send a simple 404 message
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<html><body><h1>404 Not Found</h1><p>The page you requested could not be found.</p></body></html>');
          } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});