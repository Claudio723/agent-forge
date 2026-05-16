"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Wrench, ArrowRight } from "lucide-react";
import { updateProfile, createSkill } from "@/app/dashboard/actions";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingProps {
  hasName: boolean;
}

export function Onboarding({ hasName }: OnboardingProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (!hasName) setOpen(true);
  }, [hasName]);

  const steps = [
    {
      title: "Welcome to AgentForge",
      description: "Your personal AI workbench. Let's set you up in 3 quick steps.",
      icon: Sparkles,
    },
    {
      title: "What should we call you?",
      description: "Set your display name",
      icon: null,
    },
    {
      title: "Add your first skill",
      description: "Skills are the building blocks of your AI workflow",
      icon: Wrench,
    },
    {
      title: "Try the Prompt Builder",
      description: "The heart of AgentForge — builds prompts from your tools",
      icon: Sparkles,
    },
  ];

  async function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await updateProfile(formData);
    setStep(2);
  }

  async function handleSkillSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("type", "skill");
    formData.set("config", "{}");
    await createSkill(formData);
    setStep(3);
  }

  function handleFinish() {
    setOpen(false);
    router.push("/dashboard/prompt-builder");
  }

  function handleSkip() {
    setOpen(false);
    router.push("/dashboard");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <Sparkles className="size-10 text-primary mb-2" />
                <DialogTitle className="text-xl">{steps[0].title}</DialogTitle>
                <DialogDescription>{steps[0].description}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6">
                <Button onClick={() => setStep(1)}>
                  Get Started <ArrowRight className="ml-2 size-4" />
                </Button>
              </DialogFooter>
            </motion.div>
          ) : step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <DialogTitle>{steps[1].title}</DialogTitle>
                <DialogDescription>{steps[1].description}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleNameSubmit} className="mt-4 space-y-4">
                <Input name="full_name" placeholder="Your name" required autoFocus />
                <DialogFooter className="gap-2">
                  <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                    Skip
                  </Button>
                  <Button type="submit">
                    Save <ArrowRight className="ml-2 size-4" />
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          ) : step === 2 ? (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <Wrench className="size-10 text-primary mb-2" />
                <DialogTitle>{steps[2].title}</DialogTitle>
                <DialogDescription>{steps[2].description}</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSkillSubmit} className="mt-4 space-y-4">
                <Input name="name" placeholder="e.g. Code Review Assistant" required autoFocus />
                <Input name="description" placeholder="What does it do? (optional)" />
                <DialogFooter className="gap-2">
                  <Button type="button" variant="ghost" onClick={() => setStep(3)}>
                    Skip
                  </Button>
                  <Button type="submit">
                    Add Skill <ArrowRight className="ml-2 size-4" />
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <DialogHeader>
                <Sparkles className="size-10 text-primary mb-2" />
                <DialogTitle>{steps[3].title}</DialogTitle>
                <DialogDescription>{steps[3].description}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-6 gap-2">
                <Button variant="ghost" onClick={handleSkip}>
                  Go to Dashboard
                </Button>
                <Button onClick={handleFinish}>
                  Open Prompt Builder <ArrowRight className="ml-2 size-4" />
                </Button>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
