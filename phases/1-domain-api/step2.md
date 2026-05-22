# Step 2: policy-enforcement

## 읽어야 할 파일
- `CLAUDE.md`
- `docs/PRD.md`
- `phases/1-domain-api/step1-output.json`

## 작업
- 기사구함 댓글은 기사 권한 계정만 작성 가능하게 서버에서 검증한다.
- 작업홍보게시글 10분 제한을 서버에서 검증하고 남은 시간을 반환한다.
- 인증게시글 최종 게시 전 필수 자료, 업로드 실패, 손님 닉네임 누락을 검증한다.
- 평점은 손님 링크 토큰 기준으로 1회만 제출 가능하게 한다.
- 현금거래/계좌/외부 결제 링크/자동사냥/매크로 금지 문구 검증을 서버 정책 함수로 구현한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 정책별 테스트 결과와 5회 검증 결과를 `step2-output.json`에 기록한다.

## 금지사항
- 정책 검증을 UI 비활성화에만 맡기지 마라. 이유: API 직접 호출 우회를 막아야 한다.
