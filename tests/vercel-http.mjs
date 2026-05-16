// HTTP test against Vercel deployment using fetch with cookie handling
const BASE = "https://agent-forge-zeta-weld.vercel.app";
const EMAIL = "dev.claudio@icloud.com";
const PASSWORD = "AdminAdmin";

async function run() {
  console.log("AgentForge Vercel HTTP Test\n");

  // 1. Get CSRF / initial cookies from landing page
  console.log("1. Fetching landing page...");
  const r1 = await fetch(BASE, { redirect: "manual" });
  console.log(`   ${r1.status} ${r1.headers.get("location") || ""}`);

  // 2. Get login page
  console.log("2. Fetching login page...");
  const r2 = await fetch(`${BASE}/login`);
  const cookies = r2.headers.getSetCookie();
  console.log(`   ${r2.status} — cookies: ${cookies.length}`);

  // 3. Try to POST login via server action
  console.log("3. Logging in...");
  const formData = new URLSearchParams();
  formData.append("email", EMAIL);
  formData.append("password", PASSWORD);

  const r3 = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: cookies.join("; "),
      "Next-Action": "abc123", // dummy for server action
    },
    body: formData.toString(),
    redirect: "manual",
  });
  console.log(`   ${r3.status} → ${r3.headers.get("location") || "no redirect"}`);

  // 4. Test routes
  const routes = [
    "/dashboard",
    "/dashboard/notes",
    "/dashboard/skills",
    "/dashboard/projects",
    "/dashboard/vault",
    "/dashboard/prompt-builder",
    "/dashboard/settings",
  ];

  console.log("\n4. Testing routes...");
  for (const route of routes) {
    const r = await fetch(`${BASE}${route}`, { redirect: "manual" });
    const status = r.status;
    const location = r.headers.get("location") || "";
    const text = (await r.text()).slice(0, 200);

    if (text.includes("This page could not be found")) {
      console.log(`   ❌ ${route} → Next.js 404 (HTTP ${status})`);
    } else if (status >= 300 && status < 400) {
      console.log(`   🔀 ${route} → redirect ${status} → ${location}`);
    } else {
      console.log(`   ✅ ${route} → HTTP ${status} (${text.slice(0, 80)}...)`);
    }
  }

  console.log("\nDone!");
}

run().catch(console.error);
