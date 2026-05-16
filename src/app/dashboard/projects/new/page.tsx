"use client";

import { useActionState } from "react";
import { createProject } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => createProject(formData),
    null,
  );

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/projects" />}><ArrowLeft /></Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
          <p className="text-sm text-muted-foreground">Group related tools and notes</p>
        </div>
      </div>
      <Separator />
      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="e.g. Code Review Pipeline" /></div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="What is this project about?" /></div>
          <div className="space-y-2"><Label htmlFor="status">Status</Label>
            <select id="status" name="status" className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
              <option value="active">Active</option><option value="ideation">Ideation</option><option value="paused">Paused</option><option value="completed">Completed</option>
            </select>
          </div>
        </div>
        {state && "error" in state && <p className="text-sm text-destructive">{state.error}</p>}
        <div className="flex justify-end"><Button type="submit" disabled={pending} size="lg"><Save />{pending ? "Creating..." : "Create Project"}</Button></div>
      </form>
    </div>
  );
}
