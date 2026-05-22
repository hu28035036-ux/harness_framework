import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";

describe("trust and settings pages", () => {
  it("renders scammer report list with public columns only", () => {
    render(<Home />);

    const scammerSection = screen.getByRole("heading", { name: "사기꾼 정보" }).closest("section");
    expect(scammerSection).not.toBeNull();
    expect(within(scammerSection as HTMLElement).getByText("기사명, 캐릭터명, 유형, 상태만 공개")).toBeInTheDocument();
    expect(within(scammerSection as HTMLElement).getByRole("columnheader", { name: "기사명" })).toBeInTheDocument();
    expect(within(scammerSection as HTMLElement).getByRole("columnheader", { name: "캐릭터명" })).toBeInTheDocument();
    expect(within(scammerSection as HTMLElement).getByRole("columnheader", { name: "유형" })).toBeInTheDocument();
    expect(within(scammerSection as HTMLElement).getByRole("columnheader", { name: "상태" })).toBeInTheDocument();
    expect(within(scammerSection as HTMLElement).getByRole("form", { name: "사기꾼 제보 폼" })).toBeInTheDocument();
  });

  it("renders feedback form and settings account controls", () => {
    render(<Home />);

    expect(screen.getByRole("form", { name: "오류 및 건의사항 작성 폼" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "등록" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "설정" })).toBeInTheDocument();
    expect(screen.getByText("닉네임")).toBeInTheDocument();
    expect(screen.getByText("손님계정")).toBeInTheDocument();
    expect(screen.getByText("이메일")).toBeInTheDocument();
    expect(screen.getByText("비공개")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "비밀번호 변경" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "기사 전환 신청" })).toBeInTheDocument();
  });

  it("does not render sensitive personal data labels in public trust surfaces", () => {
    render(<Home />);

    expect(screen.queryByText("실명")).not.toBeInTheDocument();
    expect(screen.queryByText("전화번호")).not.toBeInTheDocument();
    expect(screen.queryByText("IP")).not.toBeInTheDocument();
    expect(screen.queryByText("계좌번호")).not.toBeInTheDocument();
  });
});
