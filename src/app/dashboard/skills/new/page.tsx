"use client";

import { useActionState } from "react";
import { createSkill } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewSkillPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) =>
      createSkill(formData),
    null,
  );

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/skills" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Skill or MCP</h1>
          <p className="text-muted-foreground">Save a new tool for your library</p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <Input id="name" name="name" required placeholder="e.g. Code Review Assistant" />
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">Type</label>
            <select id="type" name="type" required className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              <option value="skill">Skill</option>
              <option value="mcp">MCP (Model Context Protocol)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">Description</label>
            <Textarea id="description" name="description" placeholder="What does this tool do?" />
          </div>

          <div className="space-y-2">
            <label htmlFor="config" className="text-sm font-medium">Config (JSON)</label>
            <Textarea
              id="config"
              name="config"
              placeholder='{"command": "npx", "args": ["-y", "package-name"]}'
              className="font-mono text-xs"
              rows={6}
            />
          </div>
        </div>

        {state && "error" in state && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={pending}>
          <Save className="mr-2 size-4" />
          {pending ? "Saving..." : "Save Tool"}
        </Button>
      </form>
    </div>
  );
}
