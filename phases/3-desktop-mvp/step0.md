# Step 0: electron-shell

## 읽어야 할 파일
- `docs/ARCHITECTURE.md`
- `docs/UI_GUIDE.md`
- `phases/2-web-mvp/step2-output.json`

## 작업
- Electron MVP 셸, 로그인/업데이트 확인 화면, 기사 승인 상태 차단 흐름을 구현한다.
- IPC 계약은 타입으로 고정하고, 웹 코드와 공유 가능한 UI 토큰을 사용한다.
- 강제 업데이트가 로그인 전이면 로그인 화면 진입을 차단한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- Electron 단위 테스트 또는 스모크 스크립트를 포함하고, 명령 AC를 5회 연속 실행한다.

## 금지사항
- Electron 메인 프로세스에서 UI 상태를 직접 관리하지 마라. 이유: 테스트와 교체 가능성을 해친다.
