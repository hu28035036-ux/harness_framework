from dataclasses import dataclass
from enum import StrEnum


class WorkerApprovalStatus(StrEnum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


@dataclass(frozen=True)
class DesktopConfig:
    api_base_url: str
    app_version: str
    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    service_role_key: str | None = None

    def validate(self) -> None:
        if not self.api_base_url:
            raise ValueError("api_base_url is required")
        if self.service_role_key:
            raise ValueError("desktop config must not include a Supabase service role key")


@dataclass(frozen=True)
class VersionCheck:
    current_version: str
    latest_version: str
    force_update: bool
    download_url: str | None = None

    @property
    def can_continue(self) -> bool:
        return not self.force_update


@dataclass(frozen=True)
class LoginSession:
    access_token: str
    worker_status: WorkerApprovalStatus
    nickname: str

    @property
    def can_enter_dashboard(self) -> bool:
        return self.worker_status == WorkerApprovalStatus.APPROVED


@dataclass(frozen=True)
class LoginScreenState:
    version: VersionCheck
    session: LoginSession | None = None
    message: str = ""

    @property
    def login_enabled(self) -> bool:
        return self.version.can_continue

    @property
    def dashboard_enabled(self) -> bool:
        return bool(self.session and self.session.can_enter_dashboard)

    @property
    def blocking_reason(self) -> str | None:
        if not self.version.can_continue:
            return "강제 업데이트가 필요합니다."
        if self.session and not self.session.can_enter_dashboard:
            return "승인된 기사 계정만 PC 도구에 진입할 수 있습니다."
        return None

