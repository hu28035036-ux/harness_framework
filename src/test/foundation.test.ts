import { describe, expect, it } from "vitest";
import {
  navigationTabs,
  promoPosts,
  scammerReports,
  settingsSummary,
  wantedPosts,
  workerCards,
  workerFilters,
} from "@/domain/foundation-data";
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
    expect(navigationTabs.map((tab) => tab.shortLabel)).toEqual(["메인", "기사", "구함", "주의", "건의", "설정"]);
  });

  it("provides marketplace data without external contact CTAs", () => {
    expect(workerFilters).toContain("인증 가능");
    expect(workerCards.every((worker) => worker.historyNote.includes("쩔로그 인증 X"))).toBe(true);
    expect(promoPosts.every((post) => post.evidence.includes("클립"))).toBe(true);
    expect(wantedPosts.every((post) => post.visibility.includes("기사"))).toBe(true);

    const serialized = JSON.stringify({ workerCards, promoPosts, wantedPosts });
    expect(serialized).not.toContain("카카오톡");
    expect(serialized).not.toContain("디스코드");
  });

  it("keeps trust lists limited to public fields and settings privacy-safe", () => {
    expect(scammerReports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workerName: expect.any(String),
          characterName: expect.any(String),
          reportType: expect.any(String),
          status: expect.any(String),
        }),
      ]),
    );
    expect(settingsSummary.find((item) => item.label === "이메일")?.value).toBe("비공개");

    const serialized = JSON.stringify({ scammerReports, settingsSummary });
    expect(serialized).not.toContain("전화번호");
    expect(serialized).not.toContain("IP");
    expect(serialized).not.toContain("계좌번호");
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
