import { Category } from "./types";

// Deterministic hash so the same item name always returns the same price
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const priceRanges: Record<Category, [number, number]> = {
  "video-game":   [8,   120],
  "trading-card": [2,   200],
  "comic":        [4,    80],
  "funko-pop":    [8,    50],
  "lego-set":     [30,  250],
  "coin":         [15,  500],
  "sports-card":  [3,   200],
};

// Realistic price endings
const endings = [0.99, 0.95, 0.00, 0.49];

export async function mockLookupPrice(
  name: string,
  category: Category
): Promise<number> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 700));

  const hash = hashCode(name.toLowerCase().trim());
  const [min, max] = priceRanges[category];

  // Skew toward lower prices (more realistic distribution)
  const t = Math.pow((hash % 10_000) / 10_000, 1.6);
  const dollars = Math.floor(min + t * (max - min));
  const ending = endings[hash % endings.length];

  return dollars + ending;
}
