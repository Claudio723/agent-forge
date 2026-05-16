"use client";

import { useActionState } from "react";
import { createNote } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

const moods = ["excited", "productive", "curious", "focused", "reflective"];

export default function NewNotePage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) =>
      createNote(formData),
    null,
  );

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/notes" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">New Note</h1>
          <p className="text-muted-foreground">Capture an idea, thought, or insight</p>
        </div>
      </div>

      <form action={formAction} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
            <CardDescription>Title and categorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" name="title" required placeholder="What's on your mind?" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input id="category" name="category" placeholder="e.g. ideas, tips, research" />
              </div>
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                <Input id="tags" name="tags" placeholder="comma, separated" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <label key={m} className="flex items-center gap-1.5">
                    <input type="radio" name="mood" value={m} className="size-3.5" />
                    <span className="text-sm capitalize">{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your note..."
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        {state && "error" in state && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={pending}>
          <Save className="mr-2 size-4" />
          {pending ? "Saving..." : "Save Note"}
        </Button>
      </form>
    </div>
  );
}
