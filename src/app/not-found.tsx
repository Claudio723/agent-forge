import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-6xl font-bold text-muted-foreground/30">404</h1>
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button variant="outline" render={<Link href="/dashboard" />}>
        <Home className="mr-2 size-4" />
        Back to Dashboard
      </Button>
    </div>
  );
}
