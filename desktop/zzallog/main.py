from .api_client import DemoDesktopApi
from .app_state import DesktopConfig
from .auth_flow import DesktopAuthFlow
from .work_session import WorkSessionDraft


def create_flow() -> DesktopAuthFlow:
    config = DesktopConfig(api_base_url="http://localhost:3000", app_version="0.1.0")
    return DesktopAuthFlow(config=config, api=DemoDesktopApi())


def main() -> int:
    try:
        from PySide6.QtWidgets import QApplication, QLabel, QPushButton, QVBoxLayout, QWidget
    except ImportError:
        flow = create_flow()
        state = flow.initial_state()
        print(f"ZzalLog desktop ready. login_enabled={state.login_enabled}")
        return 0

    app = QApplication([])
    flow = create_flow()
    state = flow.initial_state()

    window = QWidget()
    window.setWindowTitle("쩔로그 PC 도구")
    layout = QVBoxLayout(window)
    layout.addWidget(QLabel("쩔로그 기사 로그인"))
    layout.addWidget(QLabel(state.blocking_reason or "업데이트 확인 완료. 로그인할 수 있습니다."))
    sample_draft = WorkSessionDraft(customer_nickname="손님A", server_name="루나", expected_minutes=180, price_basis="협의")
    layout.addWidget(QLabel(f"작업 시작 준비: {sample_draft.server_name} / 장시간 모드 권장={sample_draft.long_session_recommended}"))
    layout.addWidget(QLabel("인증 게시글 편집: 필수 자료와 업로드 상태 확인 후 게시"))
    login_button = QPushButton("로그인")
    login_button.setEnabled(state.login_enabled)
    layout.addWidget(login_button)
    window.resize(420, 220)
    window.show()
    return app.exec()


if __name__ == "__main__":
    raise SystemExit(main())
