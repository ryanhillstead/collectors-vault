# Collector's Vault

A portfolio tracker for collectibles — video games, trading cards, comics, Funko Pops, LEGO sets, coins, and sports cards. Track what you own, what it's worth, and how your collection is performing over time.

## Features

- **Dashboard** with portfolio value, total gain/loss, and an area chart tracking invested vs. current value
- **Collection view** with table, grid, and list layouts — searchable, filterable by category and condition, sortable by date/name/price/value
- **Add items** with a guided Category > Subcategory > Item flow and automatic price/image lookup
- **Mark as Sold** to track realized gains separately from your active portfolio
- **Light/dark theme** with system preference detection

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
frontend/          # Next.js application
  src/
    app/           # App Router pages (dashboard, collection, add, edit)
    components/    # UI components (shadcn/ui), layout, shared, item forms
    hooks/         # useCollection — central state management
    lib/           # Types, schemas, storage, utilities, mock services
  public/          # Static assets
```

## Tech Stack

- **Next.js 16** with App Router and React 19
- **TypeScript** with strict mode
- **Tailwind CSS 4** with CSS variables and shadcn/ui components
- **React Hook Form + Zod** for form validation
- **Recharts** for data visualization
- **localStorage** for persistence (no backend required)
