# 프로젝트: 쩔로그

## 기술 스택
- 웹/API: Next.js 15, TypeScript strict mode, App Router
- 스타일링: Tailwind CSS, 접근성 우선 컴포넌트
- PC 프로그램: Electron 기반 MVP. 녹화/저장/업로드 로직은 독립 모듈로 분리해 추후 Tauri 또는 네이티브 앱으로 교체 가능하게 유지
- DB: PostgreSQL 운영 기준, Prisma ORM
- 녹화: FFmpeg MVP, `RecorderBackend` 인터페이스 뒤에 격리

## 아키텍처 규칙
- CRITICAL: 현금거래, 자동사냥, 매크로, 자동 키입력, 마우스 자동 이동, 거짓말탐지기 자동 대응, 게임 메모리 읽기, 패킷 분석, 클라이언트 변조 기능을 만들지 말 것.
- CRITICAL: 개인정보와 공개 프로필 정보를 분리하고, 실명/전화번호/이메일/IP/계좌번호/주민번호를 공개 화면에 노출하지 말 것.
- CRITICAL: 작업 인증 자료는 로컬 저장 후 업로드한다. 업로드 실패, 네트워크 장애, 업데이트 이후 복구 가능해야 한다.
- CRITICAL: 서버 검증이 필요한 정책(기사 권한 댓글, 작업홍보 10분 제한, 인증게시글 게시 가능 여부, 평점 토큰)은 클라이언트 UI에만 의존하지 말 것.
- CRITICAL: PC 프로그램 상위 로직은 FFmpeg에 직접 종속되지 말고 `RecorderBackend` 계약만 사용한다.
- API 로직은 `app/api/` 라우트 핸들러 또는 서버 전용 서비스에서만 처리한다.
- 공통 타입은 `src/types`, 도메인 규칙은 `src/domain`, 서버 서비스는 `src/server`, 클라이언트 컴포넌트는 `src/components`에 둔다.

## 개발 프로세스
- 새 기능 구현 시 테스트 또는 검증 스크립트를 먼저 추가하고, 통과하는 구현을 작성한다.
- 각 step은 구현된 것과 동작 확인 방법을 `stepN-output.json`에 기록한 뒤 검증을 시작한다.
- 각 step의 Acceptance Criteria는 동일 명령 묶음을 5회 연속 통과해야 완료 처리한다.
- 검증 실패는 원인, 수정, 재발 방지 규칙을 `docs/MISTAKES.md`에 기록한다.
- 각 step 완료 시 conventional commit을 만들고 즉시 `git push -u origin <branch>`를 실행한다.
- 장시간 작업 중에는 5분마다 현재 step, 완료/남은 작업, 최근 검증 결과를 보고한다.

## 명령어
- `npm run dev`: 웹 개발 서버
- `npm run build`: 프로덕션 빌드
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript 검사
- `npm test`: 테스트
- `python scripts/execute.py <phase-dir>`: 하네스 step 순차 실행
