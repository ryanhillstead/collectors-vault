import { CollectionItem } from "./types";

const STORAGE_KEY = "collectors-vault-items";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getItems(): CollectionItem[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as CollectionItem[]) : [];
  } catch {
    return [];
  }
}

function saveItems(items: CollectionItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getItem(id: string): CollectionItem | undefined {
  return getItems().find((item) => item.id === id);
}

export function addItem(
  item: Omit<CollectionItem, "id" | "createdAt" | "updatedAt">
): CollectionItem {
  const now = new Date().toISOString();
  const newItem: CollectionItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  const items = getItems();
  items.push(newItem);
  saveItems(items);
  return newItem;
}

export function updateItem(
  id: string,
  updates: Partial<Omit<CollectionItem, "id" | "createdAt">>
): CollectionItem | undefined {
  const items = getItems();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;
  items[index] = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveItems(items);
  return items[index];
}

export function deleteItem(id: string): boolean {
  const items = getItems();
  const filtered = items.filter((item) => item.id !== id);
  if (filtered.length === items.length) return false;
  saveItems(filtered);
  return true;
}
