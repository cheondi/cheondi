import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const htmlSources = [...readme.matchAll(/\b(?:src|srcset)="(https:\/\/[^\"]+)"/g)].map((match) => match[1]);
const markdownSources = [...readme.matchAll(/!\[[^\]]*\]\((https:\/\/[^\s)]+)\)/g)].map((match) => match[1]);
const urls = [...new Set([...htmlSources, ...markdownSources].map((url) => url.replaceAll('&amp;', '&')))];
const snakePrefix = 'https://raw.githubusercontent.com/cheondi/cheondi/output/';
const failures = [];

for (const url of urls) {
  if (url.startsWith(snakePrefix)) {
    console.log(`SKIP pending workflow ${url}`);
    continue;
  }

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'cheondi-profile-validator' },
    });
    const type = response.headers.get('content-type') ?? '';
    await response.body?.cancel();

    if (!response.ok || !type.includes('image')) {
      failures.push(`${response.status} ${type} ${url}`);
      console.error(`FAIL ${response.status} ${type} ${url}`);
    } else {
      console.log(`PASS ${response.status} ${type} ${url}`);
    }
  } catch (error) {
    failures.push(`${error.message} ${url}`);
    console.error(`FAIL ${error.message} ${url}`);
  }
}

if (failures.length) {
  console.error(`External image validation failed: ${failures.length} URL(s).`);
  process.exit(1);
}

console.log(`External image validation passed: ${urls.length} unique URL(s).`);
