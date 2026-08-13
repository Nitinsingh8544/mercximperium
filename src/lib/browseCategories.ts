import { StreamMeta, streamsWithMeta, recommendedPool, exploreStreams, auctionStreams } from "./streamRanking";

export interface BrowseCategory {
  slug: string;
  name: string;
  icon: string;
  image: string;
  viewers: string;
  matches: (s: StreamMeta) => boolean;
}

const has = (s: StreamMeta, ...keys: string[]) =>
  keys.some(
    (k) =>
      s.category === k ||
      s.sellerNiche === k ||
      s.productType === k ||
      s.tags.includes(k)
  );

export const browseCategories: BrowseCategory[] = [
  { slug: "sneakers-streetwear", name: "Sneakers & Streetwear", icon: "👟", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&q=80&auto=format&fit=crop", viewers: "2.8K", matches: (s) => has(s, "footwear", "sneakers", "streetwear", "shoes") },
  { slug: "home-garden", name: "Home & Garden", icon: "🌿", image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&q=80&auto=format&fit=crop", viewers: "1.2K", matches: (s) => has(s, "home", "plants", "decor", "kitchen") },
  { slug: "toys-hobbies", name: "Toys & Hobbies", icon: "🎮", image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80&auto=format&fit=crop", viewers: "8.7K", matches: (s) => has(s, "toys", "gaming", "hobbies") },
  { slug: "trading-card-games", name: "Trading Card Games", icon: "🃏", image: "https://images.unsplash.com/photo-1637628815954-f1ee0a0f9b96?w=400&q=80&auto=format&fit=crop", viewers: "8.9K", matches: (s) => has(s, "trading-cards", "tcg", "cards") },
  { slug: "books-movies", name: "Books & Movies", icon: "📚", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80&auto=format&fit=crop", viewers: "126", matches: (s) => has(s, "books", "movies", "media") },
  { slug: "sports-cards", name: "Sports Cards", icon: "⚾", image: "https://images.unsplash.com/photo-1508344928928-7165b67de128?w=400&q=80&auto=format&fit=crop", viewers: "7.6K", matches: (s) => has(s, "sports", "trading-cards", "cards") },
  { slug: "electronics", name: "Electronics", icon: "🎧", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80&auto=format&fit=crop", viewers: "5K", matches: (s) => has(s, "electronics", "tech", "audio", "gaming", "photography") },
  { slug: "coins-money", name: "Coins & Money", icon: "🪙", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&q=80&auto=format&fit=crop", viewers: "3K", matches: (s) => has(s, "numismatics", "coins", "currency") },
  { slug: "estate-storage", name: "Estate Sales & Storage Units", icon: "📦", image: "https://images.unsplash.com/photo-1530653333484-8f6cf2c39c41?w=400&q=80&auto=format&fit=crop", viewers: "2K", matches: (s) => has(s, "antiques", "estate", "vintage", "furniture") },
  { slug: "sports-memorabilia", name: "Sports Memorabilia", icon: "🏆", image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80&auto=format&fit=crop", viewers: "118", matches: (s) => has(s, "memorabilia", "sports", "signed") },
  { slug: "mens-fashion", name: "Men's Fashion", icon: "👔", image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80&auto=format&fit=crop", viewers: "2.6K", matches: (s) => has(s, "fashion", "streetwear", "mens", "clothing") },
  { slug: "womens-fashion", name: "Women's Fashion", icon: "👗", image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&q=80&auto=format&fit=crop", viewers: "12.6K", matches: (s) => has(s, "fashion", "womens", "clothing", "luxury") },
  { slug: "bags-accessories", name: "Bags & Accessories", icon: "👜", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80&auto=format&fit=crop", viewers: "1.5K", matches: (s) => has(s, "accessories", "bags", "watches") },
  { slug: "beauty", name: "Beauty", icon: "💄", image: "https://images.unsplash.com/photo-1522335789203-aaa730d72a13?w=400&q=80&auto=format&fit=crop", viewers: "3.4K", matches: (s) => has(s, "beauty", "cosmetics", "skincare", "fragrance") },
  { slug: "jewelry", name: "Jewelry", icon: "💎", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80&auto=format&fit=crop", viewers: "2.1K", matches: (s) => has(s, "jewelry", "gems", "gemstones") },
  { slug: "music", name: "Music", icon: "🎵", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80&auto=format&fit=crop", viewers: "890", matches: (s) => has(s, "music", "instruments", "vinyl") },
];

// Extra streams + auctions to ensure every browse category has content
const extraLive: StreamMeta[] = [
  { id: 401, host: "tcgmaster", title: "Trading Card Game Mega Pull 🃏", viewers: 421, image: "https://images.unsplash.com/photo-1606503153255-59d8b8b8b2d9?w=400", category: "collectibles", tags: ["trading-cards", "tcg", "cards", "pulls"], productType: "collectibles", sellerNiche: "trading-cards" },
  { id: 402, host: "moviemania", title: "Cinema Memorabilia Showcase 🎬", viewers: 132, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400", category: "books", tags: ["movies", "media", "memorabilia", "posters"], productType: "media", sellerNiche: "movies" },
  { id: 403, host: "estatefinds", title: "Estate Sale Mystery Boxes 📦", viewers: 287, image: "https://images.unsplash.com/photo-1530653333484-8f6cf2c39c41?w=400", category: "antiques", tags: ["estate", "antique", "mystery", "vintage"], productType: "furniture", sellerNiche: "estate" },
  { id: 404, host: "sportsmemoir", title: "Signed Sports Gear Live 🏟️", viewers: 198, image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400", category: "memorabilia", tags: ["sports", "memorabilia", "signed"], productType: "memorabilia", sellerNiche: "sports" },
  { id: 405, host: "mensstyle", title: "Men's Premium Wardrobe Edit 👔", viewers: 215, image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400", category: "fashion", tags: ["fashion", "mens", "clothing", "suits"], productType: "clothing", sellerNiche: "mens" },
  { id: 406, host: "womensvogue", title: "Women's Designer Live 👗", viewers: 488, image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400", category: "fashion", tags: ["fashion", "womens", "designer", "clothing"], productType: "clothing", sellerNiche: "womens" },
  { id: 407, host: "bagshouse", title: "Luxury Bags Live Drop 👜", viewers: 173, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=400", category: "accessories", tags: ["bags", "accessories", "luxury"], productType: "bags", sellerNiche: "bags" },
  { id: 408, host: "coinhouse", title: "Rare Coin Live Showcase 🪙", viewers: 96, image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400", category: "numismatics", tags: ["coins", "currency", "rare"], productType: "coins", sellerNiche: "numismatics" },
];

const extraAuctions: StreamMeta[] = [
  { id: 501, host: "tcgauctionhouse", title: "Holo Rare TCG Auction 🃏", viewers: 389, image: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=400", category: "collectibles", tags: ["trading-cards", "tcg", "rare", "auction"], productType: "collectibles", sellerNiche: "trading-cards" },
  { id: 502, host: "bookbids", title: "Rare First-Edition Book Auction 📚", viewers: 121, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", category: "books", tags: ["books", "rare", "auction", "first-edition"], productType: "books", sellerNiche: "books" },
  { id: 503, host: "filmreelauction", title: "Vintage Movie Poster Auction 🎬", viewers: 174, image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400", category: "books", tags: ["movies", "media", "posters", "auction"], productType: "media", sellerNiche: "movies" },
  { id: 504, host: "estatebidders", title: "Estate Liquidation Bidding 📦", viewers: 312, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", category: "antiques", tags: ["estate", "antique", "auction", "vintage", "furniture"], productType: "furniture", sellerNiche: "estate" },
  { id: 505, host: "mensauction", title: "Men's Luxury Watch & Suit Auction 👔", viewers: 211, image: "https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=400", category: "fashion", tags: ["fashion", "mens", "clothing", "watches", "auction"], productType: "clothing", sellerNiche: "mens" },
  { id: 506, host: "womensauction", title: "Designer Womenswear Auction 👗", viewers: 356, image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400", category: "fashion", tags: ["fashion", "womens", "designer", "auction"], productType: "clothing", sellerNiche: "womens" },
  { id: 507, host: "bagsauction", title: "Designer Bag Auction House 👜", viewers: 244, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400", category: "accessories", tags: ["bags", "luxury", "designer", "auction"], productType: "bags", sellerNiche: "bags" },
  { id: 508, host: "beautybids", title: "Luxury Beauty Lot Auction 💄", viewers: 167, image: "https://images.unsplash.com/photo-1522335789203-aaa730d72a13?w=400", category: "beauty", tags: ["beauty", "cosmetics", "luxury", "auction"], productType: "cosmetics", sellerNiche: "beauty" },
  { id: 509, host: "musicauction", title: "Vintage Instrument Auction 🎸", viewers: 188, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400", category: "music", tags: ["music", "instruments", "vintage", "auction"], productType: "instruments", sellerNiche: "music" },
  { id: 510, host: "homeauction", title: "Curated Home Decor Auction 🏠", viewers: 142, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400", category: "home", tags: ["home", "decor", "auction"], productType: "decor", sellerNiche: "home" },
  { id: 511, host: "toyauction", title: "Rare Collectible Toy Auction 🎮", viewers: 276, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400", category: "toys", tags: ["toys", "collectible", "rare", "auction"], productType: "toys", sellerNiche: "toys" },
  { id: 512, host: "electronicsauction", title: "Premium Electronics Auction 🎧", viewers: 298, image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400", category: "electronics", tags: ["electronics", "tech", "auction"], productType: "electronics", sellerNiche: "tech" },
];

export const allLiveStreams: StreamMeta[] = [
  ...streamsWithMeta,
  ...recommendedPool,
  ...exploreStreams,
  ...extraLive,
];

export const allAuctionStreams: StreamMeta[] = [
  ...auctionStreams,
  ...extraAuctions,
];

export const getCategoryBySlug = (slug: string) =>
  browseCategories.find((c) => c.slug === slug);
