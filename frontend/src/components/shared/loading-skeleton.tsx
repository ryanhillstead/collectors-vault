export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}
