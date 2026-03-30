import { ValueSnapshot } from "./types";

const STORAGE_KEY = "collectors-vault-snapshots";
const MAX_SNAPSHOTS = 90;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function getSnapshots(): ValueSnapshot[] {
  if (!isBrowser()) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? (JSON.parse(data) as ValueSnapshot[]) : [];
  } catch {
    return [];
  }
}

export function addSnapshot(snapshot: ValueSnapshot): void {
  if (!isBrowser()) return;
  const snapshots = getSnapshots();
  // Don't add duplicate for same date
  if (snapshots.length > 0 && snapshots[snapshots.length - 1].date === snapshot.date) {
    return;
  }
  snapshots.push(snapshot);
  // Keep only most recent MAX_SNAPSHOTS
  const trimmed = snapshots.length > MAX_SNAPSHOTS
    ? snapshots.slice(snapshots.length - MAX_SNAPSHOTS)
    : snapshots;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}
