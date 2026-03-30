"use client";

import { useCallback, useEffect, useState } from "react";
import { CollectionItem, Category, CategoryStats } from "@/lib/types";
import * as storage from "@/lib/storage";

export interface CollectionStats {
  totalItems: number;
  totalInvested: number;
  totalValue: number;
  byCategory: Record<Category, CategoryStats>;
  realizedGains: number;
  soldItems: number;
}

export function useCollection() {
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(storage.getItems());
    setIsLoaded(true);
  }, []);

  const addItem = useCallback(
    (item: Omit<CollectionItem, "id" | "createdAt" | "updatedAt">) => {
      const newItem = storage.addItem(item);
      setItems(storage.getItems());
      return newItem;
    },
    []
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<CollectionItem, "id" | "createdAt">>) => {
      const updated = storage.updateItem(id, updates);
      if (updated) setItems(storage.getItems());
      return updated;
    },
    []
  );

  const deleteItem = useCallback((id: string) => {
    const deleted = storage.deleteItem(id);
    if (deleted) setItems(storage.getItems());
    return deleted;
  }, []);

  const markAsSold = useCallback(
    (id: string, soldPrice: number, soldDate: string) => {
      const updated = storage.updateItem(id, { soldPrice, soldDate });
      if (updated) setItems(storage.getItems());
      return updated;
    },
    []
  );

  const activeItems = items.filter((i) => i.soldPrice === undefined);
  const soldItems = items.filter((i) => i.soldPrice !== undefined);

  const stats: CollectionStats = {
    totalItems: activeItems.length,
    totalInvested: activeItems.reduce((sum, item) => sum + item.purchasePrice, 0),
    totalValue: activeItems.reduce((sum, item) => sum + item.currentValue, 0),
    byCategory: Object.fromEntries(
      (["video-game", "trading-card", "comic", "funko-pop", "lego-set", "coin", "sports-card"] as Category[]).map((cat) => {
        const catItems = activeItems.filter((i) => i.category === cat);
        return [cat, {
          count: catItems.length,
          totalInvested: catItems.reduce((sum, i) => sum + i.purchasePrice, 0),
          totalValue: catItems.reduce((sum, i) => sum + i.currentValue, 0),
        }];
      })
    ) as Record<Category, CategoryStats>,
    realizedGains: soldItems.reduce(
      (sum, item) => sum + (item.soldPrice! - item.purchasePrice),
      0
    ),
    soldItems: soldItems.length,
  };

  return { items, isLoaded, stats, addItem, updateItem, deleteItem, markAsSold };
}
