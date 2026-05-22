# Step 0: domain-models

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/0-foundation/step1-output.json`

## 작업
- Supabase SQL migration에 users, worker_profiles, portfolio_items, promo_posts, wanted_posts, wanted_post_comments, work_sessions, verification_posts, captures, clips, ratings, scammer_reports, scammer_entries, update_versions 테이블을 추가한다.
- Supabase Storage bucket `verification-assets`를 migration 기준에 포함한다.
- captures/clips는 `storage_bucket`, `storage_key`를 저장해 추후 R2 분리 시 URL이 아니라 object key 중심으로 이전 가능하게 한다.
- 도메인 타입은 `src/types`에 공유하고, Supabase enum과 TypeScript union이 어긋나지 않게 테스트한다.
- 개인정보 필드는 공개 프로필 DTO에 포함되지 않도록 매핑 함수를 만든다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- `step0-output.json`에 모델/타입/DTO 요약과 5회 검증 결과를 기록한다.

## 금지사항
- 개인정보 필드를 공개 DTO에 넣지 마라. 이유: 사기꾼/기사 공개 화면의 법적 리스크를 줄여야 한다.
- Supabase service role key가 브라우저 또는 PC 클라이언트 코드에 들어가지 않게 하라.
