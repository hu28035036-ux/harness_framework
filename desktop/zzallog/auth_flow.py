from .api_client import DesktopApi
from .app_state import DesktopConfig, LoginScreenState


class DesktopAuthFlow:
    def __init__(self, config: DesktopConfig, api: DesktopApi) -> None:
        config.validate()
        self._config = config
        self._api = api

    def initial_state(self) -> LoginScreenState:
        version = self._api.check_version(self._config.app_version)
        return LoginScreenState(version=version)

    def login(self, email: str, password: str) -> LoginScreenState:
        version = self._api.check_version(self._config.app_version)
        if not version.can_continue:
            return LoginScreenState(version=version, message="업데이트 후 다시 로그인해 주세요.")
        session = self._api.login(email=email, password=password)
        return LoginScreenState(version=version, session=session)

