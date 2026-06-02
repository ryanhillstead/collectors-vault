import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "Your vault is empty",
  description = "Every great collection starts with a single piece. Add your first item and watch its worth take shape.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="reveal relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/70 bg-card/50 px-6 py-20 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />
      <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-gold/12 text-gold ring-1 ring-gold/25">
        <Sparkles className="size-6" />
      </span>
      <h3 className="font-display text-2xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Button asChild className="mt-6 font-semibold">
        <Link href="/add">Add your first item</Link>
      </Button>
    </div>
  );
}
