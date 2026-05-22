# Step 1: final-report

## 읽어야 할 파일
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/MISTAKES.md`
- 모든 `phases/*/*-output.json`

## 작업
- `docs/FINAL_REPORT.md`를 작성한다.
- 보고서에는 구현 요약, step별 검증 5회 결과, push 이력, 실수 기록, 남은 리스크, 다음 개선 제안을 포함한다.
- 최종 통합 검증을 5회 실행하고 결과를 보고서에 반영한다.

## Acceptance Criteria
```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## 검증 절차
- 최종 보고서 작성 후 명령 AC 5회 연속 통과, commit, push까지 성공해야 phase를 완료한다.

## 금지사항
- 실패한 검증을 성공으로 기록하지 마라.
