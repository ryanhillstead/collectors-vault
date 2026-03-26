# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the `frontend/` directory:

- `npm run dev` — Start Next.js dev server
- `npm run build` — Production build
- `npm run lint` — Run ESLint

No test framework is configured.

## Architecture

Collector's Vault is a Next.js 16 App Router application for tracking collectible items (video games, trading cards, comics, etc.). It is entirely client-side — no backend, no database, no API routes.

### Data Layer

- **localStorage** is the sole persistence layer (`frontend/src/lib/storage.ts`)
- All monetary values are stored as **cents** (integers) and displayed as dollars
- The `useCollection()` hook (`frontend/src/hooks/use-collection.ts`) is the central state manager — provides CRUD operations, computes portfolio stats, and handles sold item tracking
- No global state library; components consume `useCollection()` directly

### Routing

| Route | Purpose |
|-------|---------|
| `/` | Dashboard with portfolio stats, category cards, area chart |
| `/collection` | Filterable/sortable collection (table, grid, list views) |
| `/collection/[id]` | Item detail with sell/delete actions |
| `/add` | Add item form with auto-price lookup |
| `/edit/[id]` | Edit existing item |

All pages are client components (`"use client"`).

### Key Patterns

- **shadcn/ui** (New York style) for UI components in `frontend/src/components/ui/`
- **React Hook Form + Zod** for form handling and validation (`frontend/src/lib/schemas.ts`)
- **Mock services**: Price lookups (`frontend/src/lib/mock-pricecharting.ts`) and image lookups (`frontend/src/lib/mock-image-lookup.ts`) simulate external APIs with deterministic results
- **Category → Subcategory → Item** selection flow in the add form, with 600ms debounced auto-fetch of price/image
- **Hydration safety**: `isBrowser()` checks in storage operations to prevent SSR/client mismatches
- Path alias: `@/*` maps to `./src/*`

### Tech Stack

- Next.js 16, React 19, TypeScript 5
- Tailwind CSS 4 with CSS variables (OKLch color space), light/dark theme via next-themes
- Recharts for data visualization
- Sonner for toast notifications
