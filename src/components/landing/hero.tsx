"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sparkles,
  Wrench,
  Puzzle,
  Key,
  StickyNote,
  FolderKanban,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Skills & MCPs Library",
    description:
      "Organize, search, and manage all your AI skills and Model Context Protocols in one place.",
  },
  {
    icon: Sparkles,
    title: "Smart Prompt Builder",
    description:
      "Describe your goal — AgentForge selects the right skills and generates an optimized prompt.",
  },
  {
    icon: Key,
    title: "API Vault",
    description:
      "Securely store API keys with server-side encryption. Keys never reach the client in plain text.",
  },
  {
    icon: StickyNote,
    title: "Notes & Journal",
    description:
      "Capture ideas, experiments, and insights with tags, categories, and mood tracking.",
  },
  {
    icon: FolderKanban,
    title: "Projects",
    description:
      "Group related skills and notes into projects. Keep everything connected and organized.",
  },
  {
    icon: Puzzle,
    title: "Extensible by Design",
    description:
      "Built on open standards. Add custom skills, connect external tools, and grow your workspace.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground"
          >
            <Zap className="size-4 text-primary" />
            Your personal AI workbench
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Build smarter with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AgentForge
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl">
            The central workspace for AI tools — manage skills, MCPs, prompts,
            API keys, projects, and notes. Let the Smart Prompt Builder craft
            the perfect prompt from your toolkit.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" render={<Link href="/login" />}>
              Get Started <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/login" />}>
              Sign In
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto max-w-6xl"
        >
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader>
                    <feature.icon className="mb-2 size-8 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to forge your AI workspace?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start organizing your skills, building better prompts, and keeping
            everything in one place — free.
          </p>
          <Button size="lg" className="mt-8" render={<Link href="/login" />}>
            Get Started Free <ArrowRight className="ml-2 size-4" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        <p>&copy; {new Date().getFullYear()} AgentForge. Built with Next.js &amp; Supabase.</p>
      </footer>
    </div>
  );
}
