import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Onboarding } from "@/components/onboarding";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if user has onboarded (has a name set)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const hasName = !!profile?.full_name;

  return (
    <>
      <Onboarding hasName={hasName} />
      {children}
    </>
  );
}
