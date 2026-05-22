import type { ReactNode } from "react";

type StatusTone = "success" | "warning" | "danger" | "neutral";

const toneClass: Record<StatusTone, string> = {
  success: "border-[var(--accent)] text-[var(--accent-strong)]",
  warning: "border-[var(--warning)] text-[var(--warning)]",
  danger: "border-[var(--danger)] text-[var(--danger)]",
  neutral: "border-[var(--border)] text-[var(--foreground)]",
};

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: StatusTone;
}) {
  return (
    <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-semibold ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
