"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Table2, LayoutGrid, LayoutList } from "lucide-react";
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
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Collection</h1>
        <div className="flex items-center gap-3">
          {hasSoldItems && (
            <button
              onClick={() => setShowSold((v) => !v)}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              {showSold ? "Hide sold items" : "Show sold items"}
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

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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

      {items.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted-foreground">No items match your filters.</p>
      ) : viewMode === "table" ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
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
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/collection/${item.id}`}
                        className="font-medium hover:underline"
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
                  <TableCell className="text-right">
                    {formatCurrency(item.purchasePrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.soldPrice !== undefined
                      ? formatCurrency(item.soldPrice)
                      : formatCurrency(item.currentValue)}
                  </TableCell>
                  <TableCell>{formatDate(item.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <Link key={item.id} href={`/collection/${item.id}`}>
              <Card className="transition-colors hover:bg-muted/50">
                <CardContent className="p-4">
                  <ItemImage src={item.imageUrl} alt={item.name} size="md" className="mx-auto mb-3" />
                  <p className="truncate font-medium">{item.name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <CategoryBadge category={item.category} />
                    {item.soldPrice !== undefined && (
                      <Badge variant="secondary" className="text-xs">Sold</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">
                    {item.soldPrice !== undefined
                      ? formatCurrency(item.soldPrice)
                      : formatCurrency(item.currentValue)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              href={`/collection/${item.id}`}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <ItemImage src={item.imageUrl} alt={item.name} size="sm" />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <CategoryBadge category={item.category} />
                    <ConditionBadge condition={item.condition} />
                    {item.soldPrice !== undefined && (
                      <Badge variant="secondary" className="text-xs">Sold</Badge>
                    )}
                  </div>
                </div>
              </div>
              <p className="font-medium">
                {item.soldPrice !== undefined
                  ? formatCurrency(item.soldPrice)
                  : formatCurrency(item.currentValue)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
