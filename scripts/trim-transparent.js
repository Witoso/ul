#!/usr/bin/env node
const { execFileSync } = require('node:child_process');

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const targets = args.length > 0
  ? args
  : fs.readdirSync(path.join('public', 'assets'))
      .filter((name) => name.toLowerCase().endsWith('.png'))
      .map((name) => path.join('public', 'assets', name));

if (targets.length === 0) {
  console.error('No PNG files found in public/assets.');
  process.exit(1);
}

try {
  // Trim only fully transparent borders and overwrite the file(s).
  execFileSync('magick', ['mogrify', '-trim', '+repage', ...targets], {
    stdio: 'inherit',
  });
} catch (err) {
  const message = err && err.message ? err.message : String(err);
  console.error('Trim failed. Ensure ImageMagick is installed and "magick" is on PATH.');
  console.error(message);
  process.exit(1);
}
