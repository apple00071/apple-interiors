const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOST = 'https://appleinteriors.in';
const ROOT_DIR = __dirname;
const IGNORED_FILES = ['404.html'];
const IGNORED_DIRS = ['node_modules', '.git'];

// Recursively find all html files
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (!IGNORED_DIRS.includes(file)) {
                findHtmlFiles(filePath, fileList);
            }
        } else if (file.endsWith('.html')) {
            if (!IGNORED_FILES.includes(file)) {
                fileList.push(filePath);
            }
        }
    }
    return fileList;
}

// Get the last modification date formatted as YYYY-MM-DD from git
function getFileLastmod(filePath) {
    try {
        const relativePath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
        const command = `git log -1 --format=%cs -- "${relativePath}"`;
        const stdout = execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
        if (stdout && /^\d{4}-\d{2}-\d{2}$/.test(stdout)) {
            return stdout;
        }
    } catch (e) {
        // Fallback to fs.stat
    }
    const stat = fs.statSync(filePath);
    return stat.mtime.toISOString().slice(0, 10);
}

// Get sitemap configurations (changefreq, priority) based on URL path
function getUrlConfig(urlPath) {
    if (urlPath === '/' || urlPath === '') {
        return { changefreq: 'weekly', priority: '1.0' };
    }
    if (urlPath === '/blog') {
        return { changefreq: 'weekly', priority: '0.7' };
    }
    if (urlPath.startsWith('/blog/')) {
        return { changefreq: 'monthly', priority: '0.6' };
    }
    if (urlPath.startsWith('/interior-designers-in-')) {
        return { changefreq: 'monthly', priority: '0.9' };
    }
    // All other service pages, portfolio, about, contact, case studies
    return { changefreq: 'monthly', priority: '0.8' };
}

function main() {
    console.log('🔍 Scanning HTML files...');
    const htmlFiles = findHtmlFiles(ROOT_DIR);
    const urls = [];

    for (const file of htmlFiles) {
        const relativePath = path.relative(ROOT_DIR, file).replace(/\\/g, '/');
        
        let urlPath = '';
        if (relativePath === 'index.html') {
            urlPath = '/';
        } else if (relativePath.endsWith('index.html')) {
            // e.g. blog/index.html -> /blog
            urlPath = '/' + relativePath.slice(0, -11);
        } else {
            // e.g. about.html -> /about, blog/post.html -> /blog/post
            urlPath = '/' + relativePath.slice(0, -5);
        }

        const lastmod = getFileLastmod(file);
        const { changefreq, priority } = getUrlConfig(urlPath);
        
        urls.push({
            loc: HOST + (urlPath === '/' ? '/' : urlPath),
            lastmod,
            changefreq,
            priority
        });
    }

    // Sort URLs: '/' first, then by priority desc, then alphabetically by loc
    urls.sort((a, b) => {
        if (a.loc === HOST + '/') return -1;
        if (b.loc === HOST + '/') return 1;
        
        const priorityA = parseFloat(a.priority);
        const priorityB = parseFloat(b.priority);
        if (priorityA !== priorityB) {
            return priorityB - priorityA;
        }
        return a.loc.localeCompare(b.loc);
    });

    console.log(`📄 Found ${urls.length} URLs. Generating sitemap.xml...`);

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    for (const url of urls) {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${url.loc}</loc>\n`;
        sitemap += `    <lastmod>${url.lastmod}</lastmod>\n`;
        sitemap += `    <changefreq>${url.changefreq}</changefreq>\n`;
        sitemap += `    <priority>${url.priority}</priority>\n`;
        sitemap += '  </url>\n';
    }
    
    sitemap += '</urlset>\n';

    fs.writeFileSync(path.join(ROOT_DIR, 'sitemap.xml'), sitemap, 'utf8');
    console.log('✅ sitemap.xml generated successfully!');
}

main();
