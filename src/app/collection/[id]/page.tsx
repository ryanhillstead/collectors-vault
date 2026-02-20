"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CollectionItem } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getItem } from "@/lib/storage";
import { useCollection } from "@/hooks/use-collection";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { DeleteDialog } from "@/components/items/delete-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ItemImage } from "@/components/shared/item-image";

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { deleteItem } = useCollection();
  const [item, setItem] = useState<CollectionItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const found = getItem(id);
    setItem(found ?? null);
    setIsLoaded(true);
  }, [id]);

  if (!isLoaded) return null;

  if (!item) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Item Not Found</h1>
        <p className="mt-2 text-muted-foreground">This item doesn&apos;t exist or has been deleted.</p>
        <Button asChild className="mt-4">
          <Link href="/collection">Back to Collection</Link>
        </Button>
      </div>
    );
  }

  const gainLoss = item.currentValue - item.purchasePrice;
  const gainLossPercent = item.purchasePrice > 0
    ? ((gainLoss / item.purchasePrice) * 100).toFixed(1)
    : "0.0";

  function handleDelete() {
    deleteItem(item!.id);
    toast.success("Item deleted");
    router.push("/collection");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/edit/${item.id}`}>Edit</Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <CategoryBadge category={item.category} />
        <ConditionBadge condition={item.condition} />
      </div>

      <ItemImage src={item.imageUrl} alt={item.name} size="lg" className="mb-6" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Purchase Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(item.purchasePrice)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(item.currentValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gain / Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${gainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss)} ({gainLossPercent}%)
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Purchase Date</dt>
          <dd>{formatDate(item.purchaseDate)}</dd>
        </div>
        {item.notes && (
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Notes</dt>
            <dd className="whitespace-pre-wrap">{item.notes}</dd>
          </div>
        )}
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Added</dt>
          <dd>{formatDate(item.createdAt)}</dd>
        </div>
      </dl>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={item.name}
        onConfirm={handleDelete}
      />
    </div>
  );
}
