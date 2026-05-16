"use client";

import { useActionState } from "react";
import { createNote } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const moods = ["excited", "productive", "curious", "focused", "reflective"];

export default function NewNotePage() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => createNote(formData),
    null,
  );

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/notes" />}><ArrowLeft /></Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New Note</h1>
          <p className="text-sm text-muted-foreground">Capture an idea, thought, or insight</p>
        </div>
      </div>
      <Separator />
      <form action={formAction} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required placeholder="What's on your mind?" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" name="category" placeholder="e.g. ideas, tips, research" /></div>
            <div className="space-y-2"><Label htmlFor="tags">Tags</Label><Input id="tags" name="tags" placeholder="comma, separated" /></div>
          </div>
          <div className="space-y-2">
            <Label>Mood</Label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <label key={m}>
                  <input type="radio" name="mood" value={m} className="peer sr-only" />
                  <span className="inline-flex cursor-pointer items-center rounded-md border px-3 py-1.5 text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-muted">{m}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-base">Content</CardTitle><CardDescription>Write in Markdown or plain text</CardDescription></CardHeader>
          <CardContent><Textarea id="content" name="content" placeholder="Start writing..." className="min-h-[240px]" /></CardContent>
        </Card>
        {state && "error" in state && <p className="text-sm text-destructive">{state.error}</p>}
        <div className="flex justify-end"><Button type="submit" disabled={pending} size="lg"><Save />{pending ? "Saving..." : "Save Note"}</Button></div>
      </form>
    </div>
  );
}
