"use client";
import { deleteProject } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming) return <Button variant="outline" size="sm" onClick={() => setConfirming(true)}><Trash2 className="mr-2 size-3.5" />Delete</Button>;
  return <form action={deleteProject.bind(null, projectId)} className="flex gap-1"><Button variant="destructive" size="sm">Confirm Delete</Button><Button variant="outline" size="sm" onClick={() => setConfirming(false)}>Cancel</Button></form>;
}
