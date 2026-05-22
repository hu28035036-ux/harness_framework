# Step 2: upload-queue

## 읽어야 할 파일
- `docs/ARCHITECTURE.md`
- `phases/4-recording-storage/step1-output.json`

## 작업
- 로컬 저장 구조를 구현한다: `session.json`, `captures/`, `clips/`, `upload_queue.json`, `recovery_state.json`.
- 파일 SHA-256 해시를 저장한다.
- 업로드 실패 시 `retry_pending` 상태로 남기고 재시도할 수 있게 한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 저장, 해시, 큐 복원, 재시도 상태 테스트를 포함한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 업로드 성공 전 로컬 파일을 삭제하지 마라.
