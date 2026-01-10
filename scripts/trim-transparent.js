#!/usr/bin/env node
const { execFileSync } = require('node:child_process');

const input = process.argv[2];
if (!input) {
  console.error('Usage: node scripts/trim-transparent.js <image.png>');
  process.exit(1);
}

try {
  // Trim only fully transparent borders and overwrite the file.
  execFileSync('magick', [input, '-trim', '+repage', input], {
    stdio: 'inherit',
  });
} catch (err) {
  const message = err && err.message ? err.message : String(err);
  console.error('Trim failed. Ensure ImageMagick is installed and "magick" is on PATH.');
  console.error(message);
  process.exit(1);
}
