"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { CommandMenu } from "@/components/layout/command-menu";
import { KeyboardShortcuts } from "@/components/keyboard-shortcuts";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (!isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <KeyboardShortcuts />
      <Sidebar />
      <CommandMenu />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
