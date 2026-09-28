/**
 * Sri Muthukumaran Medical College & Research Institute
 * Zero-Dependency HTTP Development Server
 * Serves static web assets and provides localhost URL
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

let PORT = parseInt(process.env.PORT, 10) || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp'
};

function startServer(port) {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    // Security check to avoid directory traversal
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(ROOT_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404 Not Found</h1><p>The requested file ${pathname} was not found.</p><a href="/">Go to Home</a>`);
        return;
      }

      if (stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end(`500 Internal Server Error: ${readErr.message}`);
          return;
        }

        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      });
    });
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  server.listen(port, () => {
    console.log('\n======================================================================');
    console.log('  🏛️  SRI MUTHUKUMARAN MEDICAL COLLEGE & RESEARCH INSTITUTE');
    console.log('  Hospital & College Management Portal Server is Live');
    console.log('======================================================================');
    console.log(`\n  👉 Public Website:    http://localhost:${port}`);
    console.log(`  👉 Management Portal: http://localhost:${port}/portal.html`);
    console.log(`\n  Role Quick-Links:`);
    console.log(`  • Admin:   http://localhost:${port}/portal.html?role=admin`);
    console.log(`  • Teacher: http://localhost:${port}/portal.html?role=teacher`);
    console.log(`  • Student: http://localhost:${port}/portal.html?role=student`);
    console.log(`  • Parent:  http://localhost:${port}/portal.html?role=parent`);
    console.log('======================================================================\n');
  });
}

startServer(PORT);
