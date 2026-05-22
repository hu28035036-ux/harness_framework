import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "쩔로그",
  description: "작업 인증과 기사 탐색을 위한 쩔로그 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
