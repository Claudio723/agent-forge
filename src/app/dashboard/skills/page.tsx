import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Wrench, Puzzle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SkillsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: skills } = await supabase.from("skills_mcps").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Skills &amp; MCPs</h1>
          <p className="text-sm text-muted-foreground">Your AI tool library</p>
        </div>
        <Button render={<Link href="/dashboard/skills/new" />}><Plus />Add Tool</Button>
      </div>

      {!skills || skills.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3">
            <Wrench className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No skills or MCPs yet</p>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/skills/new" />}><Plus />Add your first tool</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Link key={skill.id} href={`/dashboard/skills/${skill.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {skill.type === "mcp" ? <Puzzle className="size-5 text-blue-500" /> : <Wrench className="size-5 text-primary" />}
                      <CardTitle className="text-base">{skill.name}</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs capitalize">{skill.type}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">{skill.description || "No description"}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
