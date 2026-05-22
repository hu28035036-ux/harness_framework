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
  재발 방지: ORM 메이저 버전 업그레이드는 별도 ADR과 schema 마이그레이션 계획이 있을 때만 진행한다.

- 날짜: 2026-05-23T00:19:00+0900
  step: 1-domain-api/step0
  증상: Prisma schema에 enum이 있는데 테스트가 `Missing Prisma enum`으로 실패함.
  원인: 동적 정규식 문자열에서 중괄호와 공백 패턴을 과하게 이스케이프함.
  수정: `new RegExp` 패턴을 `enum Name \\{([\\s\\S]*?)\\}` 형태로 수정함.
  재발 방지: 문자열 기반 schema 파서는 작은 실패 테스트로 먼저 확인한다.
