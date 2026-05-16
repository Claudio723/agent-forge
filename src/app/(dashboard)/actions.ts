"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// ============================================================================
// Notes CRUD
// ============================================================================

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = (formData.get("category") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";
  const mood = (formData.get("mood") as string) || null;
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase.from("notes").insert({
    user_id: user.id,
    title,
    content,
    category,
    tags,
    mood,
  });

  if (error) return { error: error.message };
  redirect("/dashboard/notes");
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = (formData.get("category") as string) || null;
  const tagsRaw = (formData.get("tags") as string) || "";
  const mood = (formData.get("mood") as string) || null;
  const tags = tagsRaw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("notes")
    .update({ title, content, category, tags, mood })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/notes");
  redirect("/dashboard/notes");
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/notes");
  redirect("/dashboard/notes");
}

// ============================================================================
// Skills & MCPs CRUD
// ============================================================================

export async function createSkill(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const type = formData.get("type") as string;
  const configRaw = (formData.get("config") as string) || "{}";

  let config = {};
  try {
    config = JSON.parse(configRaw);
  } catch {
    return { error: "Invalid JSON in config field" };
  }

  const { error } = await supabase.from("skills_mcps").insert({
    user_id: user.id,
    name,
    description,
    type,
    config,
  });

  if (error) return { error: error.message };
  redirect("/dashboard/skills");
}

export async function updateSkill(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const type = formData.get("type") as string;
  const configRaw = (formData.get("config") as string) || "{}";

  let config = {};
  try {
    config = JSON.parse(configRaw);
  } catch {
    return { error: "Invalid JSON in config field" };
  }

  const { error } = await supabase
    .from("skills_mcps")
    .update({ name, description, type, config })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/skills");
  redirect("/dashboard/skills");
}

export async function deleteSkill(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("skills_mcps")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/skills");
  redirect("/dashboard/skills");
}

// ============================================================================
// Projects CRUD
// ============================================================================

export async function createProject(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const status = (formData.get("status") as string) || "active";
  const skillIds = formData.getAll("skillIds") as string[];

  const { data: project, error } = await supabase
    .from("projects")
    .insert({ user_id: user.id, name, description, status })
    .select("id")
    .single();

  if (error) return { error: error.message };

  // Link skills
  if (skillIds.length > 0 && project) {
    const links = skillIds.map((skillId) => ({
      project_id: project.id,
      skill_id: skillId,
    }));
    await supabase.from("project_skills").insert(links);
  }

  redirect("/dashboard/projects");
}

export async function updateProject(id: string, formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const status = (formData.get("status") as string) || "active";
  const skillIds = formData.getAll("skillIds") as string[];

  const { error } = await supabase
    .from("projects")
    .update({ name, description, status })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  // Replace skill links
  await supabase.from("project_skills").delete().eq("project_id", id);

  if (skillIds.length > 0) {
    const links = skillIds.map((skillId) => ({
      project_id: id,
      skill_id: skillId,
    }));
    await supabase.from("project_skills").insert(links);
  }

  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}

export async function deleteProject(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}

// ============================================================================
// API Vault CRUD
// ============================================================================

export async function createVaultEntry(formData: FormData) {
  const supabase = await createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const alias = formData.get("alias") as string;
  const service = formData.get("service") as string;
  const plainKey = formData.get("apiKey") as string;
  const encryptionPassword = process.env.SUPABASE_VAULT_ENCRYPTION_KEY || "agent-forge-vault-key";

  const { error } = await supabase.rpc("encrypt_and_store_key", {
    p_user_id: user.id,
    p_alias: alias,
    p_service: service,
    p_plain_key: plainKey,
    p_encryption_password: encryptionPassword,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/vault");
  redirect("/dashboard/vault");
}

export async function deleteVaultEntry(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("api_vault")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/vault");
  redirect("/dashboard/vault");
}

export async function decryptVaultKey(id: string) {
  const supabase = await createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const encryptionPassword = process.env.SUPABASE_VAULT_ENCRYPTION_KEY || "agent-forge-vault-key";

  const { data, error } = await supabase.rpc("decrypt_vault_key", {
    p_entry_id: id,
    p_user_id: user.id,
    p_encryption_password: encryptionPassword,
  });

  if (error) return { error: error.message };
  return { key: data };
}

// ============================================================================
// Prompt Builder
// ============================================================================

export interface SkillMatch {
  id: string;
  name: string;
  description: string;
  type: "skill" | "mcp";
  score: number;
  reason: string;
}

export async function matchSkillsToGoal(goal: string): Promise<{
  matches: SkillMatch[];
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { matches: [], error: "Not authenticated" };

  const { data: skills } = await supabase
    .from("skills_mcps")
    .select("*")
    .eq("user_id", user.id);

  if (!skills || skills.length === 0) {
    return { matches: [] };
  }

  const goalLower = goal.toLowerCase();
  const goalWords = goalLower.split(/\s+/);

  const matches: SkillMatch[] = skills.map((skill) => {
    const nameLower = skill.name.toLowerCase();
    const descLower = (skill.description || "").toLowerCase();
    let score = 0;
    const matchedWords: string[] = [];

    for (const word of goalWords) {
      if (word.length < 3) continue;
      if (nameLower.includes(word)) {
        score += 3;
        matchedWords.push(word);
      } else if (descLower.includes(word)) {
        score += 1;
        matchedWords.push(word);
      }
    }

    return {
      id: skill.id,
      name: skill.name,
      description: skill.description || "",
      type: skill.type,
      score,
      reason:
        score > 0
          ? `Matches keywords: ${matchedWords.join(", ")}`
          : "Available tool — no direct keyword match",
    };
  });

  matches.sort((a, b) => b.score - a.score);
  return { matches };
}

export async function generatePrompt(
  goal: string,
  selectedSkillIds: string[],
  provider: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  if (selectedSkillIds.length === 0) {
    return { prompt: buildBasicPrompt(goal, provider, []) };
  }

  const { data: skills } = await supabase
    .from("skills_mcps")
    .select("*")
    .eq("user_id", user.id)
    .in("id", selectedSkillIds);

  return { prompt: buildBasicPrompt(goal, provider, skills || []) };
}

function buildBasicPrompt(
  goal: string,
  provider: string,
  skills: Array<{ name: string; description: string; type: string; config: Record<string, unknown> }>,
): string {
  const providerNames: Record<string, string> = {
    deepseek: "DeepSeek",
    grok: "Grok",
    claude: "Claude",
  };

  const promptName = providerNames[provider] || "AI";

  let prompt = `You are an AI assistant optimized for ${promptName}.\n\n`;

  if (skills.length > 0) {
    prompt += `## Available Tools & Skills\n\n`;
    for (const skill of skills) {
      const badge = skill.type === "mcp" ? "[MCP]" : "[Skill]";
      prompt += `- **${skill.name}** ${badge}: ${skill.description}\n`;
    }
    prompt += `\n## Task\n\n${goal}\n\n`;
    prompt += `## Instructions\n\n`;
    prompt += `Use the tools and skills listed above to accomplish this task. `;
    prompt += `For each step, mention which skill/MCP you're using and why.\n`;
  } else {
    prompt += `## Task\n\n${goal}\n\n`;
    prompt += `## Instructions\n\n`;
    prompt += `Provide a clear, actionable response.\n`;
  }

  return prompt;
}

// ============================================================================
// Seed Demo Data (from Phase 2)
// ============================================================================

const DEMO_ENCRYPTION_KEY = "agent-forge-demo-seed-key";

export async function seedDemoData() {
  const supabase = await createServiceClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const userId = user.id;
  const { count } = await supabase
    .from("notes")
    .select("*", { count: "exact", head: true });

  if (count && count > 0) {
    return { error: "Demo data already exists." };
  }

  // Skills
  const { data: skills, error: skillsError } = await supabase
    .from("skills_mcps")
    .insert([
      {
        user_id: userId,
        name: "Code Review Assistant",
        description: "Reviews PRs for code quality, security, and best practices.",
        type: "skill",
        config: { languages: ["typescript", "python", "rust"] },
      },
      {
        user_id: userId,
        name: "Documentation Generator",
        description: "Generates API docs, READMEs, and inline comments.",
        type: "skill",
        config: { formats: ["markdown", "jsdoc", "openapi"] },
      },
      {
        user_id: userId,
        name: "Supabase MCP",
        description: "Run SQL queries and manage Supabase from AI conversations.",
        type: "mcp",
        config: { command: "npx", args: ["-y", "@supabase/mcp-server-supabase"] },
      },
      {
        user_id: userId,
        name: "Filesystem MCP",
        description: "Read, write, and manage files through AI.",
        type: "mcp",
        config: { command: "npx", args: ["-y", "@anthropic/mcp-server-filesystem"] },
      },
    ])
    .select("id");

  if (skillsError) return { error: skillsError.message };

  // Notes
  const { error: notesError } = await supabase.from("notes").insert([
    {
      user_id: userId,
      title: "Setting up my AI workflow",
      content: "Today I configured Supabase MCP and Filesystem MCP...",
      category: "ideas",
      tags: ["setup", "mcp", "workflow"],
      mood: "excited",
    },
    {
      user_id: userId,
      title: "Prompt engineering tips",
      content: "1. Be specific about output format\n2. Reference skills by name...",
      category: "tips",
      tags: ["prompts", "best-practices"],
      mood: "productive",
    },
    {
      user_id: userId,
      title: "Project idea: CLI launcher",
      content: "What if AgentForge could launch from the terminal?",
      category: "ideas",
      tags: ["projects", "cli"],
      mood: "curious",
    },
  ]);
  if (notesError) return { error: notesError.message };

  // Projects
  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .insert([
      {
        user_id: userId,
        name: "AgentForge CLI",
        description: "Terminal-first interface for AgentForge.",
        status: "ideation",
      },
      {
        user_id: userId,
        name: "Code Review Pipeline",
        description: "Automated PR review workflow.",
        status: "active",
      },
    ])
    .select("id");
  if (projectsError) return { error: projectsError.message };

  // Project-Skill links
  if (projects && skills) {
    await supabase.from("project_skills").insert([
      { project_id: projects[0].id, skill_id: skills[2].id },
      { project_id: projects[0].id, skill_id: skills[3].id },
      { project_id: projects[1].id, skill_id: skills[0].id },
      { project_id: projects[1].id, skill_id: skills[1].id },
    ]);
  }

  // Vault entry
  await supabase.rpc("encrypt_and_store_key", {
    p_user_id: userId,
    p_alias: "My DeepSeek Key",
    p_service: "deepseek",
    p_plain_key: "sk-demo-key-not-real",
    p_encryption_password: DEMO_ENCRYPTION_KEY,
  });

  revalidatePath("/dashboard");
  return { success: true };
}
