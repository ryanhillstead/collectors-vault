"use client";

import Link from "next/link";
import {
  Wallet,
  Coins,
  TrendingUp,
  TrendingDown,
  Package,
  Banknote,
  ArrowUpRight,
} from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { categoryLabels, categories } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { CategoryBadge } from "@/components/shared/category-badge";
import { CollectionChart } from "@/components/shared/collection-chart";
import { CategoryDonutChart } from "@/components/shared/category-donut-chart";
import { TopPerformers } from "@/components/shared/top-performers";
import { CollectionTimeline } from "@/components/shared/collection-timeline";
import { StatCard } from "@/components/shared/stat-card";
import { ItemImage } from "@/components/shared/item-image";
import { useValueHistory } from "@/hooks/use-value-history";

export default function DashboardPage() {
  const { items, isLoaded, stats } = useCollection();
  const snapshots = useValueHistory(items, isLoaded);

  if (!isLoaded) return <LoadingSkeleton />;

  if (items.length === 0) {
    return (
      <div className="space-y-8">
        <DashboardHeading subtitle="Track every piece you treasure." />
        <EmptyState />
      </div>
    );
  }

  const gainLoss = stats.totalValue - stats.totalInvested;
  const gainPct =
    stats.totalInvested > 0 ? (gainLoss / stats.totalInvested) * 100 : 0;
  const isUp = gainLoss >= 0;

  const recentItems = [...items]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <DashboardHeading
        subtitle={`${stats.totalItems} ${
          stats.totalItems === 1 ? "piece" : "pieces"
        } under your care.`}
      />

      {/* Hero figures */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="reveal reveal-1 sm:col-span-2">
          <StatCard
            label="Total Value"
            value={formatCurrency(stats.totalValue)}
            subtext={
              <span
                className={isUp ? "text-gain" : "text-loss"}
              >
                {isUp ? "▲" : "▼"} {isUp ? "+" : ""}
                {formatCurrency(gainLoss)} ({isUp ? "+" : ""}
                {gainPct.toFixed(1)}%) all-time
              </span>
            }
            icon={<Wallet />}
            emphasis
          />
        </div>
        <div className="reveal reveal-2">
          <StatCard
            label="Invested"
            value={formatCurrency(stats.totalInvested)}
            icon={<Banknote />}
          />
        </div>
        <div className="reveal reveal-3">
          <StatCard
            label="Items"
            value={stats.totalItems}
            icon={<Package />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="reveal reveal-3">
          <StatCard
            label="Unrealized"
            value={`${isUp ? "+" : ""}${formatCurrency(gainLoss)}`}
            variant={isUp ? "success" : "error"}
            icon={isUp ? <TrendingUp /> : <TrendingDown />}
          />
        </div>
        {stats.soldItems > 0 && (
          <div className="reveal reveal-4">
            <StatCard
              label="Realized Gains"
              value={`${stats.realizedGains >= 0 ? "+" : ""}${formatCurrency(
                stats.realizedGains
              )}`}
              variant={stats.realizedGains >= 0 ? "success" : "error"}
              subtext={`${stats.soldItems} item${
                stats.soldItems !== 1 ? "s" : ""
              } sold`}
              icon={<Coins />}
            />
          </div>
        )}
      </div>

      <div className="reveal reveal-4">
        <CollectionChart items={items} snapshots={snapshots} />
      </div>

      <div className="reveal reveal-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryDonutChart byCategory={stats.byCategory} />
        <TopPerformers items={items} />
      </div>

      <div className="reveal reveal-5">
        <CollectionTimeline items={items} />
      </div>

      {categories.some((cat) => stats.byCategory[cat].count > 0) && (
        <section className="reveal reveal-6">
          <SectionHeading>By Category</SectionHeading>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories
              .filter((cat) => stats.byCategory[cat].count > 0)
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/collection?category=${cat}`}
                  className="group focus:outline-none"
                >
                  <StatCard
                    label={categoryLabels[cat]}
                    value={stats.byCategory[cat].count}
                    subtext={formatCurrency(stats.byCategory[cat].totalValue)}
                  />
                </Link>
              ))}
          </div>
        </section>
      )}

      <section className="reveal reveal-6">
        <SectionHeading
          action={
            <Link
              href="/collection"
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              View all <ArrowUpRight className="size-4" />
            </Link>
          }
        >
          Recently Added
        </SectionHeading>
        <div className="overflow-hidden rounded-xl border border-border/70 bg-card/50">
          {recentItems.map((item, i) => (
            <Link
              key={item.id}
              href={`/collection/${item.id}`}
              className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/60"
              style={{
                borderTop: i === 0 ? undefined : "1px solid var(--border)",
              }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(item.createdAt)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="hidden sm:inline">
                  <CategoryBadge category={item.category} />
                </span>
                <span className="tnum font-medium tabular-nums">
                  {formatCurrency(item.currentValue)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DashboardHeading({ subtitle }: { subtitle: string }) {
  return (
    <div className="reveal">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
        The Vault
      </p>
      <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Dashboard</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function SectionHeading({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <h2 className="text-xl font-semibold">{children}</h2>
      {action}
    </div>
  );
}
