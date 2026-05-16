import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StickyNote, Wrench, FolderKanban, Key, TrendingUp, Clock, Puzzle } from "lucide-react";
import Link from "next/link";
import { SeedButton } from "@/components/seed-button";
import { QuickCreate } from "@/components/quick-create";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { stats: { notes: 0, skills: 0, projects: 0, vault: 0 }, recentNotes: [], recentSkills: [], recentProjects: [], email: null };

  const userId = user.id;
  const [
    { count: notesCount }, { count: skillsCount }, { count: projectsCount }, { count: vaultCount },
    { data: recentNotes }, { data: recentSkills }, { data: recentProjects },
  ] = await Promise.all([
    supabase.from("notes").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("skills_mcps").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("api_vault").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("notes").select("id,title,category,tags,updated_at").eq("user_id", userId).order("updated_at", { ascending: false }).limit(4),
    supabase.from("skills_mcps").select("id,name,description,type").eq("user_id", userId).order("created_at", { ascending: false }).limit(4),
    supabase.from("projects").select("id,name,status").eq("user_id", userId).order("created_at", { ascending: false }).limit(4),
  ]);

  return {
    stats: { notes: notesCount ?? 0, skills: skillsCount ?? 0, projects: projectsCount ?? 0, vault: vaultCount ?? 0 },
    recentNotes: recentNotes ?? [], recentSkills: recentSkills ?? [], recentProjects: recentProjects ?? [],
    email: user.email,
  };
}

export default async function DashboardPage() {
  const { stats, recentNotes, recentSkills, recentProjects, email } = await getDashboardData();

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back{email ? `, ${email.split("@")[0]}` : ""}</h1>
          <p className="mt-1 text-muted-foreground">Here&apos;s your workspace at a glance</p>
        </div>
        <SeedButton />
      </div>

      <section aria-label="Statistics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/dashboard/notes"><Card className="transition-colors hover:bg-muted/50"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle><StickyNote className="size-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-bold tracking-tight">{stats.notes}</p></CardContent></Card></Link>
        <Link href="/dashboard/skills"><Card className="transition-colors hover:bg-muted/50"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Skills &amp; MCPs</CardTitle><Wrench className="size-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-bold tracking-tight">{stats.skills}</p></CardContent></Card></Link>
        <Link href="/dashboard/projects"><Card className="transition-colors hover:bg-muted/50"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle><FolderKanban className="size-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-bold tracking-tight">{stats.projects}</p></CardContent></Card></Link>
        <Link href="/dashboard/vault"><Card className="transition-colors hover:bg-muted/50"><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">API Keys</CardTitle><Key className="size-5 text-muted-foreground" /></CardHeader><CardContent><p className="text-3xl font-bold tracking-tight">{stats.vault}</p></CardContent></Card></Link>
      </section>

      <section aria-label="Quick create">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold"><TrendingUp className="size-5" />Quick Create</h2>
        <div className="flex flex-wrap gap-3"><QuickCreate type="note" /><QuickCreate type="skill" /><QuickCreate type="project" /><QuickCreate type="vault" /></div>
      </section>

      <section aria-label="Recent items" className="space-y-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><Clock className="size-5" />Recent</h2>

        {recentNotes.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Latest Notes</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentNotes.map((note: { id: string; title: string; category?: string; tags?: string[]; updated_at: string }) => (
                <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="truncate text-sm">{note.title}</CardTitle>
                      <CardDescription className="text-xs">{note.category && <span className="capitalize">{note.category} · </span>}{formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}</CardDescription>
                    </CardHeader>
                    {note.tags && note.tags.length > 0 && (
                      <CardContent className="pt-0"><div className="flex flex-wrap gap-1">{note.tags.slice(0, 3).map((tag: string) => <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>)}</div></CardContent>
                    )}
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentSkills.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Latest Tools</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentSkills.map((skill: { id: string; name: string; description?: string; type: string }) => (
                <Link key={skill.id} href={`/dashboard/skills/${skill.id}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        {skill.type === "mcp" ? <Puzzle className="size-4 text-blue-500" /> : <Wrench className="size-4" />}
                        <CardTitle className="truncate text-sm">{skill.name}</CardTitle>
                      </div>
                      <CardDescription className="line-clamp-1 text-xs">{skill.description || "No description"}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentProjects.length > 0 && (
          <div>
            <h3 className="mb-3 text-sm font-medium text-muted-foreground">Latest Projects</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {recentProjects.map((project: { id: string; name: string; status: string }) => (
                <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                  <Card className="h-full transition-colors hover:bg-muted/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="truncate text-sm">{project.name}</CardTitle>
                        <Badge variant="secondary" className="text-[10px] capitalize">{project.status}</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {recentNotes.length === 0 && recentSkills.length === 0 && recentProjects.length === 0 && (
          <Card className="border-dashed"><CardContent className="flex h-32 flex-col items-center justify-center gap-2"><Clock className="size-8 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">Nothing here yet. Create something above!</p></CardContent></Card>
        )}
      </section>
    </div>
  );
}
