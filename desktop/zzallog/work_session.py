from dataclasses import dataclass, field
from enum import StrEnum


class WorkSessionStatus(StrEnum):
    DRAFT = "draft"
    RECORDING_START = "recording_start"
    IN_PROGRESS = "in_progress"
    PAUSED = "paused"
    HELD = "held"
    RESUMED = "resumed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DELETED = "deleted"


class ConfirmAction(StrEnum):
    NONE = "none"
    HOLD = "hold"
    RESUME = "resume"
    COMPLETE = "complete"
    CANCEL = "cancel"
    DELETE = "delete"


@dataclass(frozen=True)
class WorkSessionDraft:
    customer_nickname: str
    server_name: str
    expected_minutes: int
    price_basis: str
    memo: str = ""

    @property
    def long_session_recommended(self) -> bool:
        return self.expected_minutes >= 180

    def validate(self) -> list[str]:
        errors: list[str] = []
        if not self.customer_nickname.strip():
            errors.append("손님 닉네임을 입력해야 합니다.")
        if not self.server_name.strip():
            errors.append("서버를 선택해야 합니다.")
        if self.expected_minutes <= 0:
            errors.append("예상 작업 시간은 1분 이상이어야 합니다.")
        if not self.price_basis.strip():
            errors.append("비용 기준을 입력해야 합니다.")
        return errors


@dataclass
class WorkSessionViewState:
    draft: WorkSessionDraft
    status: WorkSessionStatus = WorkSessionStatus.DRAFT
    captures: list[str] = field(default_factory=list)
    manual_save_count: int = 0
    pending_confirmation: ConfirmAction = ConfirmAction.NONE

    @property
    def can_start(self) -> bool:
        return self.status == WorkSessionStatus.DRAFT and not self.draft.validate()

    @property
    def can_capture(self) -> bool:
        return self.status in {
            WorkSessionStatus.RECORDING_START,
            WorkSessionStatus.IN_PROGRESS,
            WorkSessionStatus.RESUMED,
        }

    @property
    def can_manual_save(self) -> bool:
        return self.status not in {WorkSessionStatus.COMPLETED, WorkSessionStatus.CANCELLED, WorkSessionStatus.DELETED}

    @property
    def warning_message(self) -> str | None:
        if self.pending_confirmation == ConfirmAction.CANCEL:
            return "취소는 작업 진행 기록을 남기며 즉시 완료 처리하지 않습니다."
        if self.pending_confirmation == ConfirmAction.DELETE:
            return "삭제는 인증 자료 참조를 잃을 수 있어 재확인이 필요합니다."
        if self.pending_confirmation == ConfirmAction.COMPLETE:
            return "완료 전 필수 인증 자료와 업로드 상태를 확인해야 합니다."
        return None


class WorkSessionController:
    def __init__(self, draft: WorkSessionDraft) -> None:
        self.state = WorkSessionViewState(draft=draft)

    def start(self) -> WorkSessionViewState:
        errors = self.state.draft.validate()
        if errors:
            raise ValueError("; ".join(errors))
        self.state.status = WorkSessionStatus.RECORDING_START
        return self.state

    def mark_in_progress(self) -> WorkSessionViewState:
        if self.state.status != WorkSessionStatus.RECORDING_START:
            raise ValueError("recording must be started before work can progress")
        self.state.status = WorkSessionStatus.IN_PROGRESS
        return self.state

    def add_capture(self, capture_ref: str) -> WorkSessionViewState:
        if not self.state.can_capture:
            raise ValueError("capture is only available during active work")
        self.state.captures.append(capture_ref)
        return self.state

    def manual_save(self) -> WorkSessionViewState:
        if not self.state.can_manual_save:
            raise ValueError("completed or deleted sessions cannot be manually saved")
        self.state.manual_save_count += 1
        return self.state

    def request_confirmation(self, action: ConfirmAction) -> WorkSessionViewState:
        if action == ConfirmAction.NONE:
            raise ValueError("confirmation action is required")
        self.state.pending_confirmation = action
        return self.state

    def confirm(self) -> WorkSessionViewState:
        action = self.state.pending_confirmation
        if action == ConfirmAction.NONE:
            raise ValueError("no action is waiting for confirmation")
        if action == ConfirmAction.HOLD:
            self.state.status = WorkSessionStatus.HELD
        elif action == ConfirmAction.RESUME:
            self.state.status = WorkSessionStatus.RESUMED
        elif action == ConfirmAction.COMPLETE:
            self.state.status = WorkSessionStatus.COMPLETED
        elif action == ConfirmAction.CANCEL:
            self.state.status = WorkSessionStatus.CANCELLED
        elif action == ConfirmAction.DELETE:
            self.state.status = WorkSessionStatus.DELETED
        self.state.pending_confirmation = ConfirmAction.NONE
        return self.state

