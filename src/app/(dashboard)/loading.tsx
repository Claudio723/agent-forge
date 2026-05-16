export default function DashboardLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
