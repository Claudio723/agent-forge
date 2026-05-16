import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is handled by proxy.ts — this is a safety net
  let user = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // If cookies() fails on edge, let the page handle it
  }

  if (!user) {
    redirect("/login");
  }

  return <>{children}</>;
}
