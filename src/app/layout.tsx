import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `${profile.name} · 个人主页`,
  description: profile.tagline,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
