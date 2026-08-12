# GitHub Profile README Midnight Console Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `cheondi/cheondi` 프로필을 Midnight Console 테마의 동적 GitHub README로 개편한다.

**Architecture:** `README.md`가 텍스트, 외부 동적 카드와 로컬 SVG를 조합한다. `assets/profile-header.svg`는 외부 장애와 무관한 첫 화면을 담당하고, `.github/workflows/snake.yml`은 라이트·다크 기여도 스네이크를 `output` 브랜치에 생성한다. `scripts/validate-profile.mjs`는 README 구조, 로컬 자산, 워크플로와 필수 고지 문구를 의존성 없이 검사한다.

**Tech Stack:** GitHub Flavored Markdown, GitHub 허용 HTML, SVG/CSS animation, Shields.io, Skill Icons, Readme Typing SVG, GitHub Readme Stats, Streak Stats, Activity Graph, GitHub Actions, Node.js validation script

## Global Constraints

- 시각 테마는 `#0d1117`, `#07111b`, `#0d1b2a` 배경과 `#58a6ff` 주 강조색으로 통일한다.
- Markdown 표는 사용하지 않는다.
- 실제 경험으로 확인되지 않은 경력 연차, 숙련도 비율과 수치를 만들지 않는다.
- 블로그는 보조 링크와 대표 글 모음으로만 사용한다.
- README 마지막에 `이 README는 AI를 활용해서 적어봤습니다.`를 그대로 표시한다.
- 외부 이미지에는 대체 텍스트를 제공한다.
- 로컬 검증과 GitHub 실제 화면 검증을 구분한다.
- 푸시는 별도 사용자 승인이 있을 때만 수행한다.

## File Map

- Create: `assets/profile-header.svg` — Midnight Console 히어로와 절제된 커서 애니메이션
- Modify: `README.md` — 소개, 링크, 기술, 통계, 그래프, 접기 기록과 AI 활용 고지
- Create: `.github/workflows/snake.yml` — 기여도 스네이크 SVG 예약·수동 생성
- Create: `scripts/validate-profile.mjs` — 로컬 구조와 참조 무결성 검사
- Create: `scripts/check-profile-links.mjs` — 외부 이미지 엔드포인트 선택적 네트워크 검사

---

### Task 1: 로컬 히어로와 검증 기반

**Files:**
- Create: `scripts/validate-profile.mjs`
- Create: `assets/profile-header.svg`

**Interfaces:**
- Produces: `assets/profile-header.svg`, `node scripts/validate-profile.mjs`
- Consumes: repository root resolved from `import.meta.url`

- [ ] **Step 1: 히어로가 없으면 실패하는 검사 작성**

Create `scripts/validate-profile.mjs` with the following initial checks:

```js
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
```

- [ ] **Step 2: 검사가 예상대로 실패하는지 확인**

Run: `node scripts/validate-profile.mjs`

Expected: exit code `1` and `missing file: assets/profile-header.svg`

- [ ] **Step 3: Midnight Console SVG 구현**

Create `assets/profile-header.svg` as a 1200×320 SVG with:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="320" viewBox="0 0 1200 320" role="img">
  <title>Cheondi developer profile header</title>
  <desc>Unity에서 시작해 API와 운영 문제까지 추적하는 개발자 Cheondi</desc>
  <defs>
    <linearGradient id="bg" x1="0" x2="1">
      <stop offset="0" stop-color="#07111b"/>
      <stop offset="1" stop-color="#0d1b2a"/>
    </linearGradient>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#58a6ff" stroke-opacity=".07"/>
    </pattern>
  </defs>
  <style>
    .mono { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; }
    .cursor { animation: blink 1s steps(1) infinite; }
    .signal { animation: pulse 2.4s ease-in-out infinite; transform-origin:center; }
    @keyframes blink { 50% { opacity:0; } }
    @keyframes pulse { 50% { opacity:.35; } }
    @media (prefers-reduced-motion: reduce) { .cursor,.signal { animation:none; } }
  </style>
  <rect width="1200" height="320" rx="24" fill="url(#bg)"/>
  <rect width="1200" height="320" rx="24" fill="url(#grid)"/>
  <rect x="1" y="1" width="1198" height="318" rx="23" fill="none" stroke="#30363d"/>
  <circle cx="42" cy="36" r="6" fill="#ff7b72"/><circle cx="64" cy="36" r="6" fill="#d29922"/><circle cx="86" cy="36" r="6" fill="#3fb950"/>
  <text x="600" y="104" text-anchor="middle" class="mono" font-size="17" font-weight="700" letter-spacing="4" fill="#79c0ff">PLAYER / DEVELOPER / PROBLEM SOLVER</text>
  <text x="600" y="178" text-anchor="middle" class="mono" font-size="56" font-weight="800" fill="#f0f6fc">&gt; CHEONDI<tspan class="cursor" fill="#58a6ff">_</tspan></text>
  <text x="600" y="232" text-anchor="middle" font-family="Segoe UI, sans-serif" font-size="20" fill="#8b949e">Unity에서 시작해 API와 운영 문제까지 끝까지 추적하는 개발자</text>
  <g class="signal"><circle cx="560" cy="273" r="4" fill="#3fb950"/><text x="577" y="279" class="mono" font-size="14" fill="#7ee787">SYSTEM ONLINE</text></g>
</svg>
```

- [ ] **Step 4: SVG 검증 통과 확인**

Run: `node scripts/validate-profile.mjs`

Expected: `Profile validation passed.`

Run: PowerShell XML parse:

```powershell
[xml](Get-Content -LiteralPath assets\profile-header.svg -Raw -Encoding utf8) | Out-Null
```

Expected: exit code `0`

- [ ] **Step 5: 히어로와 검사 커밋**

```powershell
git add -- assets/profile-header.svg scripts/validate-profile.mjs
git commit -m "GitHub 프로필 터미널 히어로 추가"
```

---

### Task 2: Midnight Console README

**Files:**
- Modify: `scripts/validate-profile.mjs`
- Modify: `README.md`

**Interfaces:**
- Consumes: `assets/profile-header.svg`, public image endpoints
- Produces: GitHub profile README with no Markdown tables

- [ ] **Step 1: README 계약을 검사에 추가**

Insert the following block immediately before the final `if (errors.length)` block so all README errors are collected before the process exits:

```js
const readmePath = requireFile('README.md');
if (existsSync(readmePath)) {
  const readme = readFileSync(readmePath, 'utf8');
  const required = [
    './assets/profile-header.svg',
    'readme-typing-svg.demolab.com',
    'skillicons.dev',
    'github-readme-stats.vercel.app',
    'streak-stats.demolab.com',
    'github-readme-activity-graph.vercel.app',
    '<details>',
    '이 README는 AI를 활용해서 적어봤습니다.',
  ];
  for (const token of required) {
    if (!readme.includes(token)) errors.push(`README missing token: ${token}`);
  }
  if (/^\s*\|.*\|\s*$/m.test(readme)) errors.push('Markdown table syntax is not allowed');
}
```

- [ ] **Step 2: 기존 README가 실패하는지 확인**

Run: `node scripts/validate-profile.mjs`

Expected: exit code `1` with missing dynamic-service tokens and Markdown table error

- [ ] **Step 3: README를 다음 순서로 교체**

Use centered HTML only for visual assets and normal Markdown for readable content:

```markdown
<div align="center">
  <img src="./assets/profile-header.svg" width="100%" alt="Cheondi 개발자 프로필 헤더" />

  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&duration=3500&pause=900&color=58A6FF&center=true&vCenter=true&width=780&lines=Unity+Client+Development;WebGL+%26+Android+Build;API+Integration+%26+Live+Operations;AI+Harness+%26+Verification+Loop" alt="현재 다루고 있는 개발 영역" />
  </a>
</div>

Unity와 C#으로 클라이언트 개발을 시작해 웹·API 연동과 운영 문제까지 다뤄왔습니다. 문제가 생기면 화면에서 출발해 코드, API, 로그와 배포 환경을 차례로 확인하는 편입니다.

요즘은 AI 도구를 실제 개발 흐름에 붙이고, 결과를 믿기 위해 어떤 검증이 필요한지 정리하고 있습니다.

<div align="center">
  <a href="https://cheondi.github.io/"><img src="https://img.shields.io/badge/TECH%20LOG-0D1117?style=for-the-badge&logo=githubpages&logoColor=58A6FF" alt="Cheondi 기술 기록" /></a>
  <a href="mailto:kwon95799@gmail.com"><img src="https://img.shields.io/badge/EMAIL-0D1117?style=for-the-badge&logo=gmail&logoColor=58A6FF" alt="Cheondi 이메일" /></a>
  <a href="https://github.com/cheondi"><img src="https://img.shields.io/badge/GITHUB-0D1117?style=for-the-badge&logo=github&logoColor=58A6FF" alt="Cheondi GitHub" /></a>
</div>

## `$ focus --now`

> 클라이언트 · 웹/API · 운영 검증 · AI 개발 흐름

- **Unity Client** — JSON 기반 오브젝트 구조, WebGL과 Android 빌드 환경
- **Web & API** — 인증·세션·재시도와 클라이언트/API 경계
- **Live Operations** — 화면, 로그, 배포 파일과 실제 동작을 연결한 원인 추적
- **AI Engineering** — 에이전트 하네스, 작업 루프와 결과 검증

## `$ stack --list`

<div align="center">
  <img src="https://skillicons.dev/icons?i=cs,unity,js,react,git,github,mysql,visualstudio,vscode&theme=dark&perline=9" alt="C#, Unity, JavaScript, React, Git, GitHub, MySQL, Visual Studio, VS Code" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/REST%20API-161B22?style=flat-square&logo=fastapi&logoColor=79C0FF" alt="REST API" />
  <img src="https://img.shields.io/badge/gRPC-161B22?style=flat-square&logo=google&logoColor=79C0FF" alt="gRPC" />
  <img src="https://img.shields.io/badge/WebGL-161B22?style=flat-square&logo=webgl&logoColor=79C0FF" alt="WebGL" />
  <img src="https://img.shields.io/badge/Android-161B22?style=flat-square&logo=android&logoColor=79C0FF" alt="Android" />
  <img src="https://img.shields.io/badge/CI%2FCD-161B22?style=flat-square&logo=githubactions&logoColor=79C0FF" alt="CI/CD" />
</div>

## `$ github --signal`

<div align="center">
  <a href="https://github.com/cheondi">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-stats.vercel.app/api?username=cheondi&amp;show_icons=true&amp;include_all_commits=true&amp;hide_border=true&amp;bg_color=0d1117&amp;title_color=58a6ff&amp;text_color=c9d1d9&amp;icon_color=79c0ff&amp;locale=kr" />
      <source media="(prefers-color-scheme: light)" srcset="https://github-readme-stats.vercel.app/api?username=cheondi&amp;show_icons=true&amp;include_all_commits=true&amp;hide_border=true&amp;bg_color=ffffff&amp;title_color=0969da&amp;text_color=24292f&amp;icon_color=0969da&amp;locale=kr" />
      <img height="175" src="https://github-readme-stats.vercel.app/api?username=cheondi&amp;show_icons=true&amp;include_all_commits=true&amp;hide_border=true&amp;bg_color=0d1117&amp;title_color=58a6ff&amp;text_color=c9d1d9&amp;icon_color=79c0ff&amp;locale=kr" alt="Cheondi GitHub 통계" />
    </picture>
  </a>
  <a href="https://github.com/cheondi?tab=repositories">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-stats.vercel.app/api/top-langs?username=cheondi&amp;layout=compact&amp;langs_count=8&amp;hide_border=true&amp;bg_color=0d1117&amp;title_color=58a6ff&amp;text_color=c9d1d9" />
      <source media="(prefers-color-scheme: light)" srcset="https://github-readme-stats.vercel.app/api/top-langs?username=cheondi&amp;layout=compact&amp;langs_count=8&amp;hide_border=true&amp;bg_color=ffffff&amp;title_color=0969da&amp;text_color=24292f" />
      <img height="175" src="https://github-readme-stats.vercel.app/api/top-langs?username=cheondi&amp;layout=compact&amp;langs_count=8&amp;hide_border=true&amp;bg_color=0d1117&amp;title_color=58a6ff&amp;text_color=c9d1d9" alt="Cheondi 저장소 주요 언어" />
    </picture>
  </a>
</div>

<div align="center">
  <a href="https://github.com/DenverCoder1/github-readme-streak-stats">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://streak-stats.demolab.com?user=cheondi&amp;hide_border=true&amp;background=0D1117&amp;ring=58A6FF&amp;fire=79C0FF&amp;currStreakLabel=58A6FF&amp;sideLabels=C9D1D9&amp;dates=8B949E&amp;stroke=30363D" />
      <source media="(prefers-color-scheme: light)" srcset="https://streak-stats.demolab.com?user=cheondi&amp;hide_border=true&amp;background=FFFFFF&amp;ring=0969DA&amp;fire=0969DA&amp;currStreakLabel=0969DA&amp;sideLabels=24292F&amp;dates=57606A&amp;stroke=D0D7DE" />
      <img src="https://streak-stats.demolab.com?user=cheondi&amp;hide_border=true&amp;background=0D1117&amp;ring=58A6FF&amp;fire=79C0FF&amp;currStreakLabel=58A6FF&amp;sideLabels=C9D1D9&amp;dates=8B949E&amp;stroke=30363D" alt="Cheondi GitHub 연속 활동" />
    </picture>
  </a>
</div>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://github-readme-activity-graph.vercel.app/graph?username=cheondi&amp;bg_color=0d1117&amp;color=c9d1d9&amp;line=58a6ff&amp;point=79c0ff&amp;area=true&amp;hide_border=true" />
  <source media="(prefers-color-scheme: light)" srcset="https://github-readme-activity-graph.vercel.app/graph?username=cheondi&amp;bg_color=ffffff&amp;color=24292f&amp;line=0969da&amp;point=54aeff&amp;area=true&amp;hide_border=true" />
  <img width="100%" src="https://github-readme-activity-graph.vercel.app/graph?username=cheondi&amp;bg_color=0d1117&amp;color=c9d1d9&amp;line=58a6ff&amp;point=79c0ff&amp;area=true&amp;hide_border=true" alt="Cheondi 최근 GitHub 활동 그래프" />
</picture>

## `$ log --featured`

<details>
<summary><strong>경험과 대표 기록 펼쳐보기</strong></summary>

- [충격적인 오브젝트 생성법](https://cheondi.github.io/2023/02/18/shocking-object-creation.html)
- [Unity WebGL·Android 빌드 차이](https://cheondi.github.io/2024/03/23/unity-webgl-android-build.html)
- [API 워크플로와 재시도 경계](https://cheondi.github.io/2026/06/28/api-workflow-retry-boundary.html)
- [코드·테스트·배포를 잇는 검증 기록](https://cheondi.github.io/2026/08/10/evidence-before-ai-answer.html)
- [AI 에이전트 개발의 현실적인 도입 순서](https://cheondi.github.io/2026/08/11/agent-engineering-adoption-order.html)

</details>

<div align="center">
  <sub>이 README는 AI를 활용해서 적어봤습니다.</sub>
</div>
```

The implementation must replace the comments with valid `<picture>` blocks and must not leave instructional comments in the final README.

- [ ] **Step 4: README 계약 통과 확인**

Run: `node scripts/validate-profile.mjs`

Expected: `Profile validation passed.`

- [ ] **Step 5: README 커밋**

```powershell
git add -- README.md scripts/validate-profile.mjs
git commit -m "GitHub 프로필 Midnight Console 구성"
```

---

### Task 3: 기여도 스네이크 자동화

**Files:**
- Modify: `scripts/validate-profile.mjs`
- Create: `.github/workflows/snake.yml`
- Modify: `README.md`

**Interfaces:**
- Produces: `output/github-contribution-grid-snake.svg`, `output/github-contribution-grid-snake-dark.svg`
- Consumes: `${{ github.repository_owner }}`, `${{ secrets.GITHUB_TOKEN }}`

- [ ] **Step 1: 워크플로 계약을 검사에 추가**

```js
const workflowPath = requireFile('.github/workflows/snake.yml');
if (existsSync(workflowPath)) {
  const workflow = readFileSync(workflowPath, 'utf8');
  for (const token of ['schedule:', 'workflow_dispatch:', 'contents: write', 'Platane/snk/svg-only@v3', 'target_branch: output']) {
    if (!workflow.includes(token)) errors.push(`snake workflow missing token: ${token}`);
  }
}
```

Also require `raw.githubusercontent.com/cheondi/cheondi/output/` in `README.md`.

- [ ] **Step 2: 워크플로가 없어 실패하는지 확인**

Run: `node scripts/validate-profile.mjs`

Expected: exit code `1` and `missing file: .github/workflows/snake.yml`

- [ ] **Step 3: 공식 snk v3 예제 기반 워크플로 생성**

Create `.github/workflows/snake.yml`:

```yaml
name: Generate contribution snake

on:
  schedule:
    - cron: "17 0 * * *"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - name: Generate SVG files
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark&color_snake=#58a6ff

      - name: Publish to output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 4: README에 라이트·다크 스네이크 추가**

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/cheondi/cheondi/output/github-contribution-grid-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/cheondi/cheondi/output/github-contribution-grid-snake.svg" />
  <img alt="Cheondi GitHub 기여도 스네이크" src="https://raw.githubusercontent.com/cheondi/cheondi/output/github-contribution-grid-snake.svg" />
</picture>
```

- [ ] **Step 5: 전체 로컬 계약 통과 확인**

Run: `node scripts/validate-profile.mjs`

Expected: `Profile validation passed.`

- [ ] **Step 6: 워크플로 커밋**

```powershell
git add -- README.md scripts/validate-profile.mjs .github/workflows/snake.yml
git commit -m "GitHub 기여도 스네이크 자동화 추가"
```

---

### Task 4: 외부 이미지 엔드포인트 검사

**Files:**
- Create: `scripts/check-profile-links.mjs`

**Interfaces:**
- Consumes: external HTTPS URLs parsed from `README.md`
- Produces: one-line pass/fail result; no files or external state changes

- [ ] **Step 1: 네트워크 검사 스크립트 작성**

Create `scripts/check-profile-links.mjs` with the complete implementation below. It reads `README.md`, extracts unique HTTPS image sources, decodes HTML `&amp;`, skips only the not-yet-generated snake assets, and rejects non-image responses:

```js
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
  process.exit(1);
}
console.log(`External image validation passed: ${urls.length} unique URL(s).`);
```

- [ ] **Step 2: 문법 검사**

Run: `node --check scripts/check-profile-links.mjs`

Expected: exit code `0`

- [ ] **Step 3: 현재 네트워크 응답 검사**

Run: `node scripts/check-profile-links.mjs`

Expected: every non-snake image returns success. If a public stats endpoint is temporarily unavailable, record it as external-service evidence and do not claim live-card verification.

- [ ] **Step 4: 검사 도구 커밋**

```powershell
git add -- scripts/check-profile-links.mjs
git commit -m "GitHub 프로필 외부 링크 검사 추가"
```

---

### Task 5: 최종 검증과 공개 반영 경계

**Files:**
- Verify: `README.md`
- Verify: `assets/profile-header.svg`
- Verify: `.github/workflows/snake.yml`
- Verify: `scripts/validate-profile.mjs`
- Verify: `scripts/check-profile-links.mjs`

**Interfaces:**
- Consumes: all prior task outputs
- Produces: local verification evidence and an explicit push decision point

- [ ] **Step 1: 로컬 구조 검사**

Run:

```powershell
node scripts/validate-profile.mjs
node --check scripts/validate-profile.mjs
node --check scripts/check-profile-links.mjs
[xml](Get-Content -LiteralPath assets\profile-header.svg -Raw -Encoding utf8) | Out-Null
```

Expected: all commands exit `0`

- [ ] **Step 2: 변경 범위 검토**

Run:

```powershell
git status --short --branch
git diff origin/main...HEAD -- README.md assets/profile-header.svg .github/workflows/snake.yml scripts
```

Expected: unrelated files are absent; no secret, token, private URL or unsupported experience claim is present.

- [ ] **Step 3: 푸시 전 사용자 승인 확인**

Do not push from the implementation-only pass. Report local commits and ask for explicit `origin/main` push approval.

- [ ] **Step 4: 승인 후 푸시와 실제 프로필 확인**

Run only after explicit approval:

```powershell
git push origin main
```

Then verify separately:

- `https://github.com/cheondi` renders the new README.
- The header, typing SVG, skill icons, stats, streak and activity graph load.
- The `Generate contribution snake` workflow succeeds.
- The `output` branch contains both SVG files.
- The snake appears after the first workflow run.
- Narrow and dark GitHub views remain readable.

Expected: pushed SHA equals `origin/main`; live screen and workflow evidence are reported separately from local validation.
