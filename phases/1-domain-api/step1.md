# Step 1: api-contracts

## 읽어야 할 파일
- `docs/ARCHITECTURE.md`
- `phases/1-domain-api/step0-output.json`

## 작업
- 설계서의 API 초안을 `app/api` 라우트로 구현한다.
- DB 접근은 서버 서비스로 분리하고, 라우트 핸들러는 입력 검증과 응답 변환에 집중한다.
- 인증은 MVP용 세션/토큰 추상화로 시작하되, 교체 가능한 인터페이스를 둔다.
- API 테스트는 성공/권한 없음/검증 실패 케이스를 포함한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 구현 요약, API 목록, 테스트 범위, 5회 검증 결과를 `step1-output.json`에 기록한다.

## 금지사항
- 클라이언트 컴포넌트에서 DB나 외부 API를 직접 호출하지 마라. 이유: 서버 정책 검증을 우회할 수 있다.
