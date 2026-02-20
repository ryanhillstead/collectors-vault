import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No items yet",
  description = "Start building your collection by adding your first item.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <Button asChild className="mt-4">
        <Link href="/add">Add Item</Link>
      </Button>
    </div>
  );
}
