"use client";

import { useActionState } from "react";
import { updateNote, deleteNote } from "@/app/dashboard/actions";
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
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

const moods = ["excited", "productive", "curious", "focused", "reflective"];

interface Note {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  mood: string | null;
}

export function EditNoteForm({ note }: { note: Note }) {
  const updateAction = async (
    _prevState: { error?: string } | null,
    formData: FormData,
  ) => updateNote(note.id, formData);
  const [state, formAction, pending] = useActionState(updateAction, null);

  return (
    <>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/notes" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Edit Note</h1>
        </div>
        <form action={deleteNote.bind(null, note.id)}>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 size-3.5" />
            Delete
          </Button>
        </form>
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
              <Input id="title" name="title" required defaultValue={note.title} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">Category</label>
                <Input id="category" name="category" defaultValue={note.category || ""} />
              </div>
              <div className="space-y-2">
                <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                <Input
                  id="tags"
                  name="tags"
                  defaultValue={note.tags?.join(", ") || ""}
                  placeholder="comma, separated"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mood</label>
              <div className="flex flex-wrap gap-2">
                {moods.map((m) => (
                  <label key={m} className="flex items-center gap-1.5">
                    <input
                      type="radio"
                      name="mood"
                      value={m}
                      defaultChecked={note.mood === m}
                      className="size-3.5"
                    />
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
              defaultValue={note.content || ""}
              className="min-h-[200px]"
            />
          </CardContent>
        </Card>

        {state && "error" in state && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={pending}>
          <Save className="mr-2 size-4" />
          {pending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </>
  );
}
