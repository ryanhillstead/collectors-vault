# Collection Insights & Analytics — Design Spec

## Overview

Deeper analytics on the existing dashboard: real value history tracking, category breakdowns, top performers, and acquisition timeline. All client-side, all on the dashboard page.

## Value History Snapshots

### Data Model

Stored in localStorage under key `collectors-vault-snapshots`.

```typescript
interface ValueSnapshot {
  date: string          // ISO date (YYYY-MM-DD)
  totalInvested: number // cents
  totalValue: number    // cents
  itemCount: number
}
```

Array of snapshots, one per day max.

### Snapshot Logic

Located in a new `useValueHistory()` hook at `frontend/src/hooks/use-value-history.ts`.

- **Trigger**: on app load, check if the most recent snapshot is from a different calendar day
- **If stale**: compute current totals from `useCollection()` items and append a new snapshot
- **Retention**: keep max 90 snapshots (~3 months). Drop oldest when over limit.
- **Edge case**: if collection is empty, don't create a snapshot

### Portfolio Chart Upgrade

The existing `CollectionChart` component currently computes a static cumulative view. Updated behavior:

- If snapshots exist (2+ data points): plot real historical data from snapshots (date on X, invested vs value on Y)
- If <2 snapshots: fall back to current static behavior
- Keep the dual area chart style (invested vs current value)

## Category Breakdown Donut Chart

### New Component: `CategoryDonutChart`

- **Location**: dashboard, below the portfolio chart
- **Library**: Recharts PieChart with inner radius (donut)
- **Data**: value per category from `stats.byCategory`, but extended to include value sums (not just counts)
- **Display**: donut chart with category colors matching existing CategoryBadge colors
- **Legend**: category name + formatted dollar value + percentage
- **Toggle**: "Invested" vs "Current Value" view (two small buttons/tabs above the chart)
- **Only renders** when collection has items in 2+ categories. With one category, a donut isn't useful — skip it.

### Changes to `useCollection()`

Extend `stats.byCategory` from `{ [category]: number }` (count) to:

```typescript
byCategory: {
  [category: string]: {
    count: number
    totalInvested: number  // cents
    totalValue: number     // cents
  }
}
```

This is a breaking change to the stat shape — update all consumers (dashboard category cards).

## Best/Worst Performers

### New Component: `TopPerformers`

- **Location**: dashboard, below the category donut chart
- **Layout**: two columns — "Top Gainers" (left) and "Top Losers" (right)
- **Each entry shows**: item image (small), name, category badge, gain/loss in dollars, gain/loss percentage
- **Sorted by**: percentage gain/loss
- **Count**: top 3 each, only for active (unsold) items
- **Clickable**: each row links to `/collection/[id]`
- **Only renders** when collection has 3+ active items
- **Gain/loss calculation**: `(currentValue - purchasePrice) / purchasePrice * 100`

## Collection Timeline

### New Component: `CollectionTimeline`

- **Location**: dashboard, below top performers
- **Chart type**: Recharts BarChart
- **X axis**: months (e.g., "Jan 2026", "Feb 2026")
- **Y axis (primary)**: number of items acquired that month (bars)
- **Y axis (secondary)**: total spent that month in dollars (line overlay)
- **Range**: all time (from earliest purchase date to now)
- **Only renders** when collection has items spanning 2+ months

## Updated Dashboard Layout (top to bottom)

1. Stat cards (existing)
2. Portfolio chart (upgraded with real snapshots)
3. Category breakdown donut chart (new)
4. Best/worst performers (new)
5. Collection timeline (new)
6. By category cards (existing)
7. Recently added items (existing)

## localStorage Keys

| Key | Content |
|-----|---------|
| `collectors-vault-items` | Collection items (existing) |
| `collectors-vault-snapshots` | Value history snapshots (new) |
