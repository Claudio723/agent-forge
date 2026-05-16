"use client";

import { deleteNote } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setConfirming(true);
        }}
      >
        <Trash2 className="size-3.5" />
      </Button>
    );
  }

  return (
    <form
      action={deleteNote.bind(null, noteId)}
      onSubmit={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="flex gap-1"
    >
      <Button variant="destructive" size="sm" className="h-7 text-xs">
        Delete
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs"
        onClick={() => setConfirming(false)}
      >
        Cancel
      </Button>
      <input type="hidden" name="id" value={noteId} />
    </form>
  );
}
