"use client";

import { useEffect } from "react";
import { CollectionItem, ValueSnapshot } from "@/lib/types";
import { getSnapshots, addSnapshot } from "@/lib/snapshot-storage";

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useValueHistory(items: CollectionItem[], isLoaded: boolean): ValueSnapshot[] {
  useEffect(() => {
    if (!isLoaded) return;
    const activeItems = items.filter((i) => i.soldPrice === undefined);
    if (activeItems.length === 0) return;

    const today = todayString();
    const snapshots = getSnapshots();
    const lastDate = snapshots.length > 0 ? snapshots[snapshots.length - 1].date : null;

    if (lastDate === today) return;

    addSnapshot({
      date: today,
      totalInvested: activeItems.reduce((sum, i) => sum + i.purchasePrice, 0),
      totalValue: activeItems.reduce((sum, i) => sum + i.currentValue, 0),
      itemCount: activeItems.length,
    });
  }, [items, isLoaded]);

  return getSnapshots();
}
