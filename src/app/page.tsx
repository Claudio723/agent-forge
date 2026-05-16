import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LandingPage } from "@/components/landing/hero";

export default async function Home() {
  // Check if user is logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware handles redirect, but we double-check here for server rendering
  if (user) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
