export type Category =
  | "video-game"
  | "trading-card"
  | "comic"
  | "funko-pop"
  | "lego-set"
  | "coin"
  | "sports-card";

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
  subcategory?: string;
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
  "video-game": "Video Games",
  "trading-card": "Trading Cards",
  comic: "Comics",
  "funko-pop": "Funko Pops",
  "lego-set": "LEGO Sets",
  coin: "Coins",
  "sports-card": "Sports Cards",
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
  "trading-card",
  "comic",
  "funko-pop",
  "lego-set",
  "coin",
  "sports-card",
];

export const conditions: Condition[] = [
  "mint",
  "near-mint",
  "excellent",
  "good",
  "fair",
  "poor",
];
