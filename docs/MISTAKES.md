# 실수 기록

검증 중 발견한 실수와 재발 방지 규칙을 누적 기록한다.

## 형식
- 날짜:
- step:
- 증상:
- 원인:
- 수정:
- 재발 방지:

## 기록
- 아직 없음.

- 날짜: 2026-05-23T00:03:00+0900
  step: 0-foundation/step0
  증상: PowerShell 실행 정책 때문에 `npm`/`npx` ps1 진입점이 실행되지 않음.
  원인: Windows PowerShell의 스크립트 실행 정책이 `npm.ps1` 실행을 차단함.
  수정: 검증 및 설치 명령에서 `npm.cmd`를 사용함.
  재발 방지: Windows 환경의 하네스 검증은 `npm.cmd run ...` 형태로 실행 가능함을 기록한다.

- 날짜: 2026-05-23T00:04:00+0900
  step: 0-foundation/step0
  증상: Vitest가 `@/domain/foundation-data` 경로 별칭을 해석하지 못해 테스트 수집 실패.
  원인: `tsconfig.json`에는 `@/*` 경로가 있었지만 `vitest.config.ts`의 Vite resolver에는 alias가 없었음.
  수정: `vitest.config.ts`에 `@` alias를 `src`로 매핑함.
  재발 방지: Next/TypeScript 경로 별칭을 추가할 때 Vitest/Vite resolver에도 같은 별칭을 추가한다.

- 날짜: 2026-05-23T00:06:00+0900
  step: 0-foundation/step0
  증상: 5회 검증 루프에서 `npm.cmd run lint`가 실패했는데 PowerShell 루프가 계속 진행함.
  원인: `$ErrorActionPreference='Stop'`은 native command의 non-zero exit code를 자동으로 예외 처리하지 않음.
  수정: 검증 루프에서 각 명령 직후 `$LASTEXITCODE`를 확인하도록 변경해 재검증한다.
  재발 방지: PowerShell로 AC 반복 검증을 수행할 때는 각 native command 뒤에 exit code 확인을 넣는다.

- 날짜: 2026-05-23T00:06:00+0900
  step: 0-foundation/step0
  증상: Next build 후 `next-env.d.ts`에 `.next/types/routes.d.ts` triple slash reference가 자동 추가되어 ESLint 실패.
  원인: Next가 관리하는 생성 호환 파일을 ESLint 대상에 포함함.
  수정: `eslint.config.mjs`에서 `next-env.d.ts`를 ignore 처리함.
  재발 방지: 프레임워크가 자동 관리하는 타입 참조 파일은 lint 대상에서 제외한다.

- 날짜: 2026-05-23T00:19:00+0900
  step: 1-domain-api/step0
  증상: `npx prisma validate`가 datasource `url` 속성을 거부함.
  원인: 최초 설치된 Prisma 7은 datasource URL 설정 방식이 변경되어 기존 schema 문법과 맞지 않음.
  수정: MVP 안정성을 위해 Prisma CLI와 client를 6.19.0으로 고정함.
  재발 방지: 이후 계획 변경으로 DB 기준을 Supabase SQL migration으로 바꾸었으므로 Prisma를 다시 도입하지 않는다.

- 날짜: 2026-05-23T00:19:00+0900
  step: 1-domain-api/step0
  증상: Prisma schema에 enum이 있는데 테스트가 `Missing Prisma enum`으로 실패함.
  원인: 동적 정규식 문자열에서 중괄호와 공백 패턴을 과하게 이스케이프함.
  수정: `new RegExp` 패턴을 `enum Name \\{([\\s\\S]*?)\\}` 형태로 수정함.
  재발 방지: Supabase SQL migration 파서도 작은 실패 테스트로 먼저 확인한다.

- 날짜: 2026-05-23T00:32:00+0900
  step: 1-domain-api/step2
  증상: `npm run typecheck`가 `.next/types/... not found` 오류로 실패함.
  원인: `next build`가 `next-env.d.ts`에 생성 타입 참조를 추가한 뒤, 이후 route 변경으로 `.next/types`가 stale 상태가 됨.
  수정: `typecheck` 스크립트를 `next typegen && tsc --noEmit`으로 변경해 AC 실행 전 route 타입을 재생성함.
  재발 방지: Next App Router route 파일을 추가/삭제하는 step에서는 typecheck 전에 `next typegen`을 실행한다.

- 날짜: 2026-05-23T07:46:00+0900
  step: 2-web-mvp/step0
  증상: 모바일 폭 브라우저 검증에서 상단 주요 메뉴가 숨겨지지 않고 `display: block`으로 남음.
  원인: 반응형 표시/숨김을 Tailwind 유틸 조합에만 맡겨 실제 브라우저 검증에서 기대 표시 상태를 안정적으로 보장하지 못함.
  수정: `.desktop-main-nav`, `.mobile-bottom-nav` 전용 CSS와 1024px media query를 추가해 데스크톱/모바일 표시 상태를 명시함.
  재발 방지: breakpoint에 따라 반드시 숨겨져야 하는 핵심 내비게이션은 Browser MCP의 실제 computed style로 확인한다.

- date: 2026-05-23T07:59:29+09:00
  step: 2-web-mvp/step1
  symptom: Browser verification failed once with `Identifier 'desktop' has already been declared`.
  cause: The persistent browser JavaScript kernel kept previous top-level declarations from an earlier check.
  fix: Reset the browser JavaScript kernel before rerunning the responsive breakpoint script.
  prevention: In browser verification scripts, use fresh variable names or `var` for reusable bindings, and reset the kernel before a new multi-step responsive check.

- date: 2026-05-23T08:07:06+09:00
  step: 2-web-mvp/step2
  symptom: Browser verification initially showed missing sections and stale dev-server runtime errors even though lint, typecheck, tests, and build passed.
  cause: A long-running Next.js dev server kept stale HMR/runtime state after repeated page rewrites.
  fix: Restarted the localhost verification server and reset the browser JavaScript kernel before rerunning Browser checks.
  prevention: After large App Router page rewrites, restart the dev server before Browser MCP verification if the page title falls back to the host or console shows webpack runtime errors.
