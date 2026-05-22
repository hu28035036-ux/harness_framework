const PROMO_COOLDOWN_SECONDS = 600;

export function checkPromoCooldown(now: Date, lastCreatedAt?: Date | null) {
  if (!lastCreatedAt) {
    return { ok: true as const, remainingSeconds: 0 };
  }

  const elapsedSeconds = Math.floor((now.getTime() - lastCreatedAt.getTime()) / 1000);
  const remainingSeconds = Math.max(PROMO_COOLDOWN_SECONDS - elapsedSeconds, 0);

  if (remainingSeconds > 0) {
    return { ok: false as const, remainingSeconds };
  }

  return { ok: true as const, remainingSeconds: 0 };
}
