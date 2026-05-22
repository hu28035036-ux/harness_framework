# Step 1: capture-overlay

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `phases/4-recording-storage/step0-output.json`

## 작업
- 인증캡처 서비스와 오버레이 합성을 구현한다.
- 오버레이에는 날짜/시간, 세션 ID, 기사명, 손님 닉네임, 사냥터를 포함한다.
- 반복 캡처 시 최신 캡처가 대표 캡처로 갱신되게 한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 합성 결과 메타데이터, 대표 캡처 갱신, 누락 필드 검증 테스트를 포함한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 원본 캡처를 덮어쓰지 마라. 이유: 복구와 위변조 확인에 필요하다.
