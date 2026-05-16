import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FolderKanban, Wrench } from "lucide-react";
import { DeleteProjectButton } from "./delete-button";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!project) notFound();

  const { data: projectSkills } = await supabase
    .from("project_skills")
    .select("skill_id, skills_mcps(name, type)")
    .eq("project_id", id);

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/projects" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-sm text-muted-foreground capitalize">{project.status}</p>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="size-5 text-primary" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{project.description || "No description"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="size-5 text-primary" />
            Linked Skills & MCPs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!projectSkills || projectSkills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills linked yet</p>
          ) : (
            <div className="space-y-2">
              {projectSkills.map((ps) => {
                const skill = Array.isArray(ps.skills_mcps)
                  ? ps.skills_mcps[0]
                  : ps.skills_mcps;
                if (!skill) return null;
                return (
                <div key={ps.skill_id} className="flex items-center gap-2 text-sm">
                  <Wrench className="size-3.5 text-muted-foreground" />
                  <span>{skill.name}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    ({skill.type})
                  </span>
                </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
