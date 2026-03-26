"use client";

import { useCallback, useEffect, useState } from "react";
import { CollectionItem, Category } from "@/lib/types";
import * as storage from "@/lib/storage";

export interface CollectionStats {
  totalItems: number;
  totalInvested: number;
  totalValue: number;
  byCategory: Record<Category, number>;
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
    byCategory: {
      "video-game": activeItems.filter((i) => i.category === "video-game").length,
      "trading-card": activeItems.filter((i) => i.category === "trading-card").length,
      comic: activeItems.filter((i) => i.category === "comic").length,
      "funko-pop": activeItems.filter((i) => i.category === "funko-pop").length,
      "lego-set": activeItems.filter((i) => i.category === "lego-set").length,
      coin: activeItems.filter((i) => i.category === "coin").length,
      "sports-card": activeItems.filter((i) => i.category === "sports-card").length,
    },
    realizedGains: soldItems.reduce(
      (sum, item) => sum + (item.soldPrice! - item.purchasePrice),
      0
    ),
    soldItems: soldItems.length,
  };

  return { items, isLoaded, stats, addItem, updateItem, deleteItem, markAsSold };
}
