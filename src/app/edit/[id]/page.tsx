"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { CollectionItem, Category, Condition } from "@/lib/types";
import { getItem } from "@/lib/storage";
import { ItemFormValues, dollarsToCents } from "@/lib/schemas";
import { useCollection } from "@/hooks/use-collection";
import { ItemForm } from "@/components/items/item-form";
import { Button } from "@/components/ui/button";

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { updateItem } = useCollection();
  const [item, setItem] = useState<CollectionItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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

  function handleSubmit(data: ItemFormValues) {
    updateItem(id, {
      name: data.name,
      category: data.category as Category,
      subcategory: data.subcategory || undefined,
      purchasePrice: dollarsToCents(data.purchasePrice),
      currentValue: dollarsToCents(data.currentValue),
      purchaseDate: data.purchaseDate,
      condition: data.condition as Condition,
      imageUrl: data.imageUrl,
      notes: data.notes,
    });
    toast.success("Item updated!");
    router.push(`/collection/${id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Edit Item</h1>
      <ItemForm
        mode="edit"
        defaultValues={{
          name: item.name,
          category: item.category,
          subcategory: item.subcategory ?? "",
          purchasePrice: (item.purchasePrice / 100).toFixed(2),
          currentValue: (item.currentValue / 100).toFixed(2),
          purchaseDate: item.purchaseDate,
          condition: item.condition,
          imageUrl: item.imageUrl,
          notes: item.notes,
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
