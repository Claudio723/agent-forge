import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StickyNote,
  Wrench,
  FolderKanban,
  Sparkles,
  Plus,
  Key,
} from "lucide-react";
import Link from "next/link";
import { SeedButton } from "@/components/seed-button";

async function getStats() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { notes: 0, skills: 0, projects: 0, vault: 0, email: null };

  const userId = user.id;

  const [
    { count: notesCount },
    { count: skillsCount },
    { count: projectsCount },
    { count: vaultCount },
  ] = await Promise.all([
    supabase
      .from("notes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("skills_mcps")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase
      .from("api_vault")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  return {
    notes: notesCount ?? 0,
    skills: skillsCount ?? 0,
    projects: projectsCount ?? 0,
    vault: vaultCount ?? 0,
    email: user.email,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back{stats.email ? `, ${stats.email}` : ""}
          </p>
        </div>
        <SeedButton />
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notes
            </CardTitle>
            <StickyNote className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.notes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Skills & MCPs
            </CardTitle>
            <Wrench className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.skills}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Projects
            </CardTitle>
            <FolderKanban className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.projects}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vault Keys
            </CardTitle>
            <Key className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.vault}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button render={<Link href="/dashboard/notes/new" />}>
            <Plus className="mr-2 size-4" />
            New Note
          </Button>
          <Button
            variant="outline"
            render={<Link href="/dashboard/prompt-builder" />}
          >
            <Sparkles className="mr-2 size-4" />
            Prompt Builder
          </Button>
          <Button
            variant="outline"
            render={<Link href="/dashboard/skills/new" />}
          >
            <Wrench className="mr-2 size-4" />
            Add Skill
          </Button>
        </div>
      </div>

      {/* Placeholder: Recent Activity */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
        <Card className="border-dashed">
          <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
            <p>Activity feed coming in Phase 3</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
