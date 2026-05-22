import { describe, expect, it } from "vitest";
import { apiService } from "@/server/api/service";
import { assertAllowedContent } from "@/server/policy/content-policy";
import { checkPromoCooldown } from "@/server/policy/promo-policy";
import { canSubmitRating, validatePublishReady } from "@/server/policy/verification-policy";
import type { ApiContext } from "@/server/api/types";

const customer: ApiContext = { session: { userId: "customer_1", roles: ["customer"] } };
const worker: ApiContext = { session: { userId: "worker_1", roles: ["customer", "worker"] } };

describe("policy enforcement", () => {
  it("keeps wanted comments worker-only on the server", () => {
    expect(apiService.createWantedComment(customer, "wanted_1", { content: "가능", availableTime: "now", authMethod: "쩔로그" })).toMatchObject({
      ok: false,
      status: 403,
    });
    expect(apiService.createWantedComment(worker, "wanted_1", { content: "가능", availableTime: "now", authMethod: "쩔로그" })).toMatchObject({
      ok: true,
      status: 201,
    });
  });

  it("enforces promo post cooldown with remaining seconds", () => {
    const now = new Date("2026-05-23T00:00:00+09:00");
    const recent = new Date(now.getTime() - 120_000);
    const expired = new Date(now.getTime() - 601_000);

    expect(checkPromoCooldown(now, recent)).toEqual({ ok: false, remainingSeconds: 480 });
    expect(checkPromoCooldown(now, expired)).toEqual({ ok: true, remainingSeconds: 0 });
  });

  it("rejects banned payment, automation, and tampering content", () => {
    expect(assertAllowedContent("계좌이체 가능")).toMatchObject({ ok: false, code: "REAL_MONEY" });
    expect(assertAllowedContent("자동사냥 매크로")).toMatchObject({ ok: false, code: "AUTO_PLAY" });
    expect(assertAllowedContent("패킷 분석")).toMatchObject({ ok: false, code: "CLIENT_TAMPERING" });
    expect(assertAllowedContent("쩔로그 인증캡처와 30초 클립 가능")).toEqual({ ok: true });
  });

  it("blocks publishing when required verification assets are missing or failed", () => {
    expect(
      validatePublishReady({
        customerNickname: "",
        huntingArea: "리프레",
        assets: [{ kind: "capture", status: "uploaded" }],
      }),
    ).toMatchObject({ ok: false });

    expect(
      validatePublishReady({
        customerNickname: "손님",
        huntingArea: "리프레",
        assets: [
          { kind: "capture", status: "uploaded" },
          { kind: "clip", clipType: "start", status: "uploaded" },
          { kind: "clip", clipType: "end", status: "retry_pending" },
        ],
      }),
    ).toMatchObject({ ok: false });

    expect(
      validatePublishReady({
        customerNickname: "손님",
        huntingArea: "리프레",
        assets: [
          { kind: "capture", status: "uploaded" },
          { kind: "clip", clipType: "start", status: "uploaded" },
          { kind: "clip", clipType: "end", status: "uploaded" },
        ],
      }),
    ).toEqual({ ok: true, errors: [] });
  });

  it("allows a rating token only once", () => {
    expect(canSubmitRating("token_1", [])).toBe(true);
    expect(canSubmitRating("token_1", ["token_1"])).toBe(false);
    expect(apiService.submitRating("token_1", { score: 3, submittedTokens: ["token_1"] })).toMatchObject({
      ok: false,
      status: 409,
      error: { code: "RATING_ALREADY_SUBMITTED" },
    });
  });
});
