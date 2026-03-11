# Clickable Category Cards Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make dashboard "By Category" cards clickable, navigating to the collections page with that category pre-filtered.

**Architecture:** Use URL search params (`/collection?category=<slug>`) to pass the selected category from the dashboard. The collections page reads `useSearchParams()` on mount to initialize the category filter. No URL syncing after mount — filters remain client-side state.

**Tech Stack:** Next.js App Router, `next/link`, `next/navigation` (useSearchParams)

---

## Chunk 1: Implementation

### Task 1: Collections Page — Read search params for initial category filter

**Files:**
- Modify: `src/app/collection/page.tsx:1-51`

- [ ] **Step 1: Add `useSearchParams` import and read category param**

Add `useSearchParams` to the existing `next/navigation` imports (there are none currently, so add the import). Use it to read the `category` param and initialize `categoryFilter` state.

Change the imports at the top of the file — add:

```tsx
import { useSearchParams } from "next/navigation";
```

Then change the `categoryFilter` state initialization from:

```tsx
const [categoryFilter, setCategoryFilter] = useState<string>("all");
```

to:

```tsx
const searchParams = useSearchParams();
const [categoryFilter, setCategoryFilter] = useState<string>(
  () => {
    const param = searchParams.get("category");
    return param && categories.includes(param as any) ? param : "all";
  }
);
```

This validates the param against the known categories list so invalid values fall back to "all".

- [ ] **Step 2: Verify the collections page works**

Run: `npm run dev` and navigate to:
- `/collection` — should show all items (default "all" behavior unchanged)
- `/collection?category=video-game` — should show only video game items with the category dropdown set to "Video Games"
- `/collection?category=invalid` — should show all items (fallback to "all")

- [ ] **Step 3: Commit**

```bash
git add src/app/collection/page.tsx
git commit -m "feat: read category search param to initialize collection filter"
```

### Task 2: Dashboard — Wrap category cards with links

**Files:**
- Modify: `src/app/page.tsx:58-69`

- [ ] **Step 1: Wrap category StatCards in Link components**

In `src/app/page.tsx`, change the category cards section from:

```tsx
{categories
  .filter((cat) => stats.byCategory[cat] > 0)
  .map((cat) => (
    <StatCard key={cat} label={categoryLabels[cat]} value={stats.byCategory[cat]} />
  ))}
```

to:

```tsx
{categories
  .filter((cat) => stats.byCategory[cat] > 0)
  .map((cat) => (
    <Link
      key={cat}
      href={`/collection?category=${cat}`}
      className="transition-colors hover:opacity-80"
    >
      <StatCard label={categoryLabels[cat]} value={stats.byCategory[cat]} />
    </Link>
  ))}
```

`Link` is already imported in this file.

- [ ] **Step 2: Verify end-to-end flow**

Run: `npm run dev` and on the dashboard:
- Category cards should show a pointer cursor on hover
- Clicking a category card should navigate to `/collection?category=<slug>`
- The collections page should show only items of that category
- The category dropdown should reflect the selected category

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: make dashboard category cards link to filtered collection view"
```
