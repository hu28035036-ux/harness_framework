import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("marketplace pages", () => {
  it("renders worker list filters, public profile, promo posts, wanted form, details, and comment policy", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: "기사목록" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "인증 가능" })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { name: "새벽기사" }).length).toBeGreaterThan(0);
    expect(screen.getByText("다른 작업물 · 쩔로그 인증 X")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "작업 홍보 게시글" })).toBeInTheDocument();

    const wantedForm = screen.getByRole("form", { name: "기사구함 작성 폼" });
    expect(within(wantedForm).getByLabelText("제목")).toBeInTheDocument();
    expect(within(wantedForm).getByLabelText("서버")).toHaveValue("루나");
    expect(within(wantedForm).getByRole("button", { name: "기사구함 작성" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "기사구함 상세" })).toBeInTheDocument();
    expect(screen.getByText("댓글 작성은 로그인한 기사 계정만 가능합니다.")).toBeInTheDocument();
  });

  it("does not expose disallowed external messenger buttons", () => {
    render(<Home />);

    expect(screen.queryByText("카카오톡")).not.toBeInTheDocument();
    expect(screen.queryByText("디스코드")).not.toBeInTheDocument();
  });
});
