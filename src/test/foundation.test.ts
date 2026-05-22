import { describe, expect, it } from "vitest";
import { navigationTabs } from "@/domain/foundation-data";
import {
  assetStatuses,
  verificationPostStatuses,
  workSessionStatuses,
  type AssetStatus,
  type VerificationPostStatus,
  type WorkSessionStatus,
} from "@/types/session";

describe("foundation shell", () => {
  it("keeps the required top-level tabs from the PRD", () => {
    expect(navigationTabs.map((tab) => tab.label)).toEqual([
      "메인페이지",
      "기사목록",
      "기사구함",
      "사기꾼",
      "오류 및 건의사항",
      "설정",
    ]);
  });

  it("exposes the design-spec status unions", () => {
    const session: WorkSessionStatus = "in_progress";
    const post: VerificationPostStatus = "ready_to_publish";
    const asset: AssetStatus = "retry_pending";

    expect([session, post, asset]).toEqual(["in_progress", "ready_to_publish", "retry_pending"]);
  });

  it("matches the status values from the design spec", () => {
    expect(workSessionStatuses).toEqual([
      "draft",
      "recording_start",
      "in_progress",
      "paused",
      "held",
      "resumed",
      "completed",
      "cancelled",
      "deleted",
    ]);
    expect(verificationPostStatuses).toEqual([
      "draft",
      "assets_uploading",
      "ready_to_publish",
      "published",
      "rating_pending",
      "rated",
      "deleted",
    ]);
    expect(assetStatuses).toEqual([
      "none",
      "recording",
      "uploading",
      "uploaded",
      "failed",
      "local_saved",
      "retry_pending",
    ]);
  });
});
