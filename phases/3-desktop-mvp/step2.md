# Step 2: verification-editor

## 읽어야 할 파일
- `docs/PRD.md`
- `phases/3-desktop-mvp/step1-output.json`

## 작업
- 인증게시글 작성 화면을 구현한다.
- 자동 입력 항목: 세션 ID, 기사명, 손님 닉네임, 사냥터, 시작/종료 시각, 실제 작업 시간, 캡처/클립 목록.
- 직접 입력 항목: 제목, 작업 요약, 비용 기준, 기사 메모, 추가 사냥녹화 영상.
- 미리보기와 최종 업로드 전 검증 결과 표시를 구현한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 필수 자료 누락, 업로드 실패, 손님 닉네임 누락 케이스를 테스트한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 업로드 실패가 남아 있는 게시글을 최종 게시하지 마라.
