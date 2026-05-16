import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    routes: [
      "/dashboard",
      "/dashboard/notes",
      "/dashboard/skills",
      "/dashboard/projects",
      "/dashboard/vault",
      "/dashboard/prompt-builder",
      "/dashboard/settings",
    ],
  });
}
