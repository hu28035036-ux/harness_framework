# Step 0: policy-hardening

## 읽어야 할 파일
- `CLAUDE.md`
- `docs/PRD.md`
- `docs/MISTAKES.md`
- `phases/5-long-session-recovery/step2-output.json`

## 작업
- 개인정보 비공개, 금지 문구 차단, 중단/취소 자료 삭제, 평점 집계 제외 규칙을 통합 검증한다.
- 웹과 PC 프로그램의 다크/화이트/시스템 테마가 모두 동작하는지 확인한다.
- Browser MCP로 주요 웹 플로우를 확인하고, 필요하면 Electron 스모크 검증을 수행한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 정책 회귀 테스트와 브라우저 검증 요약을 `step0-output.json`에 기록한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 테스트를 통과시키기 위해 정책 검증을 약화하지 마라.
