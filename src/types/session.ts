export const workSessionStatuses = [
  "draft",
  "recording_start",
  "in_progress",
  "paused",
  "held",
  "resumed",
  "completed",
  "cancelled",
  "deleted",
] as const;

export type WorkSessionStatus =
  (typeof workSessionStatuses)[number];

export const verificationPostStatuses = [
  "draft",
  "assets_uploading",
  "ready_to_publish",
  "published",
  "rating_pending",
  "rated",
  "deleted",
] as const;

export type VerificationPostStatus =
  (typeof verificationPostStatuses)[number];

export const assetStatuses = [
  "none",
  "recording",
  "uploading",
  "uploaded",
  "failed",
  "local_saved",
  "retry_pending",
] as const;

export type AssetStatus =
  (typeof assetStatuses)[number];

export const workerApprovalStatuses = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

export type WorkerApprovalStatus =
  (typeof workerApprovalStatuses)[number];

export const wantedPostStatuses = ["open", "closed", "hidden", "deleted"] as const;

export type WantedPostStatus = (typeof wantedPostStatuses)[number];

export const reportStatuses = [
  "received",
  "reviewing",
  "listed",
  "rejected",
  "closed",
] as const;

export type ReportStatus = (typeof reportStatuses)[number];
