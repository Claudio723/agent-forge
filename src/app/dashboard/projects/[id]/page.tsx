import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FolderKanban, Wrench, StickyNote, Key, Puzzle, Trash2, Plus, X } from "lucide-react";
import { DeleteProjectButton } from "./delete-button";
import { QuickCreate } from "@/components/quick-create";
import { LinkExisting } from "./link-existing";
import { formatDistanceToNow } from "date-fns";
import { unlinkNoteFromProject, unlinkVaultFromProject } from "@/app/dashboard/actions";
import { UnlinkButton } from "./unlink-button";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).eq("user_id", user!.id).single();
  if (!project) notFound();

  // Linked skills
  const { data: projectSkills } = await supabase.from("project_skills").select("skill_id, skills_mcps!inner(id,name,description,type)").eq("project_id", id);

  // Linked notes
  const { data: projectNotes } = await supabase.from("project_notes").select("note_id, notes!inner(id,title,category,tags,updated_at)").eq("project_id", id).order("note_id", { ascending: false });

  // Linked vault entries
  const { data: projectVaults } = await supabase.from("project_vault").select("vault_id, api_vault!inner(id,alias,service)").eq("project_id", id);

  // Available unlinked items
  const { data: availableNotes } = await supabase.from("notes").select("id,title").eq("user_id", user!.id).order("updated_at", { ascending: false });
  const { data: availableSkills } = await supabase.from("skills_mcps").select("id,name,type").eq("user_id", user!.id).order("name");
  const { data: availableVaults } = await supabase.from("api_vault").select("id,alias").eq("user_id", user!.id).order("alias");

  const linkedNoteIds = new Set((projectNotes ?? []).map((n: { note_id: string }) => n.note_id));
  const linkedSkillIds = new Set((projectSkills ?? []).map((s: { skill_id: string }) => s.skill_id));
  const linkedVaultIds = new Set((projectVaults ?? []).map((v: { vault_id: string }) => v.vault_id));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/projects" />}><ArrowLeft /></Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="capitalize">{project.status}</Badge>
            {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
          </div>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <Separator />

      {/* Skills Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Wrench className="size-5" />Skills &amp; MCPs</h2>
          <div className="flex gap-2">
            <LinkExisting projectId={id} type="skill" available={availableSkills?.filter(s => !linkedSkillIds.has(s.id)).map(s => ({ id: s.id, label: `${s.name} (${s.type})` })) ?? []} />
            <QuickCreate type="skill" />
          </div>
        </div>
        {(!projectSkills || projectSkills.length === 0) ? (
          <Card className="border-dashed"><CardContent className="flex h-20 flex-col items-center justify-center"><p className="text-sm text-muted-foreground">No skills linked</p></CardContent></Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectSkills.map((ps: { skill_id: string; skills_mcps: { id: string; name: string; description: string; type: string }[] }) => {
              const skill = ps.skills_mcps[0]; if (!skill) return null; return (
              <Card key={ps.skill_id} className="group relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    {skill.type === "mcp" ? <Puzzle className="size-4 text-blue-500" /> : <Wrench className="size-4" />}
                    <CardTitle className="text-sm">{skill.name}</CardTitle>
                    <Badge variant="secondary" className="text-[10px] capitalize">{skill.type}</Badge>
                  </div>
                  <CardDescription className="line-clamp-1 text-xs">{skill.description || "No description"}</CardDescription>
                </CardHeader>
              </Card>
            ); })}
          </div>
        )}
      </section>

      <Separator />

      {/* Notes Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><StickyNote className="size-5" />Notes</h2>
          <div className="flex gap-2">
            <LinkExisting projectId={id} type="note" available={availableNotes?.filter(n => !linkedNoteIds.has(n.id)).map(n => ({ id: n.id, label: n.title })) ?? []} />
            <QuickCreate type="note" />
          </div>
        </div>
        {(!projectNotes || projectNotes.length === 0) ? (
          <Card className="border-dashed"><CardContent className="flex h-20 flex-col items-center justify-center"><p className="text-sm text-muted-foreground">No notes linked</p></CardContent></Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectNotes.map((pn: { note_id: string; notes: { id: string; title: string; category: string; tags: string[]; updated_at: string }[] }) => {
              const note = pn.notes[0]; if (!note) return null; return (
              <Link key={pn.note_id} href={`/dashboard/notes/${note.id}`}>
                <Card className="group relative h-full transition-colors hover:bg-muted/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="truncate text-sm">{note.title}</CardTitle>
                      <UnlinkButton action={unlinkNoteFromProject.bind(null, id, pn.note_id)} />
                    </div>
                    <CardDescription className="text-xs">
                      {note.category && <span className="capitalize">{note.category} · </span>}
                      {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ); })}
          </div>
        )}
      </section>

      <Separator />

      {/* API Vault Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold"><Key className="size-5" />API Keys</h2>
          <div className="flex gap-2">
            <LinkExisting projectId={id} type="vault" available={availableVaults?.filter(v => !linkedVaultIds.has(v.id)).map(v => ({ id: v.id, label: v.alias })) ?? []} />
            <QuickCreate type="vault" />
          </div>
        </div>
        {(!projectVaults || projectVaults.length === 0) ? (
          <Card className="border-dashed"><CardContent className="flex h-20 flex-col items-center justify-center"><p className="text-sm text-muted-foreground">No API keys linked</p></CardContent></Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectVaults.map((pv: { vault_id: string; api_vault: { id: string; alias: string; service: string }[] }) => {
              const v = pv.api_vault[0]; if (!v) return null; return (
              <Card key={pv.vault_id} className="group relative">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Key className="size-4" />
                      <CardTitle className="text-sm">{v.alias}</CardTitle>
                    </div>
                    <UnlinkButton action={unlinkVaultFromProject.bind(null, id, pv.vault_id)} />
                  </div>
                  <CardDescription className="text-xs capitalize">{v.service}</CardDescription>
                </CardHeader>
              </Card>
            ); })}
          </div>
        )}
      </section>
    </div>
  );
}
