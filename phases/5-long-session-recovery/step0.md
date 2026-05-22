# Step 0: long-session-mode

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `phases/4-recording-storage/step2-output.json`

## 작업
- 3시간 이상 작업에서만 장시간 모드를 선택 가능하게 한다.
- 30분마다 인증캡처, 1시간마다 중간 30초 클립 예약을 구현한다.
- 보류 중에는 타이머, 비용 계산, 자동 캡처/클립 예약을 정지한다.
- 이어하기 시 재개 30초 클립을 예약한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 가상 타이머 테스트로 캡처/클립 예약과 보류/재개 동작을 검증한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 보류 시간을 실제 작업 시간에 포함하지 마라.
