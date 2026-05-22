# Step 0: project-bootstrap

## 읽어야 할 파일
- `CLAUDE.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md`
- `docs/MISTAKES.md`

## 작업
- Next.js 15 + TypeScript strict + Tailwind CSS 프로젝트를 현재 저장소에 초기화한다.
- Electron을 추후 붙일 수 있도록 웹 소스는 `src/` 아래에 두고, `src/desktop`, `src/recorder`, `src/storage`, `src/domain`, `src/server`, `src/types` 디렉터리를 생성한다.
- `package.json`에 `dev`, `build`, `lint`, `typecheck`, `test` 스크립트를 정의한다.
- 테스트 러너는 빠른 MVP에 맞게 Vitest를 기본으로 사용한다.
- 홈 화면은 실제 앱 첫 화면으로 만들되, 아직 기능 구현 전이므로 메인 탭과 상태 영역의 뼈대만 둔다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
1. 구현 요약을 `phases/0-foundation/step0-output.json`에 먼저 기록한다.
2. Acceptance Criteria 명령을 같은 순서로 5회 연속 실행한다.
3. 5회 모두 통과하면 `index.json`의 step 0을 `completed`로 바꾸고 summary를 작성한다.
4. 실패하면 수정 후 1회차부터 다시 시작하고, 원인과 재발 방지를 `docs/MISTAKES.md`에 기록한다.

## 금지사항
- PDF 원본 파일을 수정하지 마라.
- 기능 없는 마케팅 랜딩 페이지를 만들지 마라. 이유: MVP 첫 화면은 실제 앱 구조를 보여야 한다.
