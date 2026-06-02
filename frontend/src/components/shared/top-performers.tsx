"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CollectionItem } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ItemImage } from "@/components/shared/item-image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PerformerData {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  gainLoss: number;       // cents
  gainLossPercent: number; // percentage
}

function toPerformer(item: CollectionItem): PerformerData {
  const gainLoss = item.currentValue - item.purchasePrice;
  const gainLossPercent = item.purchasePrice > 0
    ? (gainLoss / item.purchasePrice) * 100
    : 0;
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    imageUrl: item.imageUrl,
    gainLoss,
    gainLossPercent,
  };
}

function PerformerRow({ item }: { item: PerformerData }) {
  const isPositive = item.gainLoss >= 0;
  return (
    <Link
      href={`/collection/${item.id}`}
      className="flex items-center justify-between gap-3 rounded-lg border border-border/60 p-3 transition-colors hover:border-gold/30 hover:bg-accent/50"
    >
      <div className="flex min-w-0 items-center gap-3">
        <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.name}</p>
          <CategoryBadge category={item.category} />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <p className={`tnum text-sm font-semibold tabular-nums ${isPositive ? "text-gain" : "text-loss"}`}>
          {isPositive ? "+" : ""}{formatCurrency(item.gainLoss)}
        </p>
        <p className={`tnum text-xs tabular-nums ${isPositive ? "text-gain" : "text-loss"}`}>
          {isPositive ? "+" : ""}{item.gainLossPercent.toFixed(1)}%
        </p>
      </div>
    </Link>
  );
}

interface TopPerformersProps {
  items: CollectionItem[];
}

export function TopPerformers({ items }: TopPerformersProps) {
  const { gainers, losers } = useMemo(() => {
    const active = items
      .filter((i) => i.soldPrice === undefined && i.purchasePrice > 0)
      .map(toPerformer);

    const sorted = [...active].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
    return {
      gainers: sorted.filter((p) => p.gainLoss > 0).slice(0, 3),
      losers: sorted.filter((p) => p.gainLoss < 0).slice(-3).reverse(),
    };
  }, [items]);

  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <div className="space-y-4">
      {gainers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Gainers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {gainers.map((item) => (
              <PerformerRow key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      )}
      {losers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Losers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {losers.map((item) => (
              <PerformerRow key={item.id} item={item} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
