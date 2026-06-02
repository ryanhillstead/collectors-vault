"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Table2, LayoutGrid, LayoutList, Search } from "lucide-react";
import { useCollection } from "@/hooks/use-collection";
import { categories, categoryLabels, conditions, conditionLabels } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CategoryBadge } from "@/components/shared/category-badge";
import { ConditionBadge } from "@/components/shared/condition-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ItemImage } from "@/components/shared/item-image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";

type SortKey = "name" | "purchasePrice" | "currentValue" | "createdAt";
type ViewMode = "table" | "grid" | "list";

function getStoredViewMode(): ViewMode {
  if (typeof window === "undefined") return "table";
  const stored = localStorage.getItem("collectionViewMode");
  if (stored === "table" || stored === "grid" || stored === "list") return stored;
  return "table";
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CollectionContent />
    </Suspense>
  );
}

function CollectionContent() {
  const { items, isLoaded } = useCollection();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>(
    () => {
      const param = searchParams.get("category");
      return param && categories.includes(param as any) ? param : "all";
    }
  );
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("createdAt");
  const [viewMode, setViewMode] = useState<ViewMode>(() => getStoredViewMode());
  const [showSold, setShowSold] = useState(false);

  function handleViewModeChange(value: string) {
    if (value === "table" || value === "grid" || value === "list") {
      setViewMode(value);
      localStorage.setItem("collectionViewMode", value);
    }
  }

  const hasSoldItems = items.some((i) => i.soldPrice !== undefined);

  const filtered = useMemo(() => {
    let result = showSold ? items : items.filter((i) => i.soldPrice === undefined);

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }

    if (categoryFilter !== "all") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    if (conditionFilter !== "all") {
      result = result.filter((item) => item.condition === conditionFilter);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "purchasePrice") return b.purchasePrice - a.purchasePrice;
      if (sortBy === "currentValue") return b.currentValue - a.currentValue;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [items, search, categoryFilter, conditionFilter, sortBy, showSold]);

  if (!isLoaded) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div className="reveal flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
            The Vault
          </p>
          <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Collection</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "piece" : "pieces"} on
            display
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasSoldItems && (
            <button
              onClick={() => setShowSold((v) => !v)}
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              {showSold ? "Hide sold" : "Show sold"}
            </button>
          )}
          <ToggleGroup type="single" value={viewMode} onValueChange={handleViewModeChange}>
            <ToggleGroupItem value="table" aria-label="Table view">
              <Table2 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <LayoutList className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div className="reveal reveal-1 grid grid-cols-1 gap-3 rounded-xl border border-border/70 bg-card/50 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {categoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            {conditions.map((cond) => (
              <SelectItem key={cond} value={cond}>
                {conditionLabels[cond]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortKey)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Added</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="purchasePrice">Purchase Price</SelectItem>
            <SelectItem value="currentValue">Current Value</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="reveal reveal-2">
        {items.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 py-16 text-center text-muted-foreground">
            No items match your filters.
          </p>
        ) : viewMode === "table" ? (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card/50">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead className="text-right">Purchase Price</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead>Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((item) => {
                  const value =
                    item.soldPrice !== undefined ? item.soldPrice : item.currentValue;
                  const up = value >= item.purchasePrice;
                  return (
                    <TableRow key={item.id} className="hover:bg-accent/50">
                      <TableCell>
                        <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/collection/${item.id}`}
                            className="font-medium hover:text-gold hover:underline"
                          >
                            {item.name}
                          </Link>
                          {item.soldPrice !== undefined && (
                            <Badge variant="secondary" className="text-xs">Sold</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <CategoryBadge category={item.category} />
                      </TableCell>
                      <TableCell>
                        <ConditionBadge condition={item.condition} />
                      </TableCell>
                      <TableCell className="tnum text-right tabular-nums text-muted-foreground">
                        {formatCurrency(item.purchasePrice)}
                      </TableCell>
                      <TableCell
                        className={`tnum text-right font-medium tabular-nums ${
                          up ? "text-gain" : "text-loss"
                        }`}
                      >
                        {formatCurrency(value)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((item) => {
              const value =
                item.soldPrice !== undefined ? item.soldPrice : item.currentValue;
              const up = value >= item.purchasePrice;
              return (
                <Link key={item.id} href={`/collection/${item.id}`}>
                  <Card className="vault-card h-full overflow-hidden">
                    <CardContent className="p-4">
                      <div className="mb-3 flex items-center justify-center rounded-lg bg-muted/40 p-2">
                        <ItemImage src={item.imageUrl} alt={item.name} size="md" />
                      </div>
                      <p className="truncate font-medium">{item.name}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <CategoryBadge category={item.category} />
                        {item.soldPrice !== undefined && (
                          <Badge variant="secondary" className="text-xs">Sold</Badge>
                        )}
                      </div>
                      <p
                        className={`tnum mt-3 text-lg font-semibold tabular-nums ${
                          up ? "text-gain" : "text-loss"
                        }`}
                      >
                        {formatCurrency(value)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card/50">
            {filtered.map((item, i) => {
              const value =
                item.soldPrice !== undefined ? item.soldPrice : item.currentValue;
              const up = value >= item.purchasePrice;
              return (
                <Link
                  key={item.id}
                  href={`/collection/${item.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-accent/50"
                  style={{ borderTop: i === 0 ? undefined : "1px solid var(--border)" }}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{item.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <CategoryBadge category={item.category} />
                        <ConditionBadge condition={item.condition} />
                        {item.soldPrice !== undefined && (
                          <Badge variant="secondary" className="text-xs">Sold</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <p
                    className={`tnum shrink-0 font-semibold tabular-nums ${
                      up ? "text-gain" : "text-loss"
                    }`}
                  >
                    {formatCurrency(value)}
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
