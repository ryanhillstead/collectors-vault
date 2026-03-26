import { Category } from "./types";

export interface SubcategoryOption {
  value: string;
  label: string;
}

export const subcategoryOptions: Record<Category, SubcategoryOption[]> = {
  "video-game": [
    // Nintendo
    { value: "switch", label: "Nintendo Switch" },
    { value: "switch-2", label: "Nintendo Switch 2" },
    { value: "wii-u", label: "Wii U" },
    { value: "wii", label: "Wii" },
    { value: "gamecube", label: "GameCube" },
    { value: "n64", label: "Nintendo 64" },
    { value: "snes", label: "SNES" },
    { value: "nes", label: "NES" },
    { value: "game-boy", label: "Game Boy" },
    { value: "gba", label: "Game Boy Advance" },
    { value: "ds", label: "Nintendo DS" },
    { value: "3ds", label: "Nintendo 3DS" },
    // PlayStation
    { value: "ps5", label: "PlayStation 5" },
    { value: "ps4", label: "PlayStation 4" },
    { value: "ps3", label: "PlayStation 3" },
    { value: "ps2", label: "PlayStation 2" },
    { value: "ps1", label: "PlayStation 1" },
    { value: "psp", label: "PSP" },
    { value: "ps-vita", label: "PS Vita" },
    // Xbox
    { value: "xbox-series", label: "Xbox Series X/S" },
    { value: "xbox-one", label: "Xbox One" },
    { value: "xbox-360", label: "Xbox 360" },
    { value: "xbox-og", label: "Original Xbox" },
    // Sega
    { value: "genesis", label: "Sega Genesis" },
    { value: "saturn", label: "Sega Saturn" },
    { value: "dreamcast", label: "Dreamcast" },
    { value: "game-gear", label: "Game Gear" },
    { value: "master-system", label: "Master System" },
    // Atari
    { value: "atari-2600", label: "Atari 2600" },
    { value: "atari-5200", label: "Atari 5200" },
    { value: "atari-7800", label: "Atari 7800" },
    { value: "jaguar", label: "Atari Jaguar" },
    { value: "lynx", label: "Atari Lynx" },
    // Other
    { value: "pc", label: "PC" },
    { value: "neo-geo", label: "Neo Geo" },
    { value: "turbografx-16", label: "TurboGrafx-16" },
  ],
  "trading-card": [
    { value: "pokemon", label: "Pokémon" },
    { value: "mtg", label: "Magic: The Gathering" },
    { value: "yugioh", label: "Yu-Gi-Oh" },
    { value: "one-piece", label: "One Piece" },
    { value: "lorcana", label: "Lorcana" },
    { value: "digimon", label: "Digimon" },
    { value: "dragon-ball-super", label: "Dragon Ball Super" },
    { value: "star-wars", label: "Star Wars" },
    { value: "marvel", label: "Marvel" },
  ],
  comic: [
    { value: "marvel", label: "Marvel" },
    { value: "dc", label: "DC" },
    { value: "image", label: "Image" },
    { value: "dark-horse", label: "Dark Horse" },
    { value: "idw", label: "IDW" },
    { value: "boom-studios", label: "BOOM! Studios" },
    { value: "dynamite", label: "Dynamite" },
    { value: "valiant", label: "Valiant" },
    { value: "independent", label: "Independent" },
  ],
  "funko-pop": [
    { value: "movies", label: "Movies" },
    { value: "tv-shows", label: "TV Shows" },
    { value: "games", label: "Games" },
    { value: "anime", label: "Anime" },
    { value: "sports", label: "Sports" },
    { value: "music", label: "Music" },
    { value: "books", label: "Books" },
    { value: "ad-icons", label: "Ad Icons" },
    { value: "rides", label: "Rides" },
    { value: "deluxe", label: "Deluxe" },
  ],
  "lego-set": [
    { value: "star-wars", label: "Star Wars" },
    { value: "city", label: "City" },
    { value: "technic", label: "Technic" },
    { value: "creator", label: "Creator" },
    { value: "super-heroes", label: "Super Heroes" },
    { value: "harry-potter", label: "Harry Potter" },
    { value: "ninjago", label: "Ninjago" },
    { value: "ideas", label: "Ideas" },
    { value: "architecture", label: "Architecture" },
    { value: "speed-champions", label: "Speed Champions" },
  ],
  coin: [
    { value: "us-coins", label: "U.S. Coins" },
    { value: "world-coins", label: "World Coins" },
    { value: "ancient-coins", label: "Ancient Coins" },
    { value: "commemoratives", label: "Commemoratives" },
    { value: "proof-sets", label: "Proof Sets" },
    { value: "error-coins", label: "Error Coins" },
    { value: "bullion", label: "Bullion" },
  ],
  "sports-card": [
    { value: "baseball", label: "Baseball" },
    { value: "basketball", label: "Basketball" },
    { value: "football", label: "Football" },
    { value: "hockey", label: "Hockey" },
    { value: "soccer", label: "Soccer" },
    { value: "golf", label: "Golf" },
    { value: "mma", label: "MMA" },
    { value: "wrestling", label: "Wrestling" },
    { value: "multi-sport", label: "Multi-Sport" },
  ],
};

export const subcategoryLabel: Record<Category, string> = {
  "video-game": "Platform",
  "trading-card": "Game / Series",
  comic: "Publisher",
  "funko-pop": "Line",
  "lego-set": "Theme",
  coin: "Type",
  "sports-card": "Sport",
};
