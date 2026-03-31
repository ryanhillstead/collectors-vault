"use client";

import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CollectionItem } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartConfig = {
  items: {
    label: "Items Added",
    color: "hsl(221, 83%, 53%)",
  },
  spent: {
    label: "Amount Spent",
    color: "hsl(45, 93%, 47%)",
  },
} satisfies ChartConfig;

interface TimelinePoint {
  month: string;
  items: number;
  spent: number;
}

function buildTimelineData(items: CollectionItem[]): TimelinePoint[] {
  if (items.length === 0) return [];

  const byMonth: Record<string, { items: number; spent: number }> = {};

  for (const item of items) {
    const date = new Date(`${item.purchaseDate}T12:00:00`);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (!byMonth[key]) byMonth[key] = { items: 0, spent: 0 };
    byMonth[key].items += 1;
    byMonth[key].spent += item.purchasePrice;
  }

  return Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => {
      const [year, month] = key.split("-");
      const date = new Date(Number(year), Number(month) - 1);
      return {
        month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        items: data.items,
        spent: data.spent / 100,
      };
    });
}

interface CollectionTimelineProps {
  items: CollectionItem[];
}

export function CollectionTimeline({ items }: CollectionTimelineProps) {
  const data = useMemo(() => buildTimelineData(items), [items]);

  // Need at least 2 months of data
  if (data.length < 2) return null;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Acquisition Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <ComposedChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="items"
              orientation="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              allowDecimals={false}
            />
            <YAxis
              yAxisId="spent"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => `$${val}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(val, name) =>
                    name === "spent"
                      ? `$${Number(val).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      : `${val} item${Number(val) !== 1 ? "s" : ""}`
                  }
                />
              }
            />
            <Bar
              yAxisId="items"
              dataKey="items"
              fill="var(--color-items)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Line
              yAxisId="spent"
              type="monotone"
              dataKey="spent"
              stroke="var(--color-spent)"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
