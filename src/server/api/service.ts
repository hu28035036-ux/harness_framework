import { hasRole } from "@/server/auth/session";
import { toPublicWorkerProfile } from "@/domain/public-profile";
import type { WorkerProfileRecord } from "@/types/profile";
import type { ApiContext, ApiResult } from "./types";
import { fail, ok, requireFields } from "./result";

const demoWorkerProfile: WorkerProfileRecord = {
  userId: "worker_demo",
  email: "private@example.com",
  phone: "010-1111-2222",
  realName: "비공개",
  workerName: "새벽기사",
  characterName: "새벽캐릭",
  intro: "경험치바 툴팁 인증과 30초 클립을 남깁니다.",
  jobs: ["궁수"],
  huntingAreas: ["리프레"],
  availableTime: "22:00-02:00",
  priceText: "게임 내 재화 기준",
  openKakaoUrl: null,
  discordContact: "worker#0001",
  averageRating: 3,
  verificationPostCount: 0,
};

export const apiService = {
  register(input: Record<string, unknown>) {
    const invalid = requireFields(input, ["email", "password", "nickname", "accountType"]);
    if (invalid) return invalid;
    return ok({ userId: "user_new", nickname: input.nickname, accountType: input.accountType }, 201);
  },

  login(input: Record<string, unknown>) {
    const invalid = requireFields(input, ["email", "password"]);
    if (invalid) return invalid;
    return ok({ token: "mvp-session-token", userId: "user_demo" });
  },

  getWorkerProfile(context: ApiContext) {
    if (!context.session) return fail("UNAUTHORIZED", "Login is required.", 401);
    return ok(toPublicWorkerProfile({ ...demoWorkerProfile, userId: context.session.userId }));
  },

  updateWorkerProfile(context: ApiContext, input: Record<string, unknown>) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const invalid = requireFields(input, ["workerName", "characterName", "intro"]);
    if (invalid) return invalid;
    return ok({ updated: true, workerName: input.workerName });
  },

  createPromoPost(context: ApiContext, input: Record<string, unknown>) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const invalid = requireFields(input, ["title", "huntingArea", "content"]);
    if (invalid) return invalid;
    return ok({ id: "promo_new", status: "published" }, 201);
  },

  listWantedPosts() {
    return ok({ items: [], filters: ["huntingArea", "desiredDuration", "authMethod", "status"] });
  },

  createWantedPost(context: ApiContext, input: Record<string, unknown>) {
    if (!context.session) return fail("UNAUTHORIZED", "Login is required.", 401);
    const invalid = requireFields(input, ["title", "huntingArea", "desiredDuration", "authMethod", "contactMethod"]);
    if (invalid) return invalid;
    return ok({ id: "wanted_new", status: "open" }, 201);
  },

  createWantedComment(context: ApiContext, wantedPostId: string, input: Record<string, unknown>) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const invalid = requireFields(input, ["content", "availableTime", "authMethod"]);
    if (invalid) return invalid;
    return ok({ id: "comment_new", wantedPostId, status: "published" }, 201);
  },

  startSession(context: ApiContext, input: Record<string, unknown>) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const invalid = requireFields(input, ["customerNickname", "huntingArea", "plannedDuration"]);
    if (invalid) return invalid;
    return ok({ id: "session_new", status: "recording_start" }, 201);
  },

  transitionSession(context: ApiContext, sessionId: string, action: string): ApiResult<{ id: string; status: string }> {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const statusByAction: Record<string, string> = {
      pause: "paused",
      hold: "held",
      resume: "resumed",
      complete: "completed",
    };
    return ok({ id: sessionId, status: statusByAction[action] ?? "in_progress" });
  },

  uploadCapture(context: ApiContext, sessionId: string, input: Record<string, unknown>) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const invalid = requireFields(input, ["fileUrl", "sha256Hash", "capturedAt"]);
    if (invalid) return invalid;
    return ok({ id: "capture_new", sessionId, status: "uploaded" }, 201);
  },

  uploadClip(context: ApiContext, sessionId: string, input: Record<string, unknown>) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    const invalid = requireFields(input, ["clipType", "durationSec", "fileUrl", "sha256Hash"]);
    if (invalid) return invalid;
    return ok({ id: "clip_new", sessionId, status: "uploaded" }, 201);
  },

  publishVerificationPost(context: ApiContext, postId: string) {
    if (!hasRole(context.session, "worker")) return fail("FORBIDDEN", "Worker role is required.", 403);
    return ok({ id: postId, status: "published", customerLinkToken: "customer_token_demo" });
  },

  submitRating(token: string, input: Record<string, unknown>) {
    const invalid = requireFields(input, ["score"]);
    if (invalid) return invalid;
    return ok({ token, score: input.score, accepted: true }, 201);
  },

  listScammerReports(context: ApiContext) {
    if (!hasRole(context.session, "admin")) return fail("FORBIDDEN", "Admin role is required.", 403);
    return ok({ items: [] });
  },

  createScammerReport(context: ApiContext, input: Record<string, unknown>) {
    if (!context.session) return fail("UNAUTHORIZED", "Login is required.", 401);
    const invalid = requireFields(input, ["targetText", "reason"]);
    if (invalid) return invalid;
    return ok({ id: "report_new", status: "received" }, 201);
  },

  listScammerEntries() {
    return ok({ items: [] });
  },

  appVersion() {
    return ok({
      latest_version: "1.0.0",
      minimum_version: "1.0.0",
      force_update: false,
      download_url: "https://zzallog.example/download/app-1.0.0.exe",
      release_notes: ["MVP bootstrap"],
    });
  },
};
