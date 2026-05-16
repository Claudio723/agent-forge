"use client";

import { useState } from "react";
import { matchSkillsToGoal, generatePrompt, type SkillMatch } from "@/app/dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Wrench,
  Puzzle,
  Copy,
  Check,
  Loader2,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const providers = [
  { id: "deepseek", name: "DeepSeek", icon: Sparkles },
  { id: "grok", name: "Grok", icon: Zap },
  { id: "claude", name: "Claude", icon: Sparkles },
];

export default function PromptBuilderPage() {
  const [goal, setGoal] = useState("");
  const [matches, setMatches] = useState<SkillMatch[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [provider, setProvider] = useState("deepseek");
  const [prompt, setPrompt] = useState<string | null>(null);
  const [matching, setMatching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleMatch() {
    if (!goal.trim()) return;
    setMatching(true);
    setMatches([]);
    setSelected(new Set());
    setPrompt(null);
    const result = await matchSkillsToGoal(goal);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      setMatches(result.matches);
      // Auto-select top matches
      const topIds = result.matches.filter((m) => m.score > 0).slice(0, 4).map((m) => m.id);
      setSelected(new Set(topIds));
      if (result.matches.length === 0) {
        toast.info("No skills found — seed demo data or add skills first.");
      }
    }
    setMatching(false);
  }

  function toggleSkill(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
    setPrompt(null);
  }

  async function handleGenerate() {
    setGenerating(true);
    const result = await generatePrompt(goal, Array.from(selected), provider);
    if ("error" in result) {
      toast.error(result.error);
    } else {
      setPrompt(result.prompt);
    }
    setGenerating(false);
  }

  async function handleCopy() {
    if (!prompt) return;
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Smart Prompt Builder</h1>
        <p className="text-muted-foreground">
          Describe your goal — AgentForge finds the right tools and builds the prompt
        </p>
      </div>

      {/* Step 1: Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="size-5 text-primary" />
            What do you want to accomplish?
          </CardTitle>
          <CardDescription>
            Be specific — the builder matches keywords against your saved skills &amp; MCPs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g. I want to review a TypeScript PR for security issues and generate documentation for the new API endpoints"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="min-h-[80px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleMatch();
              }
            }}
          />
          <Button onClick={handleMatch} disabled={matching || !goal.trim()}>
            {matching ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 size-4" />
            )}
            {matching ? "Matching..." : "Find Matching Tools"}
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Matched Skills */}
      {matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="size-5 text-primary" />
              Matching Skills &amp; MCPs
            </CardTitle>
            <CardDescription>
              Select the tools to include in the prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {matches.map((match) => (
              <label
                key={match.id}
                className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                  selected.has(match.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(match.id)}
                  onChange={() => toggleSkill(match.id)}
                  className="mt-1 size-4"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {match.type === "mcp" ? (
                      <Puzzle className="size-4 text-blue-500 shrink-0" />
                    ) : (
                      <Wrench className="size-4 text-primary shrink-0" />
                    )}
                    <span className="text-sm font-medium">{match.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {match.type}
                    </span>
                    {match.score > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +{match.score}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {match.description}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
                    {match.reason}
                  </p>
                </div>
              </label>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Provider + Generate */}
      {matches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Prompt</CardTitle>
            <CardDescription>Choose the AI provider and build the prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {providers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    provider === p.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <p.icon className="size-4" />
                  {p.name}
                </button>
              ))}
            </div>

            <Button onClick={handleGenerate} disabled={generating || selected.size === 0}>
              {generating ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 size-4" />
              )}
              {generating ? "Generating..." : "Generate Prompt"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Result */}
      {prompt && (
        <Card className="border-primary/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Generated Prompt
              </CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="mr-2 size-3.5" />
                ) : (
                  <Copy className="mr-2 size-3.5" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm font-mono overflow-auto max-h-96">
              {prompt}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
