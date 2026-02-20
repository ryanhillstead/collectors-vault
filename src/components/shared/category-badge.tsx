import { Badge } from "@/components/ui/badge";
import { Category, categoryLabels } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryColors: Record<Category, string> = {
  "video-game": "bg-blue-100 text-blue-800 hover:bg-blue-100",
  console: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  "trading-card": "bg-amber-100 text-amber-800 hover:bg-amber-100",
  movie: "bg-green-100 text-green-800 hover:bg-green-100",
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <Badge variant="secondary" className={cn(categoryColors[category])}>
      {categoryLabels[category]}
    </Badge>
  );
}
