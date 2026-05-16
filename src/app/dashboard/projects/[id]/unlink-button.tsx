"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

export function UnlinkButton({ action }: { action: () => Promise<void> }) {
  const router = useRouter();

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await action();
    toast.success("Unlinked");
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
      onClick={handleClick}
    >
      <X className="size-3" />
    </Button>
  );
}
