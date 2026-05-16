import { webkit } from "@playwright/test";

const BASE = "https://agent-forge-zeta-weld.vercel.app";
const EMAIL = "dev.claudio@icloud.com";
const PASSWORD = "AdminAdmin";

async function run() {
  console.log("Launching WebKit...");
  const browser = await webkit.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. Landing page
  console.log("1. Landing page...");
  await page.goto(BASE, { waitUntil: "networkidle" });
  console.log(`   URL: ${page.url()}`);

  // 2. Login
  console.log("2. Login...");
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" });
  await page.fill('input[name="email"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');

  // 3. Wait for dashboard
  await page.waitForURL("**/dashboard**", { timeout: 15000 });
  console.log(`3. Dashboard: ${page.url()}`);

  // 4. Test routes
  const routes = [
    "/dashboard/notes",
    "/dashboard/skills",
    "/dashboard/projects",
    "/dashboard/vault",
    "/dashboard/prompt-builder",
    "/dashboard/settings",
  ];

  console.log("\n4. Testing routes...");
  for (const route of routes) {
    const resp = await page.goto(`${BASE}${route}`, {
      waitUntil: "networkidle",
      timeout: 15000,
    });
    const status = resp?.status() ?? "?";
    const has404 = await page
      .locator("text=This page could not be found")
      .isVisible()
      .catch(() => false);

    if (has404) {
      console.log(`   ❌ ${route} → Next.js 404 (status=${status})`);
    } else if (status === 404) {
      console.log(`   ❌ ${route} → HTTP 404`);
    } else {
      console.log(`   ✅ ${route} → status=${status}`);
    }
  }

  await browser.close();
  console.log("\nDone!");
}

run().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
