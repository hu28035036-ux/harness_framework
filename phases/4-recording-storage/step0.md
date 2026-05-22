# Step 0: recorder-backend

## 읽어야 할 파일
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/3-desktop-mvp/step2-output.json`

## 작업
- Python `RecordingBackend` 인터페이스와 `FFmpegRecordingBackend` 구현체를 만든다.
- 3초 테스트 녹화와 30초 클립 녹화 경로를 분리한다.
- 녹화 대상은 게임 창 우선, 실패 시 직접 영역 지정으로 전환할 수 있게 타입을 둔다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- FFmpeg 감지, 테스트 녹화 명령 생성, 실패 처리 테스트를 포함한다.
- 가능하면 실제 3초 테스트 녹화를 수행한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 상위 작업 세션 로직에서 FFmpeg 명령 문자열을 직접 조립하지 마라.
