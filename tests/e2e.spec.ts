import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const TEST_EMAIL = `test-${Date.now()}@agentforge.dev`;
const TEST_PASSWORD = "test123456";

test.describe("AgentForge E2E", () => {
  test("signup → onboarding → dashboard → crud → prompt → settings", async ({ page }) => {
    // 1. Landing page
    await page.goto(BASE);
    await expect(page.locator("h1")).toContainText("AgentForge");
    await page.click('a[href="/login"]');

    // 2. Signup
    await expect(page).toHaveURL(/\/login/);
    await page.click("text=Sign up");
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');

    // 3. Onboarding
    await expect(page.locator("text=Welcome to AgentForge")).toBeVisible({ timeout: 15000 });
    await page.click("text=Get Started");
    await expect(page.locator("text=What should we call you")).toBeVisible();
    await page.fill('input[name="full_name"]', "Playwright Tester");
    await page.click('button:has-text("Save")');

    // Skip skill step
    await expect(page.locator("text=Add your first skill")).toBeVisible();
    await page.click("text=Skip");

    // Skip prompt builder step → go to dashboard
    await expect(page.locator("text=Try the Prompt Builder")).toBeVisible();
    await page.click("text=Go to Dashboard");

    // 4. Dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
    await expect(page.locator("h1")).toContainText("Dashboard");

    // 5. Seed demo data
    const seedBtn = page.locator("button:has-text('Seed demo data')");
    if (await seedBtn.isVisible()) {
      await seedBtn.click();
      await page.waitForTimeout(3000);
    }

    // 6. Notes
    await page.click('a[href="/dashboard/notes"]');
    await expect(page.locator("h1")).toContainText("Notes");
    // Create a note
    await page.click('a[href="/dashboard/notes/new"]');
    await page.fill('input[name="title"]', "E2E Test Note");
    await page.fill("textarea", "This was created by Playwright.");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard\/notes/, { timeout: 10000 });

    // 7. Skills
    await page.click('a[href="/dashboard/skills"]');
    await expect(page.locator("h1")).toContainText("Skills");

    // 8. Projects
    await page.click('a[href="/dashboard/projects"]');
    await expect(page.locator("h1")).toContainText("Projects");

    // 9. Vault
    await page.click('a[href="/dashboard/vault"]');
    await expect(page.locator("h1")).toContainText("API Vault");

    // 10. Prompt Builder
    await page.click('a[href="/dashboard/prompt-builder"]');
    await expect(page.locator("h1")).toContainText("Smart Prompt Builder");

    // 11. Settings
    await page.click('a[href="/dashboard/settings"]');
    await expect(page.locator("h1")).toContainText("Settings");

    // 12. Command Menu ⌘K
    await page.keyboard.press("Meta+k");
    await expect(page.locator('[cmdk-input]')).toBeVisible({ timeout: 3000 });
    await page.keyboard.press("Escape");

    // 13. Logout
    const logoutBtn = page.locator("button:has-text('Logout')");
    if (await logoutBtn.isVisible()) {
      await logoutBtn.click();
    }
    await expect(page).toHaveURL(BASE, { timeout: 10000 });

    console.log(`✅ E2E test passed for user: ${TEST_EMAIL}`);
  });
});
