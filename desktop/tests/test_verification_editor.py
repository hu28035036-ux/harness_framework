import unittest

from desktop.zzallog.verification_editor import (
    AssetUploadStatus,
    VerificationAsset,
    VerificationAutofill,
    VerificationDraft,
    validate_for_publish,
)


class VerificationEditorTest(unittest.TestCase):
    def make_autofill(self, assets: tuple[VerificationAsset, ...] | None = None) -> VerificationAutofill:
        return VerificationAutofill(
            session_id="session-001",
            worker_name="새벽기사",
            customer_nickname="손님A",
            server_name="루나",
            started_at="2026-05-23T01:00:00+09:00",
            ended_at="2026-05-23T03:00:00+09:00",
            actual_minutes=120,
            assets=assets
            if assets is not None
            else (
                VerificationAsset("capture-001", "capture", "capture-001.png", AssetUploadStatus.UPLOADED),
                VerificationAsset("clip-001", "clip", "clip-001.mp4", AssetUploadStatus.UPLOADED),
            ),
        )

    def test_publishable_draft_uses_autofill_and_direct_fields(self) -> None:
        draft = VerificationDraft(
            autofill=self.make_autofill(),
            title="작업 인증 게시글",
            work_summary="요청 시간 동안 작업을 완료했습니다.",
            price_basis="시간 협의",
            worker_memo="특이사항 없음",
        )

        result = validate_for_publish(draft)

        self.assertTrue(result.can_publish)
        self.assertEqual(result.missing_fields, ())
        self.assertEqual(result.failed_asset_ids, ())
        self.assertIn("세션: session-001", result.preview)

    def test_missing_required_fields_block_publish(self) -> None:
        draft = VerificationDraft(autofill=self.make_autofill(assets=()))

        result = validate_for_publish(draft)

        self.assertFalse(result.can_publish)
        self.assertIn("제목", result.missing_fields)
        self.assertIn("작업 요약", result.missing_fields)
        self.assertIn("비용 기준", result.missing_fields)
        self.assertIn("캡처/클립", result.missing_fields)

    def test_failed_upload_blocks_publish(self) -> None:
        failed_asset = VerificationAsset("clip-failed", "clip", "clip-failed.mp4", AssetUploadStatus.FAILED)
        draft = VerificationDraft(
            autofill=self.make_autofill(assets=(failed_asset,)),
            title="작업 인증 게시글",
            work_summary="자료 업로드 실패 케이스",
            price_basis="협의",
        )

        result = validate_for_publish(draft)

        self.assertFalse(result.can_publish)
        self.assertEqual(result.failed_asset_ids, ("clip-failed",))

    def test_customer_nickname_missing_blocks_publish(self) -> None:
        autofill = VerificationAutofill(
            session_id="session-001",
            worker_name="새벽기사",
            customer_nickname="",
            server_name="루나",
            started_at="2026-05-23T01:00:00+09:00",
            ended_at="2026-05-23T03:00:00+09:00",
            actual_minutes=120,
            assets=(VerificationAsset("capture-001", "capture", "capture-001.png", AssetUploadStatus.UPLOADED),),
        )
        draft = VerificationDraft(
            autofill=autofill,
            title="작업 인증 게시글",
            work_summary="닉네임 누락 케이스",
            price_basis="협의",
        )

        result = validate_for_publish(draft)

        self.assertFalse(result.can_publish)
        self.assertIn("손님 닉네임", result.missing_fields)


if __name__ == "__main__":
    unittest.main()

