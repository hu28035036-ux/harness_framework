# Step 1: work-session-ui

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `phases/3-desktop-mvp/step0-output.json`

## 작업
- 기사 대시보드, 작업 시작 화면, 작업 진행 화면을 구현한다.
- 작업 시작 입력: 손님 닉네임, 사냥터, 예정 작업 시간, 비용 기준, 작업 메모.
- 3시간 이상이면 장시간 모드 토글을 활성화한다.
- 인증캡처, 수동저장, 일시정지, 재개, 보류, 이어하기, 완료, 중단/삭제, 취소/삭제 버튼과 경고 모달을 구현한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 상태 전이 테스트와 주요 버튼 경고 모달 테스트를 포함한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 중단/취소 동작을 단일 클릭으로 실행하지 마라. 이유: 인증자료 삭제는 되돌리기 어렵다.
