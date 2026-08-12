import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const requireFile = (relativePath) => {
  const path = join(root, relativePath);
  if (!existsSync(path)) errors.push(`missing file: ${relativePath}`);
  return path;
};

const headerPath = requireFile('assets/profile-header.svg');
if (existsSync(headerPath)) {
  const svg = readFileSync(headerPath, 'utf8');
  for (const token of ['<svg', '<title>', '<desc>', 'prefers-reduced-motion', 'CHEONDI']) {
    if (!svg.includes(token)) errors.push(`header missing token: ${token}`);
  }
  if (!svg.trimEnd().endsWith('</svg>')) errors.push('header is not closed');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Profile validation passed.');
