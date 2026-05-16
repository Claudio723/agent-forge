import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, Wrench, StickyNote, Key } from "lucide-react";
import { QuickCreate } from "@/components/quick-create";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: projects } = await supabase.from("projects").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });

  // Get counts for each project
  const projectIds = projects?.map(p => p.id) ?? [];
  const [{ data: skillCounts }, { data: noteCounts }, { data: vaultCounts }] = await Promise.all([
    supabase.from("project_skills").select("project_id").in("project_id", projectIds),
    supabase.from("project_notes").select("project_id").in("project_id", projectIds),
    supabase.from("project_vault").select("project_id").in("project_id", projectIds),
  ]);

  const counts: Record<string, { skills: number; notes: number; vault: number }> = {};
  projectIds.forEach(id => { counts[id] = { skills: 0, notes: 0, vault: 0 }; });
  skillCounts?.forEach(s => { if (counts[s.project_id]) counts[s.project_id].skills++; });
  noteCounts?.forEach(n => { if (counts[n.project_id]) counts[n.project_id].notes++; });
  vaultCounts?.forEach(v => { if (counts[v.project_id]) counts[v.project_id].vault++; });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">Your central hubs for AI workflows</p>
        </div>
        <QuickCreate type="project" />
      </div>

      {!projects || projects.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3">
            <FolderKanban className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No projects yet</p>
            <QuickCreate type="project" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {projects.map((project) => {
            const c = counts[project.id] || { skills: 0, notes: 0, vault: 0 };
            return (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <Card className="h-full transition-colors hover:bg-muted/50">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge variant="secondary" className="capitalize">{project.status}</Badge>
                    </div>
                    <CardDescription>{project.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><StickyNote className="size-4" />{c.notes} notes</span>
                      <span className="flex items-center gap-1.5"><Wrench className="size-4" />{c.skills} tools</span>
                      <span className="flex items-center gap-1.5"><Key className="size-4" />{c.vault} keys</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
