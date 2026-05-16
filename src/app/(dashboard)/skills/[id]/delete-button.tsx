"use client";

import { deleteSkill } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteSkillButton({ skillId }: { skillId: string }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
        <Trash2 className="mr-2 size-3.5" />
        Delete
      </Button>
    );
  }

  return (
    <form action={deleteSkill.bind(null, skillId)} className="flex gap-1">
      <Button variant="destructive" size="sm">Confirm Delete</Button>
      <Button variant="outline" size="sm" onClick={() => setConfirming(false)}>Cancel</Button>
    </form>
  );
}
