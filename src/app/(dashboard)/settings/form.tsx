"use client";

import { useActionState, useState } from "react";
import { updateProfile, exportData } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Download, User, Palette, FileJson, FileText } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "sonner";

export function SettingsForm({ defaultName, defaultAvatar }: { defaultName: string; defaultAvatar: string }) {
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string; success?: boolean } | null, formData: FormData) => updateProfile(formData),
    null,
  );
  const [exporting, setExporting] = useState<string | null>(null);

  async function handleExport(format: "markdown" | "json") {
    setExporting(format);
    const result = await exportData(format);
    if ("error" in result) { toast.error(result.error); setExporting(null); return; }
    const blob = new Blob([result.data], { type: result.type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agent-forge-export.${format === "json" ? "json" : "md"}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
    setExporting(null);
  }

  return (
    <div className="space-y-6">
      <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="size-5 text-primary" />Profile</CardTitle><CardDescription>Update your display name and avatar</CardDescription></CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2"><label htmlFor="full_name" className="text-sm font-medium">Display Name</label><Input id="full_name" name="full_name" defaultValue={defaultName} placeholder="Your name" /></div>
          <div className="space-y-2"><label htmlFor="avatar_url" className="text-sm font-medium">Avatar URL</label><Input id="avatar_url" name="avatar_url" defaultValue={defaultAvatar} placeholder="https://..." /></div>
          {state && "error" in state && <p className="text-sm text-destructive">{state.error}</p>}
          {state && "success" in state && <p className="text-sm text-green-600 dark:text-green-400">Profile updated</p>}
          <Button type="submit" disabled={pending}><Save className="mr-2 size-4" />{pending ? "Saving..." : "Save Profile"}</Button>
        </form>
      </CardContent></Card>

      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Palette className="size-5 text-primary" />Theme</CardTitle><CardDescription>Toggle between dark and light mode</CardDescription></CardHeader><CardContent><ThemeToggle /></CardContent></Card>

      <Card><CardHeader><CardTitle className="flex items-center gap-2"><Download className="size-5 text-primary" />Export Data</CardTitle><CardDescription>Download all your notes, skills, and projects</CardDescription></CardHeader>
      <CardContent className="flex gap-3">
        <Button variant="outline" onClick={() => handleExport("markdown")} disabled={exporting !== null}><FileText className="mr-2 size-4" />{exporting === "markdown" ? "Exporting..." : "Markdown"}</Button>
        <Button variant="outline" onClick={() => handleExport("json")} disabled={exporting !== null}><FileJson className="mr-2 size-4" />{exporting === "json" ? "Exporting..." : "JSON"}</Button>
      </CardContent></Card>
    </div>
  );
}
