const fs = require('fs');
const path = require('path');

const rootDir = '.';
const extensions = ['.html', '.js'];
const ignoreDirs = ['.git', 'node_modules'];

let changedCount = 0;

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (ignoreDirs.includes(f)) continue;
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      processDir(full);
    } else if (extensions.some(ext => f.endsWith(ext))) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('wa.me/919160577899') || content.includes('wa.me/919160577899')) {
        content = content.replace(/wa\.me\/919603960337/g, 'wa.me/919160577899');
        content = content.replace(/wa\.me\/9603960337/g, 'wa.me/919160577899');
        fs.writeFileSync(full, content, 'utf8');
        console.log('Updated WhatsApp link in:', full);
        changedCount++;
      }
    }
  }
}

processDir(rootDir);
console.log(`✅ Successfully updated WhatsApp links in ${changedCount} files to 919160577899!`);
