# Step 1: quality-baseline

## 읽어야 할 파일
- `CLAUDE.md`
- `docs/ARCHITECTURE.md`
- `phases/0-foundation/step0-output.json`

## 작업
- 공통 테스트 유틸과 샘플 도메인 테스트를 추가해 TDD 흐름을 고정한다.
- `src/types`에 공통 상태 타입 초안을 만들고, 세션/게시글/파일 상태가 PDF 상태값과 일치하는지 테스트한다.
- 프로젝트 구조 검증 테스트를 추가해 필수 디렉터리가 빠지면 실패하게 한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- `step1-output.json`에 구현 요약과 5회 검증 결과를 기록한다.
- 5회 연속 통과 후 commit/push까지 성공해야 완료 처리한다.

## 금지사항
- 아직 DB, 인증, API 구현을 시작하지 마라. 이유: foundation phase는 품질 기준과 구조만 고정한다.
