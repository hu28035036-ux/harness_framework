# Step 2: trust-settings-pages

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/UI_GUIDE.md`
- `phases/2-web-mvp/step1-output.json`

## 작업
- 사기꾼 제보/목록, 오류 및 건의사항, 설정 페이지를 구현한다.
- 사기꾼 목록은 기사명/캐릭터명/등록일/유형/상태만 공개한다.
- 설정에는 닉네임, 이메일, 비밀번호, 테마, 기사 전환 신청, 휴대폰 본인인증 상태를 둔다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 개인정보 비노출 테스트와 Browser MCP 화면 확인을 포함한다.
- 명령 AC는 5회 연속 통과해야 한다.

## 금지사항
- 실명, 전화번호, 이메일, IP, 계좌번호를 공개 목록에 표시하지 마라.
