import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Key } from "lucide-react";

export default async function VaultPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: entries } = await supabase
    .from("api_vault")
    .select("id, alias, service, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Vault</h1>
          <p className="text-muted-foreground">Securely stored API keys — never plaintext on the client</p>
        </div>
        <Button render={<Link href="/dashboard/vault/new" />}>
          <Plus className="mr-2 size-4" />
          Add Key
        </Button>
      </div>

      {!entries || entries.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex h-48 flex-col items-center justify-center gap-3">
            <Key className="size-10 text-muted-foreground/50" />
            <p className="text-muted-foreground">No API keys stored</p>
            <Button variant="outline" size="sm" render={<Link href="/dashboard/vault/new" />}>
              <Plus className="mr-2 size-3" />
              Store your first key
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Key className="size-4 text-primary" />
                  <CardTitle className="text-base">{entry.alias}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="text-xs text-muted-foreground">Service</span>
                  <p className="text-sm capitalize">{entry.service}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Key</span>
                  <p className="text-sm font-mono">••••••••</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Created</span>
                  <p className="text-sm">
                    {new Date(entry.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
