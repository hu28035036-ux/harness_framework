# Step 1: manual-save-recovery

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `phases/5-long-session-recovery/step0-output.json`

## 작업
- 수동저장 버튼이 현재 세션, 캡처, 클립, 업로드 큐, 작업 시간, 보류 기록을 즉시 디스크에 기록하게 한다.
- 프로그램 재실행 시 미게시 인증게시글과 업로드 대기 파일을 복구한다.
- 저장 완료 후 저장 위치와 폴더 열기 액션을 제공한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 저장 파일 생성, 손상된 큐 처리, 재실행 복구 테스트를 포함한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 수동저장을 자동 업로드 대체 기능으로 취급하지 마라. 이유: 안전장치일 뿐이다.
