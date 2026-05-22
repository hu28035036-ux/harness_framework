# Step 0: navigation-shell

## 읽어야 할 파일
- `docs/UI_GUIDE.md`
- `docs/PRD.md`
- `phases/1-domain-api/step2-output.json`

## 작업
- 웹 공통 레이아웃, 상단 탭, 손님/기사 모드 토글, 테마 버튼, 로그인/프로필 영역을 구현한다.
- 모바일에서는 탭을 하단 네비게이션 또는 햄버거 메뉴로 축약한다.
- 시스템/다크/화이트 테마를 구현하고 기본값을 시스템으로 둔다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- Browser MCP로 localhost 화면 로드, 주요 탭 렌더, 콘솔 오류 없음, 모바일 폭 레이아웃을 확인한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 첫 화면을 마케팅용 hero만으로 채우지 마라. 이유: 실제 사용 화면이 먼저 보여야 한다.
