import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/app-shell";

describe("navigation shell", () => {
  it("renders desktop and mobile navigation plus mode/theme controls", () => {
    render(
      <AppShell>
        <div>content</div>
      </AppShell>,
    );

    expect(screen.getByRole("navigation", { name: "주요 메뉴" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "모바일 주요 메뉴" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "손님" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "기사" })).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByLabelText("테마")).toHaveValue("system");
    expect(screen.getByRole("link", { name: "로그인" })).toHaveAttribute("href", "#settings");
  });
});
