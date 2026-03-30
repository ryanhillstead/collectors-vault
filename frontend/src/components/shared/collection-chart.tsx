"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CollectionItem, ValueSnapshot } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartConfig = {
  invested: {
    label: "Total Invested",
    color: "hsl(221, 83%, 53%)", // blue-500
  },
  value: {
    label: "Current Value",
    color: "hsl(45, 93%, 47%)", // yellow-400
  },
} satisfies ChartConfig;

interface ChartPoint {
  date: string;
  invested: number;
  value: number;
}

function buildChartData(items: CollectionItem[]): ChartPoint[] {
  if (items.length === 0) return [];

  const sorted = [...items].sort(
    (a, b) => new Date(a.purchaseDate).getTime() - new Date(b.purchaseDate).getTime()
  );

  // Accumulate totals grouped by purchase date
  let cumInvested = 0;
  let cumValue = 0;
  const byDate: Record<string, { invested: number; value: number }> = {};

  for (const item of sorted) {
    const dateKey = item.purchaseDate; // already YYYY-MM-DD
    cumInvested += item.purchasePrice;
    cumValue += item.currentValue;
    byDate[dateKey] = { invested: cumInvested, value: cumValue };
  }

  // Origin point one day before the earliest purchase
  const firstDate = new Date(`${sorted[0].purchaseDate}T12:00:00`);
  firstDate.setDate(firstDate.getDate() - 1);
  const originLabel = firstDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return [
    { date: originLabel, invested: 0, value: 0 },
    ...Object.entries(byDate).map(([dateKey, vals]) => ({
      date: new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      invested: vals.invested / 100,
      value: vals.value / 100,
    })),
  ];
}

function buildSnapshotChartData(snapshots: ValueSnapshot[]): ChartPoint[] {
  return snapshots.map((s) => ({
    date: new Date(`${s.date}T12:00:00`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    invested: s.totalInvested / 100,
    value: s.totalValue / 100,
  }));
}

function dateRangeLabel(items: CollectionItem[]): string {
  if (items.length === 0) return "";
  const dates = items.map((i) => i.purchaseDate).sort();
  const fmt = (d: string) =>
    new Date(`${d}T12:00:00`).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  const first = fmt(dates[0]);
  const last = fmt(dates[dates.length - 1]);
  return first === last ? first : `${first} – ${last}`;
}

interface CollectionChartProps {
  items: CollectionItem[];
  snapshots?: ValueSnapshot[];
}

export function CollectionChart({ items, snapshots = [] }: CollectionChartProps) {
  const data = useMemo(() => {
    if (snapshots.length >= 2) return buildSnapshotChartData(snapshots);
    return buildChartData(items);
  }, [items, snapshots]);
  const dateRange = useMemo(() => dateRangeLabel(items), [items]);

  if (data.length === 0) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Portfolio Over Time</CardTitle>
        <CardDescription>{dateRange}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data} margin={{ left: 12, right: 12 }}>
            <defs>
              <linearGradient id="fillInvested" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-invested)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-invested)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(val) =>
                    `$${Number(val).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  }
                />
              }
            />
            <Area
              type="linear"
              dataKey="invested"
              stroke="var(--color-invested)"
              strokeWidth={2}
              fill="url(#fillInvested)"
            />
            <Area
              type="linear"
              dataKey="value"
              stroke="var(--color-value)"
              strokeWidth={2}
              fill="url(#fillValue)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
