# Step 0: electron-shell

## 읽어야 할 파일
- `docs/ARCHITECTURE.md`
- `docs/UI_GUIDE.md`
- `phases/2-web-mvp/step2-output.json`

## 작업
- Python + PySide6 MVP 셸, 로그인/업데이트 확인 화면, 기사 승인 상태 차단 흐름을 구현한다.
- PC 프로그램은 Next.js API와 Supabase Auth 세션을 사용하되 service role key를 포함하지 않는다.
- 강제 업데이트가 로그인 전이면 로그인 화면 진입을 차단한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- pytest 기반 단위 테스트 또는 스모크 스크립트를 포함하고, 명령 AC를 5회 연속 실행한다.

## 금지사항
- PySide6 위젯 이벤트 안에 API/녹화/저장 로직을 직접 넣지 마라. 이유: 테스트와 교체 가능성을 해친다.
