const http = require('http');

http.get('http://localhost:3000/images/portfolio/bedroom/104.webp', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = 0;
  res.on('data', (chunk) => {
    data += chunk.length;
  });
  
  res.on('end', () => {
    console.log(`Received ${data} bytes.`);
  });
}).on('error', (err) => {
  console.error('Error fetching image:', err.message);
});
