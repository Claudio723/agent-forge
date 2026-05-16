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
import { Plus, StickyNote, Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DeleteNoteButton } from "./delete-button";


export const dynamic = "force-dynamic";

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("notes")
    .select("*")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  if (params.q) {
    query = query.or(
      `title.ilike.%${params.q}%,content.ilike.%${params.q}%`,
    );
  }
  if (params.category) {
    query = query.eq("category", params.category);
  }

  const { data: notes } = await query;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notes</h1>
          <p className="text-muted-foreground">Your ideas, experiments, and insights</p>
        </div>
        <Button render={<Link href="/dashboard/notes/new" />}>
          <Plus className="mr-2 size-4" />
          New Note
        </Button>
      </div>

      {/* Search */}
      <form className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search notes..."
            defaultValue={params.q}
            className="pl-9"
          />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      {/* Notes Grid */}
      {!notes || notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3">
            <StickyNote className="size-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No notes yet</p>
            <Button
              variant="outline"
              size="sm"
              render={<Link href="/dashboard/notes/new" />}
            >
              <Plus className="mr-2 size-3" />
              Create your first note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <DeleteNoteButton noteId={note.id} />
                  </div>
                  {note.category && (
                    <CardDescription className="capitalize">
                      {note.mood && `${note.mood} · `}
                      {note.category}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {note.content || "No content"}
                  </p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {note.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          <Tag className="size-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
