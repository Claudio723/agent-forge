"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Link2 } from "lucide-react";
import { linkNoteToProject, linkVaultToProject } from "@/app/dashboard/actions";
import { toast } from "sonner";

interface AvailableItem {
  id: string;
  label: string;
}

export function LinkExisting({
  projectId,
  type,
  available,
}: {
  projectId: string;
  type: "note" | "skill" | "vault";
  available: AvailableItem[];
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (available.length === 0) return null;

  async function link(itemId: string) {
    if (type === "note") {
      const result = await linkNoteToProject(projectId, itemId);
      if (result && "error" in result) { toast.error(result.error); return; }
    } else if (type === "vault") {
      const result = await linkVaultToProject(projectId, itemId);
      if (result && "error" in result) { toast.error(result.error); return; }
    }
    toast.success("Linked");
    setOpen(false);
    router.refresh();
  }

  const labels = { note: "Note", skill: "Skill", vault: "Key" };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm"><Link2 />Link {labels[type]}</Button>}
      />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Link existing {labels[type].toLowerCase()}</DialogTitle>
          <DialogDescription>Select an item to link to this project</DialogDescription>
        </DialogHeader>
        <div className="max-h-[300px] space-y-1 overflow-auto pt-2">
          {available.map((item) => (
            <button
              key={item.id}
              onClick={() => link(item.id)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
            >
              <Plus className="size-3.5 text-muted-foreground" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
