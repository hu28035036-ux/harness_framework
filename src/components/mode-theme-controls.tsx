"use client";

import { useEffect, useState } from "react";

type ThemeMode = "system" | "dark" | "light";
type UserMode = "customer" | "worker";

const themeLabels: Record<ThemeMode, string> = {
  system: "시스템",
  dark: "다크",
  light: "화이트",
};

export function ModeThemeControls() {
  const [userMode, setUserMode] = useState<UserMode>("customer");
  const [theme, setTheme] = useState<ThemeMode>("system");

  useEffect(() => {
    if (theme === "system") {
      document.documentElement.removeAttribute("data-theme");
      return;
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <div aria-label="사용자 모드" className="inline-grid grid-cols-2 rounded-md border border-[var(--border)] p-1">
        <button
          aria-pressed={userMode === "customer"}
          className={`rounded px-3 py-1.5 ${userMode === "customer" ? "bg-[var(--accent)] font-semibold text-white" : ""}`}
          onClick={() => setUserMode("customer")}
          type="button"
        >
          손님
        </button>
        <button
          aria-pressed={userMode === "worker"}
          className={`rounded px-3 py-1.5 ${userMode === "worker" ? "bg-[var(--accent)] font-semibold text-white" : ""}`}
          onClick={() => setUserMode("worker")}
          type="button"
        >
          기사
        </button>
      </div>

      <label className="sr-only" htmlFor="theme-mode">
        테마
      </label>
      <select
        className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2"
        id="theme-mode"
        onChange={(event) => setTheme(event.target.value as ThemeMode)}
        value={theme}
      >
        {Object.entries(themeLabels).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <a className="rounded-md bg-[var(--accent)] px-3 py-2 font-semibold text-white" href="#settings">
        로그인
      </a>
    </div>
  );
}
