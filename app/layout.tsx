import type { Metadata } from "next";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "王化康 · Kyson — Sightes 外贸运营",
  description:
    "王化康（Kyson）— Sightes 外贸运营 · 光纤产品。把产品、客户与交付连成清晰链路。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="font-sans bg-apple-bg text-apple-ink antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
