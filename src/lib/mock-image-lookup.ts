import { Category } from "./types";

/**
 * Strips category-specific noise from an item name to produce
 * a better Wikipedia search query.
 */
function buildSearchQuery(itemName: string, category: Category): string {
  switch (category) {
    case "funko-pop":
      // "Darth Vader #01" → "Darth Vader"
      // "Walter White #160" → "Walter White"
      return itemName.replace(/\s*#\d+$/, "").trim();

    case "lego-set":
      // "Millennium Falcon (75192)" → "LEGO Millennium Falcon"
      // "Bugatti Chiron (42083)" → "Bugatti Chiron LEGO"
      return "LEGO " + itemName.replace(/\s*\(\d+\)$/, "").trim();

    case "trading-card":
      // "Pokémon Base Set Booster Pack" → "Pokémon Base Set"
      // "Magic: The Gathering Alpha Booster Pack" → "Magic: The Gathering Alpha"
      return itemName
        .replace(/\s*Booster Pack$/, "")
        .replace(/\s*Starter Deck$/, "")
        .replace(/\s*Booster Box$/, "")
        .trim();

    case "comic":
      // "Amazing Fantasy #15 (1st Spider-Man)" → "Amazing Fantasy #15"
      // "Batman: The Killing Joke (1988)" → "Batman: The Killing Joke"
      return itemName.replace(/\s*\([^)]+\)$/, "").trim();

    case "coin":
      // "1921 Morgan Silver Dollar" → "Morgan Silver Dollar"
      // "American Gold Eagle 1 oz" → "American Gold Eagle"
      // "1909-S VDB Lincoln Cent" → "Lincoln Cent"
      return itemName
        .replace(/^\d{4}(-[A-Z]{1,2})?\s+/, "")  // strip leading year + mint mark
        .replace(/\s+\d+\s*(oz|g)$/i, "")          // strip weight suffix
        .trim();

    case "sports-card":
      // "1952 Topps Mickey Mantle #311" → "Mickey Mantle"
      // "1986 Fleer Michael Jordan #57 RC" → "Michael Jordan"
      // "2003 Upper Deck LeBron James RC" → "LeBron James"
      return itemName
        .replace(/^\d{4}\s+[\w\s]+?\s+(?=[A-Z][a-z])/, "")  // strip "YYYY Brand "
        .replace(/\s+#\d+.*$/, "")                            // strip " #311 RC"
        .replace(/\s+RC$/, "")                                // strip trailing RC
        .trim();

    default:
      return itemName;
  }
}

/**
 * Searches Wikipedia for the query, returns the thumbnail of the top result.
 * Uses the search API so fuzzy / partial title matches work.
 */
async function searchWikipediaImage(
  query: string,
  signal: AbortSignal
): Promise<string | null> {
  // Step 1: search for the best matching page title
  const searchUrl =
    `https://en.wikipedia.org/w/api.php?action=query&list=search` +
    `&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;

  const searchRes = await fetch(searchUrl, { signal });
  if (!searchRes.ok) return null;

  const searchData = await searchRes.json();
  const hits: { title: string }[] = searchData?.query?.search ?? [];
  if (!hits.length) return null;

  const pageTitle = hits[0].title;

  // Step 2: fetch thumbnail for that page
  const imageUrl =
    `https://en.wikipedia.org/w/api.php?action=query` +
    `&titles=${encodeURIComponent(pageTitle)}` +
    `&prop=pageimages&pithumbsize=400&format=json&origin=*`;

  const imageRes = await fetch(imageUrl, { signal });
  if (!imageRes.ok) return null;

  const imageData = await imageRes.json();
  const pages = imageData?.query?.pages ?? {};
  const page = Object.values(pages)[0] as
    | { thumbnail?: { source: string } }
    | undefined;

  return page?.thumbnail?.source ?? null;
}

/**
 * Public entry point. Returns a Wikipedia thumbnail URL or null.
 */
export async function lookupItemImage(
  itemName: string,
  category: Category
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const query = buildSearchQuery(itemName, category);
    return await searchWikipediaImage(query, controller.signal);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
