// This route is required for Supabase Auth email confirmation redirects.
// Supabase sends users to /auth/callback?token_hash=... after email confirmation.
// We exchange the token and redirect to /dashboard.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — go home
  return NextResponse.redirect(`${origin}/`);
}
