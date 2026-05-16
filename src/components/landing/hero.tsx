"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Wrench, Puzzle, Key, StickyNote, FolderKanban, ArrowRight, Zap, Shield, Gauge } from "lucide-react";

const features = [
  { icon: Wrench, title: "Skills & MCPs Library", description: "Organize, search, and manage all your AI skills and Model Context Protocols in one place." },
  { icon: Sparkles, title: "Smart Prompt Builder", description: "Describe your goal — AgentForge matches the right tools and generates an optimized prompt." },
  { icon: Shield, title: "API Vault", description: "Store API keys encrypted server-side with pgcrypto. Keys never reach the client." },
  { icon: StickyNote, title: "Notes & Journal", description: "Capture ideas, experiments, and insights with tags, categories, and mood tracking." },
  { icon: FolderKanban, title: "Projects", description: "Group skills into projects. Keep your workspace organized." },
  { icon: Gauge, title: "Blazing Fast", description: "Built on Next.js 16 with Turbopack, Tailwind v4, and Supabase for real-time data." },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-40 sm:pb-32 lg:px-8 bg-mesh">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative mx-auto max-w-4xl text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary backdrop-blur-sm">
            <Zap className="size-4" />Your personal AI workbench
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            Forge your{" "}
            <span className="text-gradient">AI workflow</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            One central workspace for all your AI tools. Manage skills, MCPs, prompts, API keys, projects, and notes — with a smart prompt builder that knows your toolkit.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="h-12 px-8 text-base card-elevated" render={<Link href="/login" />}>
              Get Started Free <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base" render={<Link href="/login" />}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need
          </h2>
          <p className="mb-12 text-center text-muted-foreground">
            All the tools to build, manage, and scale your AI workflows
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className="group h-full border-border/50 card-elevated transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                  <CardHeader>
                    <div className="mb-3 inline-flex rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/20 transition-colors group-hover:bg-primary/15">
                      <feature.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="leading-relaxed">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 px-4 py-20 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to level up your AI game?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start organizing your skills, building better prompts, and keeping everything in one place — free forever.
          </p>
          <Button size="lg" className="mt-8 h-12 px-10 text-base card-elevated" render={<Link href="/login" />}>
            Get Started Free <ArrowRight className="ml-2 size-5" />
          </Button>
        </motion.div>
      </section>

      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} AgentForge. Built with Next.js &amp; Supabase.</p>
      </footer>
    </div>
  );
}
