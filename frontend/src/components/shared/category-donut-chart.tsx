"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Category, CategoryStats, categoryLabels } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const CATEGORY_COLORS: Record<Category, string> = {
  "video-game": "hsl(217, 91%, 60%)",
  "trading-card": "hsl(38, 92%, 50%)",
  comic: "hsl(25, 95%, 53%)",
  "funko-pop": "hsl(330, 81%, 60%)",
  "lego-set": "hsl(48, 96%, 53%)",
  coin: "hsl(240, 5%, 64%)",
  "sports-card": "hsl(142, 71%, 45%)",
};

type ViewMode = "value" | "invested";

interface CategoryDonutChartProps {
  byCategory: Record<Category, CategoryStats>;
}

export function CategoryDonutChart({ byCategory }: CategoryDonutChartProps) {
  const [view, setView] = useState<ViewMode>("value");

  const data = useMemo(() => {
    return (Object.entries(byCategory) as [Category, CategoryStats][])
      .filter(([, s]) => s.count > 0)
      .map(([cat, s]) => ({
        name: categoryLabels[cat],
        category: cat,
        value: view === "value" ? s.totalValue : s.totalInvested,
        displayValue: formatCurrency(view === "value" ? s.totalValue : s.totalInvested),
      }));
  }, [byCategory, view]);

  const categoriesWithItems = data.length;
  if (categoriesWithItems < 2) return null;

  const chartConfig = Object.fromEntries(
    data.map((d) => [
      d.category,
      { label: d.name, color: CATEGORY_COLORS[d.category] },
    ])
  ) satisfies ChartConfig;

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Value by Category</CardTitle>
        <div className="flex gap-1 rounded-lg border p-1">
          <button
            onClick={() => setView("value")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              view === "value"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Current Value
          </button>
          <button
            onClick={() => setView("invested")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
              view === "invested"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Invested
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(val) =>
                      `$${(Number(val) / 100).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    }
                  />
                }
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {data.map((d) => (
                  <Cell key={d.category} fill={CATEGORY_COLORS[d.category]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <div className="flex flex-col gap-2">
            {data.map((d) => {
              const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
              return (
                <div key={d.category} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[d.category] }}
                  />
                  <span className="font-medium">{d.name}</span>
                  <span className="text-muted-foreground">
                    {d.displayValue} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
