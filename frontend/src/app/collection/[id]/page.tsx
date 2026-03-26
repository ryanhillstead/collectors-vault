"use client";

import { use, useState } from "react";
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
import { SellDialog } from "@/components/items/sell-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ItemImage } from "@/components/shared/item-image";
import { StatCard } from "@/components/shared/stat-card";
import { Badge } from "@/components/ui/badge";

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { deleteItem, markAsSold } = useCollection();
  const [item, setItem] = useState<CollectionItem | null>(() => getItem(id) ?? null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);

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

  const isSold = item.soldPrice !== undefined;

  const gainLoss = isSold
    ? item.soldPrice! - item.purchasePrice
    : item.currentValue - item.purchasePrice;
  const gainLossPercent = item.purchasePrice > 0
    ? ((gainLoss / item.purchasePrice) * 100).toFixed(1)
    : "0.0";

  function handleDelete() {
    deleteItem(item!.id);
    toast.success("Item deleted");
    router.push("/collection");
  }

  function handleSell(soldPrice: number, soldDate: string) {
    const updated = markAsSold(item!.id, soldPrice, soldDate);
    if (updated) {
      setItem(updated);
      toast.success("Item marked as sold");
    }
    setSellOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{item.name}</h1>
          {isSold && <Badge variant="secondary">Sold</Badge>}
        </div>
        <div className="flex gap-2">
          {!isSold && (
            <>
              <Button variant="outline" asChild>
                <Link href={`/edit/${item.id}`}>Edit</Link>
              </Button>
              <Button variant="outline" onClick={() => setSellOpen(true)}>
                Mark as Sold
              </Button>
            </>
          )}
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
        <StatCard label="Purchase Price" value={formatCurrency(item.purchasePrice)} />
        <StatCard
          label={isSold ? "Sold For" : "Current Value"}
          value={formatCurrency(isSold ? item.soldPrice! : item.currentValue)}
        />
        <StatCard
          label={isSold ? "Realized Gain / Loss" : "Gain / Loss"}
          value={`${gainLoss >= 0 ? "+" : ""}${formatCurrency(gainLoss)} (${gainLossPercent}%)`}
          variant={gainLoss >= 0 ? "success" : "error"}
        />
      </div>

      <Separator className="my-6" />

      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Purchase Date</dt>
          <dd>{formatDate(item.purchaseDate)}</dd>
        </div>
        {isSold && item.soldDate && (
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Sold Date</dt>
            <dd>{formatDate(item.soldDate)}</dd>
          </div>
        )}
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
      <SellDialog
        open={sellOpen}
        onOpenChange={setSellOpen}
        itemName={item.name}
        onConfirm={handleSell}
      />
    </div>
  );
}
