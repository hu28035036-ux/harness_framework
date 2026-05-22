import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { toPublicWorkerProfile } from "@/domain/public-profile";
import {
  assetStatuses,
  reportStatuses,
  verificationPostStatuses,
  wantedPostStatuses,
  workerApprovalStatuses,
  workSessionStatuses,
} from "@/types/session";
import type { WorkerProfileRecord } from "@/types/profile";
import { projectPath } from "./test-utils";

function supabaseEnumValues(enumName: string) {
  const schema = readFileSync(projectPath("supabase/migrations/0001_initial_schema.sql"), "utf-8");
  const match = schema.match(new RegExp(`create type ${enumName} as enum \\((.*?)\\);`, "s"));
  if (!match) {
    throw new Error(`Missing Supabase enum: ${enumName}`);
  }
  return match[1]
    .split(",")
    .map((value) => value.trim().replaceAll("'", ""));
}

describe("domain models", () => {
  it("keeps Supabase status enums aligned with shared TypeScript statuses", () => {
    expect(supabaseEnumValues("work_session_status")).toEqual([...workSessionStatuses]);
    expect(supabaseEnumValues("verification_post_status")).toEqual([...verificationPostStatuses]);
    expect(supabaseEnumValues("asset_status")).toEqual([...assetStatuses]);
    expect(supabaseEnumValues("worker_approval_status")).toEqual([...workerApprovalStatuses]);
    expect(supabaseEnumValues("wanted_post_status")).toEqual([...wantedPostStatuses]);
    expect(supabaseEnumValues("report_status")).toEqual([...reportStatuses]);
  });

  it("keeps storage asset records portable beyond Supabase Storage", () => {
    const schema = readFileSync(projectPath("supabase/migrations/0001_initial_schema.sql"), "utf-8");
    expect(schema).toContain("storage_bucket text not null default 'verification-assets'");
    expect(schema).toContain("storage_key text not null");
    expect(schema).toContain("insert into storage.buckets");
  });

  it("maps worker profiles without leaking private account fields", () => {
    const privateProfile: WorkerProfileRecord = {
      userId: "user_1",
      email: "worker@example.com",
      phone: "010-0000-0000",
      realName: "홍길동",
      workerName: "새벽기사",
      characterName: "새벽캐릭",
      intro: "장시간 작업 가능",
      jobs: ["궁수"],
      huntingAreas: ["리프레"],
      availableTime: "22:00-02:00",
      priceText: "게임 내 재화 기준",
      openKakaoUrl: "https://open.kakao.com/o/example",
      discordContact: null,
      averageRating: 2.8,
      verificationPostCount: 12,
    };

    const publicProfile = toPublicWorkerProfile(privateProfile);

    expect(publicProfile).toMatchObject({
      userId: "user_1",
      workerName: "새벽기사",
      characterName: "새벽캐릭",
      contacts: { openKakaoUrl: "https://open.kakao.com/o/example" },
    });
    expect(publicProfile).not.toHaveProperty("email");
    expect(publicProfile).not.toHaveProperty("phone");
    expect(publicProfile).not.toHaveProperty("realName");
    expect(JSON.stringify(publicProfile)).not.toContain("worker@example.com");
    expect(JSON.stringify(publicProfile)).not.toContain("010-0000-0000");
    expect(JSON.stringify(publicProfile)).not.toContain("홍길동");
  });
});
