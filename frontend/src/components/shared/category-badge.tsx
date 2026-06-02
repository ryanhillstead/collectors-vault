import { Badge } from "@/components/ui/badge";
import { Category, categoryLabels } from "@/lib/types";
import { cn } from "@/lib/utils";

// Translucent, ring-bordered tints that read cleanly on both the ivory
// ledger and the dark vault. Color carried by text + ring, not a solid fill.
const categoryColors: Record<Category, string> = {
  "video-game": "bg-blue-500/12 text-blue-600 ring-blue-500/25 dark:text-blue-300",
  "trading-card": "bg-amber-500/12 text-amber-700 ring-amber-500/25 dark:text-amber-300",
  comic: "bg-orange-500/12 text-orange-700 ring-orange-500/25 dark:text-orange-300",
  "funko-pop": "bg-pink-500/12 text-pink-600 ring-pink-500/25 dark:text-pink-300",
  "lego-set": "bg-yellow-500/12 text-yellow-700 ring-yellow-500/25 dark:text-yellow-300",
  coin: "bg-zinc-500/12 text-zinc-700 ring-zinc-500/25 dark:text-zinc-300",
  "sports-card": "bg-emerald-500/12 text-emerald-700 ring-emerald-500/25 dark:text-emerald-300",
};

const fallbackColor =
  "bg-gray-500/12 text-gray-700 ring-gray-500/25 dark:text-gray-300";

export function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category as Category] ?? fallbackColor;
  const label = categoryLabels[category as Category] ?? category;
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-0 ring-1 ring-inset font-medium tracking-tight",
        color
      )}
    >
      {label}
    </Badge>
  );
}
