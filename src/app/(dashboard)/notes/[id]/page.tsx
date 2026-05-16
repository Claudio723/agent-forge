import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { EditNoteForm } from "./form";

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: note } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!note) notFound();

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <EditNoteForm note={note} />
    </div>
  );
}
