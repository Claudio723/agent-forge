import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "./form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user!.id)
    .single();

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Profile, theme, and data export</p>
      </div>

      <SettingsForm
        defaultName={profile?.full_name || ""}
        defaultAvatar={profile?.avatar_url || ""}
      />
    </div>
  );
}
