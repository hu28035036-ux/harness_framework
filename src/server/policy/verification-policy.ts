import type { AssetStatus } from "@/types/session";

export type PublishAsset = {
  kind: "capture" | "clip";
  status: AssetStatus;
  clipType?: "start" | "middle" | "resume" | "end";
};

export type PublishCheckInput = {
  customerNickname?: string | null;
  huntingArea?: string | null;
  assets: readonly PublishAsset[];
};

export function validatePublishReady(input: PublishCheckInput) {
  const errors: string[] = [];
  if (!input.customerNickname) errors.push("손님 닉네임이 필요합니다.");
  if (!input.huntingArea) errors.push("사냥터가 필요합니다.");
  if (!input.assets.some((asset) => asset.kind === "capture" && asset.status === "uploaded")) {
    errors.push("업로드된 인증캡처가 필요합니다.");
  }
  if (!input.assets.some((asset) => asset.kind === "clip" && asset.clipType === "start" && asset.status === "uploaded")) {
    errors.push("업로드된 시작 30초 클립이 필요합니다.");
  }
  if (!input.assets.some((asset) => asset.kind === "clip" && asset.clipType === "end" && asset.status === "uploaded")) {
    errors.push("업로드된 종료 30초 클립이 필요합니다.");
  }
  if (input.assets.some((asset) => asset.status === "failed" || asset.status === "retry_pending")) {
    errors.push("업로드 실패 또는 재시도 대기 자료가 남아 있습니다.");
  }

  return {
    ok: errors.length === 0,
    errors,
  };
}

export function canSubmitRating(customerToken: string, submittedTokens: readonly string[]) {
  return !submittedTokens.includes(customerToken);
}
