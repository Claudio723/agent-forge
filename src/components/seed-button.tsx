"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sprout } from "lucide-react";
import { seedDemoData } from "@/app/dashboard/actions";
import { toast } from "sonner";

export function SeedButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSeed() {
    setLoading(true);
    try {
      const result = await seedDemoData();
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success("Demo data seeded! ✨");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSeed}
      disabled={loading}
    >
      <Sprout className="mr-2 size-4" />
      {loading ? "Seeding..." : "Seed demo data"}
    </Button>
  );
}
