# Wishlist & Want List — Design Spec

## Overview

A wishlist system for tracking collectible items the user wants to acquire, with target pricing, market value estimates, and one-click conversion to collected items.

## Data Model

**`WishlistItem`** — stored in localStorage under key `collectors-vault-wishlist`

| Field | Type | Notes |
|-------|------|-------|
| `id` | string (UUID) | |
| `name` | string | Required |
| `category` | CategoryEnum | Required, same enum as collection items |
| `subcategory` | string | Optional |
| `targetPrice` | number | Cents. Max the user would pay. Required |
| `estimatedValue` | number | Cents. From mock price lookup |
| `priority` | `"high"` \| `"medium"` \| `"low"` | Required, defaults to `"medium"` |
| `imageUrl` | string | Optional, auto-fetched |
| `notes` | string | Optional |
| `createdAt` | string (ISO) | |
| `updatedAt` | string (ISO) | |

No `condition`, `purchasePrice`, `purchaseDate`, `soldPrice`, or `soldDate` fields — the user doesn't have the item yet.

## Hook: `useWishlist()`

Located at `frontend/src/hooks/use-wishlist.ts`. Mirrors `useCollection()` pattern.

**State:**
- `items`: WishlistItem[]
- `isLoaded`: boolean (hydration guard)

**Methods:**
- `addItem(data)` — validates, generates ID + timestamps, saves to localStorage
- `updateItem(id, updates)` — patches item, updates `updatedAt`
- `deleteItem(id)` — removes from localStorage
- `moveToCollection(id)` — returns item data shaped for the add form, then deletes from wishlist

**Computed:**
- `stats.totalItems` — count
- `stats.totalTargetSpend` — sum of targetPrice
- `stats.dealsAvailable` — count of items where estimatedValue <= targetPrice

## Validation Schema

New Zod schema in `frontend/src/lib/schemas.ts`:

- `name`: required string
- `category`: required enum
- `subcategory`: optional string
- `targetPrice`: required dollar amount (same format as purchasePrice)
- `priority`: required enum (`high`, `medium`, `low`)
- `imageUrl`: optional valid URL or empty
- `notes`: optional string

## Pages & Routes

### `/wishlist` — Wishlist Page

- Added to header nav between "Collection" and "Add Item"
- Layout similar to collection page but simpler
- **Views**: list and grid (no table view — fewer fields to show)
- **Filters**: search by name, filter by category, filter by priority
- **Sort**: by date added, name, target price, estimated value
- **Deal badge**: green highlight/badge on items where estimatedValue <= targetPrice
- **Empty state**: CTA to add first wishlist item

### `/wishlist/add` — Add Wishlist Item

- Form with fields: name, category, subcategory, target price, priority, notes
- Auto-fetches estimated value and image (same 600ms debounce pattern as add item form)
- Uses existing `ItemCombobox` for name selection from catalog
- On submit, redirects to `/wishlist`

### Actions on Wishlist Items

- **"I bought this"** button on each item (in list/grid and on a detail view if we add one)
  - Navigates to `/add` with query params or state to pre-fill: name, category, subcategory, imageUrl
  - On successful add to collection, the wishlist item is removed
  - Toast: "Moved {name} to your collection"
- **Edit** — navigate to `/wishlist/edit/[id]`
- **Delete** — confirmation dialog, same pattern as collection delete

## UI Components

- **PriorityBadge** — color-coded badge (red=high, yellow=medium, gray=low)
- **DealIndicator** — green badge/icon shown when estimated value <= target price
- Reuse existing: CategoryBadge, ItemImage, EmptyState, LoadingSkeleton

## localStorage

- Key: `collectors-vault-wishlist`
- Format: JSON array of WishlistItem
- Same `isBrowser()` guard pattern as existing storage
