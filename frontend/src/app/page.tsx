"use client";

import Link from "next/link";
import { useCollection } from "@/hooks/use-collection";
import { categoryLabels, categories } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { CategoryBadge } from "@/components/shared/category-badge";
import { CollectionChart } from "@/components/shared/collection-chart";
import { StatCard } from "@/components/shared/stat-card";
import { ItemImage } from "@/components/shared/item-image";

export default function DashboardPage() {
  const { items, isLoaded, stats } = useCollection();

  if (!isLoaded) return <LoadingSkeleton />;

  if (items.length === 0) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <EmptyState />
      </div>
    );
  }

  const gainLoss = stats.totalValue - stats.totalInvested;
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Items" value={stats.totalItems} />
        <StatCard label="Total Invested" value={formatCurrency(stats.totalInvested)} />
        <StatCard label="Total Value" value={formatCurrency(stats.totalValue)} />
        <StatCard
          label="Gain / Loss"
          value={`${gainLoss >= 0 ? "+" : ""}${formatCurrency(gainLoss)}`}
          variant={gainLoss >= 0 ? "success" : "error"}
        />
        {stats.soldItems > 0 && (
          <StatCard
            label="Realized Gains"
            value={`${stats.realizedGains >= 0 ? "+" : ""}${formatCurrency(stats.realizedGains)}`}
            variant={stats.realizedGains >= 0 ? "success" : "error"}
            subtext={`${stats.soldItems} item${stats.soldItems !== 1 ? "s" : ""} sold`}
          />
        )}
      </div>

      <CollectionChart items={items} />

      {categories.some((cat) => stats.byCategory[cat].count > 0) && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">By Category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories
              .filter((cat) => stats.byCategory[cat].count > 0)
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/collection?category=${cat}`}
                  className="transition-colors hover:opacity-80"
                >
                  <StatCard label={categoryLabels[cat]} value={stats.byCategory[cat].count} />
                </Link>
              ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-lg font-semibold">Recently Added</h2>
        <div className="space-y-3">
          {recentItems.map((item) => (
            <Link
              key={item.id}
              href={`/collection/${item.id}`}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CategoryBadge category={item.category} />
                <span className="font-medium">{formatCurrency(item.currentValue)}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
