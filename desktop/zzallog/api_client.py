from dataclasses import dataclass
from typing import Protocol

from .app_state import LoginSession, VersionCheck, WorkerApprovalStatus


class DesktopApi(Protocol):
    def check_version(self, current_version: str) -> VersionCheck:
        ...

    def login(self, email: str, password: str) -> LoginSession:
        ...


@dataclass
class DemoDesktopApi:
    latest_version: str = "0.1.0"
    force_update: bool = False
    worker_status: WorkerApprovalStatus = WorkerApprovalStatus.APPROVED

    def check_version(self, current_version: str) -> VersionCheck:
        return VersionCheck(
            current_version=current_version,
            latest_version=self.latest_version,
            force_update=self.force_update,
            download_url="https://example.com/zzallog-desktop" if self.force_update else None,
        )

    def login(self, email: str, password: str) -> LoginSession:
        if not email or not password:
            raise ValueError("email and password are required")
        return LoginSession(access_token="demo-access-token", worker_status=self.worker_status, nickname="데모기사")

