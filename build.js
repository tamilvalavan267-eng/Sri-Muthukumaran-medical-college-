/**
 * Cross-Platform Build Script for Sri Muthukumaran Medical College
 * Ensures build output is ready whether Vercel expects root, 'dist', or 'public'
 */

const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  if (!exists) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItem) => {
      copyRecursiveSync(path.join(src, childItem), path.join(dest, childItem));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Building Sri Muthukumaran Medical College deployment assets...');

// Target directories that Vercel might look for
const targetDirs = ['dist', 'public'];

targetDirs.forEach((dir) => {
  const targetPath = path.join(__dirname, dir);
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  // Copy HTML entry points
  fs.copyFileSync(path.join(__dirname, 'index.html'), path.join(targetPath, 'index.html'));
  fs.copyFileSync(path.join(__dirname, 'portal.html'), path.join(targetPath, 'portal.html'));

  // Copy asset folders
  ['css', 'js', 'assets'].forEach((folder) => {
    const srcFolder = path.join(__dirname, folder);
    const destFolder = path.join(targetPath, folder);
    if (fs.existsSync(srcFolder)) {
      copyRecursiveSync(srcFolder, destFolder);
    }
  });

  console.log(`✓ Successfully populated '${dir}/' directory`);
});

console.log('✓ Build completed successfully.');
