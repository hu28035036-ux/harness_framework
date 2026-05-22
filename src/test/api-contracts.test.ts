import { describe, expect, it } from "vitest";
import { apiService } from "@/server/api/service";
import type { ApiContext } from "@/server/api/types";

const anonymous: ApiContext = { session: null };
const customer: ApiContext = { session: { userId: "customer_1", roles: ["customer"] } };
const worker: ApiContext = { session: { userId: "worker_1", roles: ["customer", "worker"] } };

describe("api contracts", () => {
  it("accepts valid auth registration and rejects missing fields", () => {
    expect(apiService.register({ email: "a@b.com", password: "pw", nickname: "손님", accountType: "customer" })).toMatchObject({
      ok: true,
      status: 201,
    });
    expect(apiService.register({ email: "a@b.com" })).toMatchObject({
      ok: false,
      status: 422,
      error: { code: "VALIDATION_FAILED" },
    });
  });

  it("requires a worker role for worker-only actions", () => {
    expect(apiService.createPromoPost(customer, { title: "홍보", huntingArea: "리프레", content: "인증 가능" })).toMatchObject({
      ok: false,
      status: 403,
    });
    expect(apiService.createPromoPost(worker, { title: "홍보", huntingArea: "리프레", content: "인증 가능" })).toMatchObject({
      ok: true,
      status: 201,
    });
  });

  it("requires login for customer-created wanted posts", () => {
    expect(apiService.createWantedPost(anonymous, {})).toMatchObject({ ok: false, status: 401 });
    expect(
      apiService.createWantedPost(customer, {
        title: "기사 구함",
        huntingArea: "리프레",
        desiredDuration: 120,
        authMethod: "쩔로그 인증",
        contactMethod: "discord",
      }),
    ).toMatchObject({ ok: true, status: 201 });
  });

  it("returns public worker profile without private fields", () => {
    const result = apiService.getWorkerProfile(worker);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(JSON.stringify(result.data)).not.toContain("private@example.com");
      expect(JSON.stringify(result.data)).not.toContain("010-1111-2222");
      expect(result.data.userId).toBe("worker_1");
    }
  });

  it("covers session transitions and uploads", () => {
    expect(apiService.startSession(worker, { customerNickname: "손님", huntingArea: "리프레", plannedDuration: 180 })).toMatchObject({
      ok: true,
      data: { status: "recording_start" },
    });
    expect(apiService.transitionSession(worker, "session_1", "pause")).toMatchObject({ ok: true, data: { status: "paused" } });
    expect(apiService.uploadCapture(worker, "session_1", { fileUrl: "/a.png", sha256Hash: "hash", capturedAt: "now" })).toMatchObject({
      ok: true,
      status: 201,
    });
    expect(apiService.uploadClip(worker, "session_1", { clipType: "start", durationSec: 30, fileUrl: "/a.mp4", sha256Hash: "hash" })).toMatchObject({
      ok: true,
      status: 201,
    });
  });
});
