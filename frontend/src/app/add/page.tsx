"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCollection } from "@/hooks/use-collection";
import { ItemForm } from "@/components/items/item-form";
import { ItemFormValues, dollarsToCents } from "@/lib/schemas";
import { Category, Condition } from "@/lib/types";

export default function AddItemPage() {
  const router = useRouter();
  const { addItem } = useCollection();

  function handleSubmit(data: ItemFormValues) {
    addItem({
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
    toast.success("Item added to your collection!");
    router.push("/collection");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold">Add Item</h1>
      <ItemForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}
