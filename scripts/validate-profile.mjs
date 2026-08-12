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

const readmePath = requireFile('README.md');
if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, 'utf8');
  const required = [
    './assets/profile-header.svg',
    'readme-typing-svg.demolab.com',
    'skillicons.dev',
    'output/github-stats-dark.svg',
    'output/top-langs-dark.svg',
    'output/streak-dark.svg',
    'github-readme-activity-graph.vercel.app',
    'raw.githubusercontent.com/cheondi/cheondi/output/',
    '<details>',
    '이 README는 AI를 활용해서 적어봤습니다.',
  ];
  for (const token of required) {
    if (!readme.includes(token)) errors.push(`README missing token: ${token}`);
  }
  if (readme.includes('github-readme-stats.vercel.app')) errors.push('README must not depend on the best-effort public stats endpoint');
  if (readme.includes('streak-stats.demolab.com')) errors.push('README must not depend on the overloaded public streak endpoint');
  if (/^\s*\|.*\|\s*$/m.test(readme)) errors.push('Markdown table syntax is not allowed');
}

const workflowPath = requireFile('.github/workflows/snake.yml');
if (existsSync(workflowPath)) {
  const workflow = readFileSync(workflowPath, 'utf8');
  for (const token of ['schedule:', 'workflow_dispatch:', 'contents: write', 'Platane/snk/svg-only@v3', 'stats-organization/github-readme-stats-action@v2', 'DenverCoder1/github-readme-streak-stats@v1.7.0', 'target_branch: output']) {
    if (!workflow.includes(token)) errors.push(`snake workflow missing token: ${token}`);
  }
}

const linkCheckerPath = requireFile('scripts/check-profile-links.mjs');
if (existsSync(linkCheckerPath)) {
  const linkChecker = readFileSync(linkCheckerPath, 'utf8');
  for (const token of ['AbortSignal.timeout(15_000)', "replaceAll('&amp;', '&')", 'response.headers.get', 'image']) {
    if (!linkChecker.includes(token)) errors.push(`link checker missing token: ${token}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Profile validation passed.');
