# Step 1: marketplace-pages

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/UI_GUIDE.md`
- `phases/2-web-mvp/step0-output.json`

## 작업
- 메인페이지, 기사목록, 기사 프로필, 작업홍보게시글, 기사구함 목록/작성/상세/댓글 UI를 구현한다.
- 기사 프로필은 소개, 인증게시글, 후기, 이전 작업물 탭으로 구성한다.
- 이전 작업물에는 "외부 작업물 · 쩔로그 인증 X" 표시를 넣고 평점/인증 수 집계에서 제외한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- Browser MCP로 기사목록 필터, 프로필 탭, 기사구함 작성 폼, 댓글 권한 안내를 확인한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 오픈카톡/디스코드 버튼을 등록되지 않은 기사에게 노출하지 마라.
