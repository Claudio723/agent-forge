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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, StickyNote, Wrench, FolderKanban, Key, Loader2 } from "lucide-react";
import { createNote, createSkill, createProject, createVaultEntry } from "@/app/dashboard/actions";
import { toast } from "sonner";

type CreateType = "note" | "skill" | "project" | "vault";

const types = {
  note: { icon: StickyNote, title: "New Note", description: "Capture an idea quickly", action: createNote },
  skill: { icon: Wrench, title: "Add Tool", description: "Save a new skill or MCP", action: createSkill },
  project: { icon: FolderKanban, title: "New Project", description: "Start a new project", action: createProject },
  vault: { icon: Key, title: "Store API Key", description: "Encrypted server-side", action: createVaultEntry },
};

export function QuickCreate({ type }: { type: CreateType }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const config = types[type];
  const Icon = config.icon;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    try {
      await config.action(formData);
      setOpen(false);
      toast.success(`${config.title} created`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={type === "note" ? "default" : "secondary"} size="lg">
            <Icon />{config.title}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Icon className="size-5" />{config.title}</DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {type === "note" && (
            <>
              <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required placeholder="Note title" autoFocus /></div>
              <div className="space-y-2"><Label htmlFor="content">Content</Label><Textarea id="content" name="content" placeholder="Write something..." rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label htmlFor="category">Category</Label><Input id="category" name="category" placeholder="e.g. ideas" /></div>
                <div className="space-y-2"><Label htmlFor="tags">Tags</Label><Input id="tags" name="tags" placeholder="comma, separated" /></div>
              </div>
            </>
          )}
          {type === "skill" && (
            <>
              <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="e.g. Code Review Assistant" autoFocus /></div>
              <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="What does it do?" rows={2} /></div>
              <input type="hidden" name="type" value="skill" />
              <input type="hidden" name="config" value="{}" />
            </>
          )}
          {type === "project" && (
            <>
              <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required placeholder="Project name" autoFocus /></div>
              <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" placeholder="What's it about?" rows={2} /></div>
              <input type="hidden" name="status" value="active" />
            </>
          )}
          {type === "vault" && (
            <>
              <div className="space-y-2"><Label htmlFor="alias">Alias</Label><Input id="alias" name="alias" required placeholder="e.g. My OpenAI Key" autoFocus /></div>
              <div className="space-y-2"><Label htmlFor="apiKey">API Key</Label><Input id="apiKey" name="apiKey" type="password" required placeholder="sk-..." /></div>
              <div className="space-y-2"><Label htmlFor="service">Service</Label><Input id="service" name="service" required placeholder="openai" /></div>
            </>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={pending}>
              {pending ? <Loader2 className="animate-spin" /> : <Plus />}
              {pending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
