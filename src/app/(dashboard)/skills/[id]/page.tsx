import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Wrench, Puzzle } from "lucide-react";
import { DeleteSkillButton } from "./delete-button";

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: skill } = await supabase
    .from("skills_mcps")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!skill) notFound();

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/skills" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{skill.name}</h1>
          <p className="text-sm text-muted-foreground capitalize">{skill.type}</p>
        </div>
        <DeleteSkillButton skillId={skill.id} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {skill.type === "mcp" ? (
              <Puzzle className="size-5 text-blue-500" />
            ) : (
              <Wrench className="size-5 text-primary" />
            )}
            {skill.type === "mcp" ? "MCP" : "Skill"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p>{skill.description || "No description"}</p>
          </div>

          {skill.config && Object.keys(skill.config).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Configuration</h3>
              <pre className="rounded-lg bg-muted p-4 text-xs font-mono overflow-auto">
                {JSON.stringify(skill.config, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
