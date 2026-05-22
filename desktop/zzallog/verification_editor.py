from dataclasses import dataclass, field
from enum import StrEnum


class AssetUploadStatus(StrEnum):
    LOCAL_SAVED = "local_saved"
    UPLOADED = "uploaded"
    FAILED = "failed"
    RETRY_PENDING = "retry_pending"


@dataclass(frozen=True)
class VerificationAsset:
    asset_id: str
    asset_type: str
    local_path: str
    upload_status: AssetUploadStatus

    @property
    def is_publishable(self) -> bool:
        return self.upload_status == AssetUploadStatus.UPLOADED


@dataclass(frozen=True)
class VerificationAutofill:
    session_id: str
    worker_name: str
    customer_nickname: str
    server_name: str
    started_at: str
    ended_at: str
    actual_minutes: int
    assets: tuple[VerificationAsset, ...]


@dataclass
class VerificationDraft:
    autofill: VerificationAutofill
    title: str = ""
    work_summary: str = ""
    price_basis: str = ""
    worker_memo: str = ""
    additional_clip_refs: list[str] = field(default_factory=list)

    def missing_required_fields(self) -> list[str]:
        missing: list[str] = []
        if not self.autofill.session_id:
            missing.append("세션 ID")
        if not self.autofill.worker_name:
            missing.append("기사명")
        if not self.autofill.customer_nickname:
            missing.append("손님 닉네임")
        if not self.autofill.server_name:
            missing.append("서버")
        if self.autofill.actual_minutes <= 0:
            missing.append("실제 작업 시간")
        if not self.title.strip():
            missing.append("제목")
        if not self.work_summary.strip():
            missing.append("작업 요약")
        if not self.price_basis.strip():
            missing.append("비용 기준")
        if not self.autofill.assets:
            missing.append("캡처/클립")
        return missing

    def failed_assets(self) -> list[VerificationAsset]:
        return [asset for asset in self.autofill.assets if asset.upload_status != AssetUploadStatus.UPLOADED]

    def can_publish(self) -> bool:
        return not self.missing_required_fields() and not self.failed_assets()

    def preview_lines(self) -> list[str]:
        return [
            f"제목: {self.title or '미입력'}",
            f"세션: {self.autofill.session_id or '미입력'}",
            f"기사: {self.autofill.worker_name or '미입력'}",
            f"손님: {self.autofill.customer_nickname or '미입력'}",
            f"서버: {self.autofill.server_name or '미입력'}",
            f"시간: {self.autofill.started_at} - {self.autofill.ended_at} / {self.autofill.actual_minutes}분",
            f"자료: {len(self.autofill.assets)}개",
            f"추가 영상: {len(self.additional_clip_refs)}개",
        ]


@dataclass(frozen=True)
class PublishValidationResult:
    can_publish: bool
    missing_fields: tuple[str, ...]
    failed_asset_ids: tuple[str, ...]
    preview: tuple[str, ...]


def validate_for_publish(draft: VerificationDraft) -> PublishValidationResult:
    failed = draft.failed_assets()
    return PublishValidationResult(
        can_publish=draft.can_publish(),
        missing_fields=tuple(draft.missing_required_fields()),
        failed_asset_ids=tuple(asset.asset_id for asset in failed),
        preview=tuple(draft.preview_lines()),
    )

