import { Badge } from "@/components/ui/badge";
import { Category, categoryLabels } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColors: Record<Category, string> = {
  "video-game": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "trading-card": "bg-amber-100 text-amber-800 hover:bg-amber-100",
  comic: "bg-orange-100 text-orange-800 hover:bg-orange-100",
  "funko-pop": "bg-pink-100 text-pink-800 hover:bg-pink-100",
  "lego-set": "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  coin: "bg-zinc-100 text-zinc-800 hover:bg-zinc-100",
  "sports-card": "bg-green-100 text-green-800 hover:bg-green-100",
};

const fallbackColor = "bg-gray-100 text-gray-800 hover:bg-gray-100";

export function CategoryBadge({ category }: { category: string }) {
  const color = categoryColors[category as Category] ?? fallbackColor;
  const label = categoryLabels[category as Category] ?? category;
  return (
    <Badge variant="secondary" className={cn(color)}>
      {label}
    </Badge>
  );
}
