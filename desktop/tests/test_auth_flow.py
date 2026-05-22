import unittest

from desktop.zzallog.api_client import DemoDesktopApi
from desktop.zzallog.app_state import DesktopConfig, WorkerApprovalStatus
from desktop.zzallog.auth_flow import DesktopAuthFlow


class DesktopAuthFlowTest(unittest.TestCase):
    def test_initial_state_blocks_login_when_force_update_is_required(self) -> None:
        flow = DesktopAuthFlow(
            DesktopConfig(api_base_url="https://api.example.test", app_version="0.1.0"),
            DemoDesktopApi(latest_version="0.2.0", force_update=True),
        )

        state = flow.initial_state()

        self.assertFalse(state.login_enabled)
        self.assertEqual(state.blocking_reason, "강제 업데이트가 필요합니다.")

    def test_approved_worker_can_enter_dashboard_after_login(self) -> None:
        flow = DesktopAuthFlow(
            DesktopConfig(api_base_url="https://api.example.test", app_version="0.1.0"),
            DemoDesktopApi(worker_status=WorkerApprovalStatus.APPROVED),
        )

        state = flow.login(email="worker@example.test", password="secret")

        self.assertTrue(state.login_enabled)
        self.assertTrue(state.dashboard_enabled)
        self.assertIsNone(state.blocking_reason)

    def test_pending_worker_is_blocked_from_dashboard(self) -> None:
        flow = DesktopAuthFlow(
            DesktopConfig(api_base_url="https://api.example.test", app_version="0.1.0"),
            DemoDesktopApi(worker_status=WorkerApprovalStatus.PENDING),
        )

        state = flow.login(email="worker@example.test", password="secret")

        self.assertTrue(state.login_enabled)
        self.assertFalse(state.dashboard_enabled)
        self.assertEqual(state.blocking_reason, "승인된 기사 계정만 PC 도구에 진입할 수 있습니다.")

    def test_desktop_config_rejects_service_role_key(self) -> None:
        config = DesktopConfig(
            api_base_url="https://api.example.test",
            app_version="0.1.0",
            service_role_key="must-not-ship",
        )

        with self.assertRaises(ValueError):
            config.validate()


if __name__ == "__main__":
    unittest.main()

