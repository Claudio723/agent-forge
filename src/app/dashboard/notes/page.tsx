import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, StickyNote } from "lucide-react";
import { DeleteNoteButton } from "./delete-button";
import { formatDistanceToNow } from "date-fns";
import { QuickCreate } from "@/components/quick-create";

export const dynamic = "force-dynamic";

export default async function NotesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let query = supabase.from("notes").select("*").eq("user_id", user!.id).order("updated_at", { ascending: false });
  if (params.q) query = query.or(`title.ilike.%${params.q}%,content.ilike.%${params.q}%`);
  const { data: notes } = await query;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
          <p className="text-sm text-muted-foreground">Your ideas, experiments, and insights</p>
        </div>
        <QuickCreate type="note" />
      </div>

      <form className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" placeholder="Search notes..." defaultValue={params.q} className="pl-9" />
      </form>

      {!notes || notes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3">
            <StickyNote className="size-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No notes yet</p>
            <QuickCreate type="note" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Link key={note.id} href={`/dashboard/notes/${note.id}`}>
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="truncate text-base">{note.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {note.mood && <span className="capitalize">{note.mood} · </span>}
                        {note.category && <span className="capitalize">{note.category} · </span>}
                        {formatDistanceToNow(new Date(note.updated_at), { addSuffix: true })}
                      </CardDescription>
                    </div>
                    <DeleteNoteButton noteId={note.id} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{note.content || "No content"}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {note.tags.map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
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
