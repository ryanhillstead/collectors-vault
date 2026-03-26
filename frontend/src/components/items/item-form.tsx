"use client";

import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { itemFormSchema, ItemFormValues } from "@/lib/schemas";
import { categories, categoryLabels, conditions, conditionLabels } from "@/lib/types";
import { subcategoryOptions, subcategoryLabel } from "@/lib/categories";
import { getCatalogItems } from "@/lib/mock-catalog";
import { mockLookupPrice } from "@/lib/mock-pricecharting";
import { lookupItemImage } from "@/lib/mock-image-lookup";
import { ItemCombobox } from "@/components/items/item-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemImage } from "@/components/shared/item-image";

interface ItemFormProps {
  mode: "create" | "edit";
  defaultValues?: ItemFormValues;
  onSubmit: (data: ItemFormValues) => void;
  isSubmitting?: boolean;
}

export function ItemForm({ mode, defaultValues, onSubmit, isSubmitting }: ItemFormProps) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      category: undefined,
      subcategory: "",
      purchasePrice: "",
      currentValue: "",
      purchaseDate: "",
      condition: undefined,
      imageUrl: "",
      notes: "",
    },
  });

  const [isPriceFetching, setIsPriceFetching] = useState(false);
  const [priceSourced, setPriceSourced] = useState(false);
  const [isImageFetching, setIsImageFetching] = useState(false);

  const selectedCategory = useWatch({ control: form.control, name: "category" });
  const selectedSubcategory = useWatch({ control: form.control, name: "subcategory" });
  const itemName = useWatch({ control: form.control, name: "name" });

  // Reset subcategory + name whenever category changes
  useEffect(() => {
    form.setValue("subcategory", "");
    form.setValue("name", "");
    setPriceSourced(false);
  }, [selectedCategory, form]);

  // Reset name when subcategory changes (new platform = new item list)
  useEffect(() => {
    form.setValue("name", "");
    setPriceSourced(false);
  }, [selectedSubcategory, form]);

  // In create mode: auto-fetch price + image when name + category are ready
  useEffect(() => {
    if (mode !== "create") return;
    if (!itemName?.trim() || !selectedCategory) return;

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      if (controller.signal.aborted) return;

      // Price fetch
      setIsPriceFetching(true);
      setPriceSourced(false);
      form.setValue("currentValue", "");

      // Image fetch
      setIsImageFetching(true);
      form.setValue("imageUrl", "");

      try {
        const [price, imageUrl] = await Promise.all([
          mockLookupPrice(itemName.trim(), selectedCategory),
          lookupItemImage(itemName.trim(), selectedCategory),
        ]);

        if (controller.signal.aborted) return;

        form.setValue("currentValue", price.toFixed(2), { shouldValidate: true });
        setPriceSourced(true);

        if (imageUrl) {
          form.setValue("imageUrl", imageUrl, { shouldValidate: true });
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsPriceFetching(false);
          setIsImageFetching(false);
        }
      }
    }, 600);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [itemName, selectedCategory, mode, form]);

  const subcatOptions = selectedCategory ? subcategoryOptions[selectedCategory] : [];
  const subcatLabel = selectedCategory ? subcategoryLabel[selectedCategory] : "Subcategory";
  const catalogItems = selectedCategory
    ? getCatalogItems(selectedCategory, selectedSubcategory || undefined)
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* Category + Condition */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categoryLabels[cat]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditions.map((cond) => (
                      <SelectItem key={cond} value={cond}>
                        {conditionLabels[cond]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Subcategory (platform / series / etc.) */}
        {selectedCategory && (
          <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{subcatLabel} (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${subcatLabel.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {subcatOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Item name — combobox in create mode, plain input in edit mode */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item</FormLabel>
              <FormControl>
                {mode === "create" ? (
                  <ItemCombobox
                    items={catalogItems}
                    value={field.value}
                    onChange={field.onChange}
                    disabled={!selectedCategory}
                    placeholder={
                      selectedCategory
                        ? "Search and select an item…"
                        : "Select a category first"
                    }
                  />
                ) : (
                  <Input placeholder="e.g. Super Mario Bros." {...field} />
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Purchase price + Current value */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price ($)</FormLabel>
                <FormControl>
                  <Input type="text" inputMode="decimal" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currentValue"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Current Value ($)</FormLabel>
                  {isPriceFetching && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Fetching from PriceCharting…
                    </span>
                  )}
                </div>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder={mode === "create" ? "Auto-fetched from PriceCharting" : "0.00"}
                    readOnly={mode === "create"}
                    className={mode === "create" ? "bg-muted text-muted-foreground" : ""}
                    {...field}
                  />
                </FormControl>
                {priceSourced && (
                  <p className="text-xs text-muted-foreground">
                    Price sourced from{" "}
                    <span className="font-medium text-foreground">PriceCharting.com</span>
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="purchaseDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Purchase Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Image URL (optional)</FormLabel>
                {isImageFetching && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Looking up image…
                  </span>
                )}
              </div>
              <FormControl>
                <Input type="url" placeholder="https://..." {...field} />
              </FormControl>
              <FormMessage />
              {form.watch("imageUrl") && (
                <ItemImage src={form.watch("imageUrl")} alt="Preview" size="md" className="mt-2" />
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any additional details..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {mode === "create" ? "Add Item" : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}
