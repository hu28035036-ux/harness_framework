export type WorkSessionStatus =
  | "draft"
  | "recording_start"
  | "in_progress"
  | "paused"
  | "held"
  | "resumed"
  | "completed"
  | "cancelled"
  | "deleted";

export type VerificationPostStatus =
  | "draft"
  | "assets_uploading"
  | "ready_to_publish"
  | "published"
  | "rating_pending"
  | "rated"
  | "deleted";

export type AssetStatus =
  | "none"
  | "recording"
  | "uploading"
  | "uploaded"
  | "failed"
  | "local_saved"
  | "retry_pending";
