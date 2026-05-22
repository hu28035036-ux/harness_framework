import type { ReactNode } from "react";
import { navigationTabs } from "@/domain/foundation-data";
import { ModeThemeControls } from "./mode-theme-controls";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-[var(--background)] pb-20 text-[var(--foreground)] lg:pb-0">
      <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <a aria-label="쩔로그 메인으로 이동" className="w-fit" href="#main">
            <p className="text-sm font-semibold text-[var(--accent)]">ZzalLog MVP</p>
            <h1 className="text-2xl font-semibold">쩔로그</h1>
          </a>
          <nav aria-label="주요 메뉴" className="desktop-main-nav flex-wrap gap-2">
            {navigationTabs.map((tab) => (
              <a
                className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface-muted)]"
                href={tab.href}
                key={tab.label}
              >
                {tab.label}
              </a>
            ))}
          </nav>
          <ModeThemeControls />
        </div>
      </header>

      {children}

      <nav
        aria-label="모바일 주요 메뉴"
        className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-30 grid-cols-6 border-t border-[var(--border)] bg-[var(--surface)]"
      >
        {navigationTabs.map((tab) => (
          <a
            className="flex min-h-14 items-center justify-center px-1 text-center text-xs hover:bg-[var(--surface-muted)]"
            href={tab.href}
            key={tab.label}
          >
            {tab.shortLabel}
          </a>
        ))}
      </nav>
    </main>
  );
}
