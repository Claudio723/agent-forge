import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Wrench, Puzzle, BadgeCheck } from "lucide-react";


export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: skills } = await supabase
    .from("skills_mcps")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Skills & MCPs</h1>
          <p className="text-muted-foreground">Your AI tool library</p>
        </div>
        <Button render={<Link href="/dashboard/skills/new" />}>
          <Plus className="mr-2 size-4" />
          Add Skill
        </Button>
      </div>

      {!skills || skills.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3">
            <Wrench className="size-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No skills or MCPs yet</p>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/skills/new" />}>
              <Plus className="mr-2 size-3" />
              Add your first skill
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Link key={skill.id} href={`/dashboard/skills/${skill.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {skill.type === "mcp" ? (
                        <Puzzle className="size-5 text-blue-500" />
                      ) : (
                        <Wrench className="size-5 text-primary" />
                      )}
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                    </div>
                    <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {skill.type === "mcp" ? "MCP" : "Skill"}
                    </span>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {skill.description || "No description"}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
