import unittest

from desktop.zzallog.work_session import ConfirmAction, WorkSessionController, WorkSessionDraft, WorkSessionStatus


class WorkSessionControllerTest(unittest.TestCase):
    def make_draft(self, expected_minutes: int = 120) -> WorkSessionDraft:
        return WorkSessionDraft(
            customer_nickname="손님A",
            server_name="루나",
            expected_minutes=expected_minutes,
            price_basis="시간 협의",
            memo="테스트 작업",
        )

    def test_start_requires_required_fields(self) -> None:
        controller = WorkSessionController(
            WorkSessionDraft(customer_nickname="", server_name="", expected_minutes=0, price_basis="")
        )

        with self.assertRaises(ValueError) as error:
            controller.start()

        self.assertIn("손님 닉네임", str(error.exception))
        self.assertIn("서버", str(error.exception))

    def test_long_session_recommendation_turns_on_after_three_hours(self) -> None:
        self.assertFalse(self.make_draft(179).long_session_recommended)
        self.assertTrue(self.make_draft(180).long_session_recommended)

    def test_active_session_allows_capture_and_manual_save(self) -> None:
        controller = WorkSessionController(self.make_draft())

        controller.start()
        state = controller.mark_in_progress()
        self.assertEqual(state.status, WorkSessionStatus.IN_PROGRESS)

        controller.add_capture("capture-001.png")
        controller.manual_save()

        self.assertEqual(controller.state.captures, ["capture-001.png"])
        self.assertEqual(controller.state.manual_save_count, 1)

    def test_cancel_and_delete_require_confirmation(self) -> None:
        controller = WorkSessionController(self.make_draft())
        controller.start()

        state = controller.request_confirmation(ConfirmAction.CANCEL)
        self.assertIn("즉시 완료 처리하지 않습니다", state.warning_message or "")
        controller.confirm()
        self.assertEqual(controller.state.status, WorkSessionStatus.CANCELLED)

        delete_controller = WorkSessionController(self.make_draft())
        delete_controller.start()
        delete_state = delete_controller.request_confirmation(ConfirmAction.DELETE)
        self.assertIn("재확인이 필요합니다", delete_state.warning_message or "")
        delete_controller.confirm()
        self.assertEqual(delete_controller.state.status, WorkSessionStatus.DELETED)


if __name__ == "__main__":
    unittest.main()

