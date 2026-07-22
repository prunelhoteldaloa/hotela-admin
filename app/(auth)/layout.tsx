import type React from "react";
import { Logo } from "@/components/logo";
import { ModeToggle } from "@/components/mode-toggle";
// import { LanguageSelector } from "@/components/language-selector";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="">{children}</main>
    </div>
  );
}
