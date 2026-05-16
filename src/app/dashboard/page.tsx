import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StickyNote, Wrench, FolderKanban, Sparkles, Key, TrendingUp } from "lucide-react";
import Link from "next/link";
import { SeedButton } from "@/components/seed-button";
import { QuickCreate } from "@/components/quick-create";

async function getStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { notes: 0, skills: 0, projects: 0, vault: 0, email: null };

  const userId = user.id;
  const [
    { count: notesCount },
    { count: skillsCount },
    { count: projectsCount },
    { count: vaultCount },
  ] = await Promise.all([
    supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("skills_mcps").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("api_vault").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ]);

  return { notes: notesCount ?? 0, skills: skillsCount ?? 0, projects: projectsCount ?? 0, vault: vaultCount ?? 0, email: user.email };
}

const statCards = [
  { key: "notes", label: "Notes", icon: StickyNote, color: "text-chart-1", bg: "bg-chart-1/10" },
  { key: "skills", label: "Skills & MCPs", icon: Wrench, color: "text-chart-2", bg: "bg-chart-2/10" },
  { key: "projects", label: "Projects", icon: FolderKanban, color: "text-chart-3", bg: "bg-chart-3/10" },
  { key: "vault", label: "API Keys", icon: Key, color: "text-chart-5", bg: "bg-chart-5/10" },
];

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{stats.email ? `, ${stats.email.split("@")[0]}` : ""}
          </h1>
          <p className="mt-1 text-muted-foreground">Here&apos;s what&apos;s happening in your workspace</p>
        </div>
        <SeedButton />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats] as number;
          const isEmpty = value === 0;

          return (
            <Card key={card.key} className="card-elevated border-border/50 transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
                <div className={`flex size-9 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`size-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold tracking-tight">{value}</p>
                {isEmpty && <p className="mt-1 text-xs text-muted-foreground">No {card.label.toLowerCase()} yet</p>}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="size-5 text-primary" />
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <QuickCreate type="note" />
          <QuickCreate type="skill" />
          <QuickCreate type="project" />
          <QuickCreate type="vault" />
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="border-dashed border-border/50 bg-muted/20">
        <CardContent className="flex h-40 flex-col items-center justify-center gap-2">
          <TrendingUp className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Activity feed coming soon</p>
        </CardContent>
      </Card>
    </div>
  );
}
