export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/60"
          />
        ))}
      </div>
      <div className="h-[280px] animate-pulse rounded-xl border border-border/60 bg-muted/60" />
    </div>
  );
}
