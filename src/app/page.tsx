"use client";

import Link from "next/link";
import { useCollection } from "@/hooks/use-collection";
import { categoryLabels, categories } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { CategoryBadge } from "@/components/shared/category-badge";
import { CollectionChart } from "@/components/shared/collection-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalItems}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Invested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</p>
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
              {gainLoss >= 0 ? "+" : ""}{formatCurrency(gainLoss)}
            </p>
          </CardContent>
        </Card>
        {stats.soldItems > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Realized Gains
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${stats.realizedGains >= 0 ? "text-green-600" : "text-red-600"}`}>
                {stats.realizedGains >= 0 ? "+" : ""}{formatCurrency(stats.realizedGains)}
              </p>
              <p className="text-xs text-muted-foreground">{stats.soldItems} item{stats.soldItems !== 1 ? "s" : ""} sold</p>
            </CardContent>
          </Card>
        )}
      </div>

      <CollectionChart items={items} />

      {categories.some((cat) => stats.byCategory[cat] > 0) && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">By Category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories
              .filter((cat) => stats.byCategory[cat] > 0)
              .map((cat) => (
                <Card key={cat}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {categoryLabels[cat]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stats.byCategory[cat]}</p>
                  </CardContent>
                </Card>
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
