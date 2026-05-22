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

function prismaEnumValues(enumName: string) {
  const schema = readFileSync(projectPath("prisma/schema.prisma"), "utf-8");
  const match = schema.match(new RegExp(`enum ${enumName} \\{([\\s\\S]*?)\\}`));
  if (!match) {
    throw new Error(`Missing Prisma enum: ${enumName}`);
  }
  return match[1]
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("//"))
    .map((line) => line.split(/\s+/)[0]);
}

describe("domain models", () => {
  it("keeps Prisma status enums aligned with shared TypeScript statuses", () => {
    expect(prismaEnumValues("WorkSessionStatus")).toEqual([...workSessionStatuses]);
    expect(prismaEnumValues("VerificationPostStatus")).toEqual([...verificationPostStatuses]);
    expect(prismaEnumValues("AssetStatus")).toEqual([...assetStatuses]);
    expect(prismaEnumValues("WorkerApprovalStatus")).toEqual([...workerApprovalStatuses]);
    expect(prismaEnumValues("WantedPostStatus")).toEqual([...wantedPostStatuses]);
    expect(prismaEnumValues("ReportStatus")).toEqual([...reportStatuses]);
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
