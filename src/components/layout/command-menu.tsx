"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  StickyNote,
  Wrench,
  Sparkles,
  FolderKanban,
  Key,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { logout } from "@/app/(auth)/actions";

export function CommandMenu() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  function navigate(href: string) {
    setOpen(false);
    router.push(href);
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.push("/");
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 size-4" />
            Dashboard
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/notes")}>
            <StickyNote className="mr-2 size-4" />
            Notes
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/skills")}>
            <Wrench className="mr-2 size-4" />
            Skills & MCPs
          </CommandItem>
          <CommandItem
            onSelect={() => navigate("/dashboard/prompt-builder")}
          >
            <Sparkles className="mr-2 size-4" />
            Prompt Builder
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/projects")}>
            <FolderKanban className="mr-2 size-4" />
            Projects
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/vault")}>
            <Key className="mr-2 size-4" />
            API Vault
          </CommandItem>
          <CommandItem onSelect={() => navigate("/dashboard/settings")}>
            <Settings className="mr-2 size-4" />
            Settings
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          >
            {theme === "dark" ? (
              <Sun className="mr-2 size-4" />
            ) : (
              <Moon className="mr-2 size-4" />
            )}
            Toggle theme
          </CommandItem>
          <CommandItem onSelect={handleLogout}>
            <LogOut className="mr-2 size-4" />
            Logout
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
