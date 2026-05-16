"use client";

import { useActionState } from "react";
import { createVaultEntry } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Save, Shield } from "lucide-react";
import Link from "next/link";

const services = ["deepseek", "grok", "claude", "openai", "supabase", "other"];

export default function NewVaultPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: { error?: string } | null, formData: FormData) =>
      createVaultEntry(formData),
    null,
  );

  return (
    <div className="p-6 space-y-6 max-w-lg">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" render={<Link href="/dashboard/vault" />}>
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Store API Key</h1>
          <p className="text-muted-foreground">Encrypted server-side with pgcrypto</p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="alias" className="text-sm font-medium">Alias</label>
          <Input id="alias" name="alias" required placeholder="e.g. My DeepSeek Key" />
        </div>

        <div className="space-y-2">
          <label htmlFor="service" className="text-sm font-medium">Service</label>
          <select id="service" name="service" required className="w-full rounded-lg border bg-background px-3 py-2 text-sm">
            {services.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium">API Key</label>
          <Input id="apiKey" name="apiKey" type="password" required placeholder="sk-..." />
        </div>

        <div className="rounded-lg border bg-muted/50 p-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Shield className="size-3.5 mt-0.5 shrink-0" />
          <span>The key is encrypted with pgcrypto before storage. It never leaves the server in plaintext and is never sent to the client.</span>
        </div>

        {state && "error" in state && (
          <p className="text-sm text-destructive">{state.error}</p>
        )}

        <Button type="submit" disabled={pending}>
          <Save className="mr-2 size-4" />
          {pending ? "Encrypting..." : "Store Encrypted Key"}
        </Button>
      </form>
    </div>
  );
}
