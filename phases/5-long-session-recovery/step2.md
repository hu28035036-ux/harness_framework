# Step 2: update-flow

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `phases/5-long-session-recovery/step1-output.json`

## 작업
- `GET /api/app-version` 응답을 사용해 선택/강제 업데이트 흐름을 구현한다.
- 로그인 전/작업 시작 전 강제 업데이트면 차단한다.
- 작업 진행 중 강제 업데이트가 감지되면 현재 작업은 계속 허용하고 수동저장을 강조한다.
- 작업 완료 후 최종 게시 전 업데이트 요구 가능 상태를 처리한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 로그인 전, 작업 시작 전, 작업 중, 완료 후 업데이트 상태 테스트를 포함한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 작업 진행 중 강제 업데이트로 프로세스를 즉시 종료하지 마라.
