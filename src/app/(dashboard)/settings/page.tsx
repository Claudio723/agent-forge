import Link from "next/link";
import { Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Profile, theme, and export (Phase 4)</p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex h-64 flex-col items-center justify-center gap-3">
          <Settings className="size-10 text-muted-foreground/50" />
          <p className="text-muted-foreground">Full settings coming in Phase 4</p>
          <p className="text-xs text-muted-foreground">
            Profile editing, theme preferences, data export (Markdown &amp; JSON)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
