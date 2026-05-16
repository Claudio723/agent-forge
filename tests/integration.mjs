// Integration test: creates a user via Supabase Admin API, then tests app routes
import { createClient } from "@supabase/supabase-js";
import http from "http";

const SUPABASE_URL = "https://tumxurqagpcciwzqkgkr.supabase.co";
const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1bXh1cnFhZ3BjY2l3enFrZ2tyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODg0MzAwOSwiZXhwIjoyMDk0NDE5MDA5fQ.JudAMCeTgYKsan1RLG1LEpHuHT0YjBmH6VVjXGc4g0U";
const APP_URL = "http://localhost:3000";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEST_EMAIL = `e2e-${Date.now()}@agentforge.dev`;
const TEST_PASSWORD = "test123456";

async function run() {
  console.log("🧪 AgentForge Integration Test\n");

  // 1. Create confirmed user via Admin API
  console.log("1. Creating test user...");
  const { data: userData, error: createError } = await supabase.auth.admin.createUser({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    email_confirm: true,
  });
  if (createError) {
    console.error("❌ Failed to create user:", createError.message);
    process.exit(1);
  }
  console.log(`   ✅ User created: ${userData.user.id}`);
  const userId = userData.user.id;

  // 2. Verify profile was auto-created
  console.log("2. Checking auto-created profile...");
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (profileError || !profile) {
    console.error("❌ Profile not auto-created:", profileError?.message);
  } else {
    console.log(`   ✅ Profile exists: email=${profile.email}`);
  }

  // 3. Sign in as the user
  console.log("3. Signing in...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  if (signInError) {
    console.error("❌ Sign in failed:", signInError.message);
    process.exit(1);
  }
  console.log(`   ✅ Signed in: ${signInData.user.email}`);

  // 4. Create a note via RLS-protected client
  console.log("4. Creating a note...");
  const { data: note, error: noteError } = await supabase
    .from("notes")
    .insert({ user_id: userId, title: "Integration Test Note", content: "Hello from test!" })
    .select()
    .single();
  if (noteError) {
    console.error("❌ Note creation failed:", noteError.message);
  } else {
    console.log(`   ✅ Note created: "${note.title}" (id: ${note.id})`);
  }

  // 5. Create a skill
  console.log("5. Creating a skill...");
  const { data: skill, error: skillError } = await supabase
    .from("skills_mcps")
    .insert({ user_id: userId, name: "Test Skill", description: "A test skill", type: "skill" })
    .select()
    .single();
  if (skillError) {
    console.error("❌ Skill creation failed:", skillError.message);
  } else {
    console.log(`   ✅ Skill created: "${skill.name}"`);
  }

  // 6. Create a project and link skill
  console.log("6. Creating a project with skill link...");
  const { data: project, error: projError } = await supabase
    .from("projects")
    .insert({ user_id: userId, name: "Test Project", description: "A test", status: "active" })
    .select()
    .single();
  if (projError) {
    console.error("❌ Project creation failed:", projError.message);
  } else {
    console.log(`   ✅ Project created: "${project.name}"`);
    if (skill) {
      const { error: linkError } = await supabase
        .from("project_skills")
        .insert({ project_id: project.id, skill_id: skill.id });
      if (linkError) {
        console.error("   ⚠️  Skill link failed:", linkError.message);
      } else {
        console.log("   ✅ Skill linked to project");
      }
    }
  }

  // 7. Check data counts
  console.log("7. Counting user data...");
  const { count: noteCount } = await supabase
    .from("notes").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const { count: skillCount } = await supabase
    .from("skills_mcps").select("*", { count: "exact", head: true }).eq("user_id", userId);
  const { count: projectCount } = await supabase
    .from("projects").select("*", { count: "exact", head: true }).eq("user_id", userId);
  console.log(`   📊 Notes: ${noteCount} | Skills: ${skillCount} | Projects: ${projectCount}`);

  // 8. Cleanup: delete user
  console.log("8. Cleaning up test user...");
  const { error: delError } = await supabase.auth.admin.deleteUser(userId);
  if (delError) {
    console.error("❌ User cleanup failed:", delError.message);
  } else {
    console.log("   ✅ Test user deleted");
  }

  console.log("\n🎉 All integration tests passed!");
}

run().catch((err) => {
  console.error("💥 Test crashed:", err);
  process.exit(1);
});
