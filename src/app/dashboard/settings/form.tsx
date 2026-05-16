"use client";

import { useActionState } from "react";
import { updateProfile, exportData } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import { Save, Download, User, Palette, FileJson, FileText } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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
    const a = document.createElement("a"); a.href = url; a.download = `agent-forge-export.${format === "json" ? "json" : "md"}`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${format.toUpperCase()}`);
    setExporting(null);
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><User className="size-5" />Profile</CardTitle>
          <CardDescription>Your display name and avatar</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2"><Label htmlFor="full_name">Display Name</Label><Input id="full_name" name="full_name" defaultValue={defaultName} placeholder="Your name" /></div>
            <div className="space-y-2"><Label htmlFor="avatar_url">Avatar URL</Label><Input id="avatar_url" name="avatar_url" defaultValue={defaultAvatar} placeholder="https://..." /></div>
            {state && "error" in state && <p className="text-sm text-destructive">{state.error}</p>}
            {state && "success" in state && <p className="text-sm text-green-600">Profile updated</p>}
            <Button type="submit" disabled={pending}><Save />{pending ? "Saving..." : "Save"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Palette className="size-5" />Appearance</CardTitle>
          <CardDescription>Toggle between dark and light mode</CardDescription>
        </CardHeader>
        <CardContent><ThemeToggle /></CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg"><Download className="size-5" />Export</CardTitle>
          <CardDescription>Download all your data</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={() => handleExport("markdown")} disabled={exporting !== null}><FileText />{exporting === "markdown" ? "Exporting..." : "Markdown"}</Button>
          <Button variant="outline" onClick={() => handleExport("json")} disabled={exporting !== null}><FileJson />{exporting === "json" ? "Exporting..." : "JSON"}</Button>
        </CardContent>
      </Card>
    </div>
  );
}
