const bannedPatterns = [
  { code: "REAL_MONEY", pattern: /(현금|계좌|계좌이체|상품권|외부\s*결제|카드결제|토스|문화상품권)/i },
  { code: "AUTO_PLAY", pattern: /(자동\s*사냥|자동사냥|매크로|자동\s*키입력|마우스\s*자동|거짓말탐지기\s*자동)/i },
  { code: "CLIENT_TAMPERING", pattern: /(메모리\s*읽기|패킷\s*분석|클라이언트\s*변조)/i },
];

export function findPolicyViolation(text: string) {
  return bannedPatterns.find(({ pattern }) => pattern.test(text)) ?? null;
}

export function assertAllowedContent(text: string) {
  const violation = findPolicyViolation(text);
  if (!violation) {
    return { ok: true as const };
  }
  return {
    ok: false as const,
    code: violation.code,
    message: "현금거래, 자동사냥, 매크로, 클라이언트 변조 관련 문구는 사용할 수 없습니다.",
  };
}
