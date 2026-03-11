# Clickable Category Cards Design

## Summary

Make the "By Category" cards on the dashboard clickable, navigating the user to the collections page with that category pre-selected as a filter.

## Approach

Use URL search params (`/collection?category=video-game`) to pass the selected category. The collections page reads the param on mount to initialize the category filter state. After initialization, filters work as normal client-side state with no URL syncing.

## Changes

### 1. Dashboard (`src/app/page.tsx`)

Wrap each category `StatCard` in a Next.js `<Link>` pointing to `/collection?category={cat}`. Add hover/cursor styling consistent with the existing "Recently Added" links.

### 2. Collections Page (`src/app/collection/page.tsx`)

Read the `category` search param using `useSearchParams()` from `next/navigation`. Use it as the initial value for `categoryFilter` state instead of always defaulting to `"all"`. The param is only read once on mount — changing filters does not update the URL.

## Files Touched

- `src/app/page.tsx`
- `src/app/collection/page.tsx`
