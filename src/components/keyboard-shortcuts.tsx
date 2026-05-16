"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;

      switch (e.key) {
        case "n":
          e.preventDefault();
          router.push("/dashboard/notes/new");
          break;
        case "p":
          e.preventDefault();
          router.push("/dashboard/prompt-builder");
          break;
        // ⌘K is handled by CommandMenu component
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return null;
}
