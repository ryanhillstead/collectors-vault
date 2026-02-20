export type Category = "video-game" | "console" | "trading-card" | "movie";

export type Condition =
  | "mint"
  | "near-mint"
  | "excellent"
  | "good"
  | "fair"
  | "poor";

export interface CollectionItem {
  id: string;
  name: string;
  category: Category;
  purchasePrice: number; // cents
  currentValue: number; // cents
  purchaseDate: string; // ISO date string
  condition: Condition;
  imageUrl: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const categoryLabels: Record<Category, string> = {
  "video-game": "Video Game",
  console: "Console",
  "trading-card": "Trading Card",
  movie: "Movie",
};

export const conditionLabels: Record<Condition, string> = {
  mint: "Mint",
  "near-mint": "Near Mint",
  excellent: "Excellent",
  good: "Good",
  fair: "Fair",
  poor: "Poor",
};

export const categories: Category[] = [
  "video-game",
  "console",
  "trading-card",
  "movie",
];

export const conditions: Condition[] = [
  "mint",
  "near-mint",
  "excellent",
  "good",
  "fair",
  "poor",
];
