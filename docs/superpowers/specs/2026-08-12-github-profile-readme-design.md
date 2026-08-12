# GitHub 프로필 README Midnight Console 설계

## 목표

`cheondi/cheondi` 프로필 README를 GitHub 다크 테마에 어울리는 화려한 개발자 프로필로 개편한다. Markdown과 GitHub가 허용하는 HTML을 적극적으로 사용하되, 여러 위젯을 단순히 나열하지 않고 남색 터미널이라는 하나의 시각 언어로 통일한다.

프로필의 중심 메시지는 Unity와 C#으로 시작해 웹·API 연동, 운영 문제 해결, AI 개발 흐름까지 확장해 온 개발자라는 점이다. 블로그는 전체 프로필의 주제가 아니라 경험을 더 읽을 수 있는 연결 지점으로 둔다.

## 확정된 방향

- 시안: `A. Midnight Console`
- 배경 계열: `#0d1117`, `#07111b`, `#0d1b2a`
- 주 강조색: GitHub 계열 파랑 `#58a6ff`
- 보조색: 청록과 연한 회색만 제한적으로 사용
- 표 사용 금지
- 무지개색 배지와 서로 다른 테마의 카드 혼용 금지
- README 맨 아래에 `이 README는 AI를 활용해서 적어봤습니다.` 문구 표시

## 화면 구성

### 1. 터미널형 히어로

저장소 내부의 `assets/profile-header.svg`를 사용한다. 배너에는 `CHEONDI_` 프롬프트, `PLAYER / DEVELOPER / PROBLEM SOLVER`, Unity에서 시작해 운영 문제까지 추적한다는 짧은 문장을 넣는다. SVG 안의 커서와 작은 상태 표시만 절제된 애니메이션으로 움직인다.

배너 아래에는 외부 타이핑 SVG를 사용해 다음 관심 영역이 순환하도록 한다.

- Unity Client Development
- WebGL & Android Build
- API Integration & Live Operations
- AI Harness & Verification Loop

### 2. 짧은 소개와 연결

한국어 소개는 두 문장으로 제한한다. 화면, 코드, API, 로그와 배포 환경을 연결해 원인을 찾는 개발 방식과 최근 AI 도구를 실제 개발 흐름에 적용하고 있다는 내용을 담는다.

바로 아래에는 Shields.io 배지로 다음 링크를 제공한다.

- 기술 기록: `https://cheondi.github.io/`
- 이메일: `mailto:kwon95799@gmail.com`
- GitHub: `https://github.com/cheondi`

### 3. 현재 집중 영역

터미널 명령처럼 보이는 인용문을 사용한다.

```text
$ focus --now
클라이언트 · 웹/API · 운영 검증 · AI 개발 흐름
```

세부 경험은 표 대신 짧은 목록으로 표현한다.

- Unity 클라이언트, JSON 기반 오브젝트 구조, WebGL·Android 빌드
- 인증·세션·재시도 등 웹과 API 경계의 문제
- 로그, 배포 파일과 실제 화면을 연결한 운영 검증
- AI 에이전트 하네스, 작업 루프와 결과 검증

### 4. 기술 스택

`skillicons.dev` 아이콘을 중심으로 C#, Unity, JavaScript, React, Git, GitHub, MySQL과 Visual Studio 계열을 표시한다. 아이콘으로 표현하기 어려운 REST API, gRPC, WebGL, Android, CI/CD는 동일 색상의 Shields.io 배지로 보완한다.

기술은 숙련도 순위처럼 보이지 않도록 `주로 사용`, `함께 사용`, `빌드와 운영`, `최근 관심`의 네 묶음으로 설명한다.

### 5. GitHub 신호

아래 외부 카드를 같은 색상 파라미터로 맞춘다.

- `github-readme-stats`: 전체 통계
- `github-readme-stats`: 주요 언어
- `github-readme-streak-stats`: 연속 활동
- `github-readme-activity-graph`: 활동 그래프

`<picture>`와 `prefers-color-scheme` 소스를 사용해 GitHub 라이트·다크 테마에서 모두 읽히게 한다. 카드 너비는 고정 픽셀만 사용하지 않고 GitHub 모바일 화면에서도 한 줄씩 자연스럽게 내려오도록 구성한다.

### 6. 기여도 스네이크

`.github/workflows/snake.yml`을 추가한다. GitHub Actions가 `output` 브랜치에 라이트·다크 기여도 스네이크 SVG를 생성하며, README에서는 `<picture>`로 현재 테마에 맞는 파일을 선택한다.

워크플로는 다음 경우에만 실행한다.

- 매일 한 번 예약 실행
- 사용자가 직접 실행하는 `workflow_dispatch`

쓰기 권한은 `contents: write`만 부여한다.

### 7. 접을 수 있는 상세 기록

긴 설명은 `<details>`에 넣어 첫 화면의 밀도를 조절한다. 펼치면 다음 대표 기록을 볼 수 있다.

- 충격적인 오브젝트 생성법
- Unity WebGL·Android 빌드 차이
- API 워크플로와 재시도 경계
- 코드·테스트·배포를 잇는 검증 기록
- AI 에이전트 개발의 현실적인 도입 순서

### 8. AI 활용 고지

프로필 마지막 중앙에 작은 글씨로 다음 문장을 그대로 표시한다.

> 이 README는 AI를 활용해서 적어봤습니다.

## 외부 의존성과 실패 대응

- 외부 통계 서비스가 일시적으로 실패해도 소개, 기술 경험과 링크는 일반 Markdown 텍스트로 남는다.
- 모든 이미지에 의미 있는 대체 텍스트를 지정한다.
- 프로필의 첫인상을 담당하는 히어로는 저장소 내부 SVG로 두어 외부 서비스 장애의 영향을 받지 않는다.
- 동적 카드 URL은 적용 전에 직접 요청해 정상 응답과 이미지 콘텐츠 유형을 확인한다.
- 기여도 스네이크는 첫 Actions 실행 전까지 표시되지 않을 수 있으므로 대체 문구를 제공한다.

## 검증

1. README에서 Markdown 표가 제거됐는지 확인한다.
2. 모든 로컬 파일 경로와 외부 이미지 URL을 검사한다.
3. SVG XML과 Actions YAML의 문법을 확인한다.
4. 커밋 전 Git diff로 문구, 이메일과 블로그 링크를 재확인한다.
5. 푸시가 승인되면 GitHub 프로필 실제 화면을 라이트·다크 테마와 좁은 화면에서 확인한다.
6. Actions 첫 실행 결과와 `output` 브랜치의 SVG 생성을 별도로 확인한다.

## 범위 제외

- GitHub 프로필 왼쪽의 아바타 크기와 배치는 README에서 변경하지 않는다.
- 실제 경험으로 확인되지 않은 프로젝트 수치, 경력 연차나 숙련도 비율을 만들지 않는다.
- 방문자 카운터처럼 의미가 약한 수치는 넣지 않는다.
- 블로그를 프로필의 주제처럼 과도하게 노출하지 않는다.
