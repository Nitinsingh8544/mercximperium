/**
 * Stream ranking utilities for Similar, Recommended, and Explore sections.
 * Uses metadata-based similarity scoring and user-interest personalization.
 */

export interface StreamMeta {
  id: number;
  host: string;
  title: string;
  viewers: number;
  image: string;
  category: string;
  tags: string[];
  brand?: string;
  productType: string;
  sellerNiche: string;
}

// Extended stream data with metadata for ranking
export const streamsWithMeta: StreamMeta[] = [
  { id: 1, host: "sneakerhub", title: "Premium Sneakers Drop 🔥", viewers: 177, image: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400", category: "footwear", tags: ["sneakers", "premium", "limited-edition"], brand: "Nike", productType: "shoes", sellerNiche: "sneakers" },
  { id: 2, host: "streetwearking", title: "Limited Edition Streetwear", viewers: 291, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400", category: "fashion", tags: ["streetwear", "limited-edition", "hoodies"], brand: "Nobero", productType: "clothing", sellerNiche: "streetwear" },
  { id: 3, host: "collectibles_pro", title: "Rare Collectibles + Giveaway", viewers: 122, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400", category: "collectibles", tags: ["rare", "vintage", "giveaway"], productType: "collectibles", sellerNiche: "collectibles" },
  { id: 4, host: "fashionfinds", title: "Designer Fashion Sale 🛍️", viewers: 94, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400", category: "fashion", tags: ["designer", "sale", "luxury"], productType: "clothing", sellerNiche: "fashion" },
  { id: 5, host: "vintagevault", title: "Vintage Treasures Collection", viewers: 135, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", category: "collectibles", tags: ["vintage", "watches", "antique"], productType: "accessories", sellerNiche: "vintage" },
  { id: 6, host: "urbanstyle", title: "Urban Style Essentials", viewers: 88, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400", category: "fashion", tags: ["urban", "streetwear", "essentials"], productType: "clothing", sellerNiche: "streetwear" },
  { id: 7, host: "techgadgets", title: "Latest Tech Gadgets 📱", viewers: 203, image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400", category: "electronics", tags: ["tech", "gadgets", "wireless"], productType: "electronics", sellerNiche: "tech" },
  { id: 8, host: "jewelryqueen", title: "Handmade Jewelry Collection", viewers: 156, image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400", category: "accessories", tags: ["jewelry", "handmade", "artisan"], productType: "jewelry", sellerNiche: "jewelry" },
  { id: 9, host: "booklover", title: "Rare Book Finds 📚", viewers: 67, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", category: "books", tags: ["rare", "first-edition", "books"], productType: "books", sellerNiche: "books" },
  { id: 10, host: "fitnessgear", title: "Premium Gym Equipment", viewers: 189, image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400", category: "fitness", tags: ["gym", "equipment", "premium"], productType: "equipment", sellerNiche: "fitness" },
  { id: 11, host: "artcollector", title: "Original Art Pieces 🎨", viewers: 112, image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400", category: "art", tags: ["art", "original", "paintings"], productType: "art", sellerNiche: "art" },
  { id: 12, host: "gamingzone", title: "Gaming Setup Sale", viewers: 245, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400", category: "electronics", tags: ["gaming", "peripherals", "setup"], productType: "electronics", sellerNiche: "gaming" },
];

// Additional streams for Explore More section
export const exploreStreams: StreamMeta[] = [
  { id: 201, host: "beautybliss", title: "Skincare Routine Essentials 💄", viewers: 234, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", category: "beauty", tags: ["skincare", "beauty", "routine"], productType: "cosmetics", sellerNiche: "beauty" },
  { id: 202, host: "outdooradv", title: "Camping Gear Mega Sale ⛺", viewers: 178, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400", category: "outdoor", tags: ["camping", "outdoor", "adventure"], productType: "gear", sellerNiche: "outdoor" },
  { id: 203, host: "petparadise", title: "Pet Accessories Showcase 🐕", viewers: 145, image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400", category: "pets", tags: ["pets", "accessories", "dogs"], productType: "pet-supplies", sellerNiche: "pets" },
  { id: 204, host: "homedesign", title: "Home Decor Inspiration 🏠", viewers: 198, image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400", category: "home", tags: ["decor", "interior", "home"], productType: "decor", sellerNiche: "home" },
  { id: 205, host: "musicstore", title: "Guitar Collection Sale 🎸", viewers: 167, image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400", category: "music", tags: ["guitars", "instruments", "music"], productType: "instruments", sellerNiche: "music" },
  { id: 206, host: "coffeelover", title: "Specialty Coffee Beans ☕", viewers: 89, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400", category: "food", tags: ["coffee", "specialty", "beans"], productType: "beverages", sellerNiche: "coffee" },
  { id: 207, host: "toyworld", title: "Collectible Figures Drop 🎮", viewers: 312, image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400", category: "toys", tags: ["collectible", "figures", "toys"], productType: "toys", sellerNiche: "toys" },
  { id: 208, host: "plantmom", title: "Rare Plant Collection 🌱", viewers: 134, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400", category: "plants", tags: ["plants", "rare", "indoor"], productType: "plants", sellerNiche: "plants" },
];

// Auction-specific streams for Explore More Auctions section
export const auctionStreams: StreamMeta[] = [
  { id: 301, host: "antiqueauctions", title: "Antique Furniture Bidding War 🪑", viewers: 342, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", category: "antiques", tags: ["antique", "furniture", "auction", "vintage"], productType: "furniture", sellerNiche: "antiques" },
  { id: 302, host: "cardkingz", title: "Rare Sports Cards Auction 🏆", viewers: 478, image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400", category: "collectibles", tags: ["cards", "sports", "rare", "auction"], productType: "collectibles", sellerNiche: "trading-cards" },
  { id: 303, host: "gemdealer", title: "Precious Gemstone Auction 💎", viewers: 256, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400", category: "jewelry", tags: ["gems", "precious", "auction", "luxury"], productType: "gemstones", sellerNiche: "gems" },
  { id: 304, host: "retrorides", title: "Classic Car Parts Bidding 🚗", viewers: 189, image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400", category: "automotive", tags: ["cars", "classic", "parts", "auction"], productType: "automotive", sellerNiche: "cars" },
  { id: 305, host: "artbidhouse", title: "Fine Art Auction Night 🖼️", viewers: 367, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", category: "art", tags: ["art", "fine-art", "painting", "auction"], productType: "art", sellerNiche: "fine-art" },
  { id: 306, host: "winebidder", title: "Vintage Wine Collection Auction 🍷", viewers: 145, image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=400", category: "wine", tags: ["wine", "vintage", "collection", "auction"], productType: "wine", sellerNiche: "wine" },
  { id: 307, host: "signedstuff", title: "Celebrity Memorabilia Auction ✍️", viewers: 423, image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=400", category: "memorabilia", tags: ["celebrity", "signed", "memorabilia", "auction"], productType: "memorabilia", sellerNiche: "memorabilia" },
  { id: 308, host: "coinmaster", title: "Rare Coin & Currency Auction 🪙", viewers: 211, image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400", category: "numismatics", tags: ["coins", "currency", "rare", "auction"], productType: "coins", sellerNiche: "numismatics" },
  { id: 309, host: "luxurywatchbid", title: "Luxury Timepiece Auction ⌚", viewers: 534, image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400", category: "accessories", tags: ["watches", "luxury", "timepiece", "auction"], productType: "watches", sellerNiche: "luxury-watches" },
  { id: 310, host: "sneakervault", title: "Deadstock Sneaker Auction 👟", viewers: 612, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400", category: "footwear", tags: ["sneakers", "deadstock", "rare", "auction"], productType: "shoes", sellerNiche: "sneakers" },
];

// Recommended items pool
export const recommendedPool: StreamMeta[] = [
  { id: 101, host: "luxuryfinds", title: "Luxury Bags & Accessories 👜", viewers: 312, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400", category: "fashion", tags: ["luxury", "bags", "accessories"], productType: "bags", sellerNiche: "luxury" },
  { id: 102, host: "plantparadise", title: "Indoor Plants Collection 🌿", viewers: 145, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400", category: "plants", tags: ["plants", "indoor", "collection"], productType: "plants", sellerNiche: "plants" },
  { id: 103, host: "audiophile", title: "Premium Headphones Sale 🎧", viewers: 198, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", category: "electronics", tags: ["headphones", "audio", "premium"], productType: "electronics", sellerNiche: "audio" },
  { id: 104, host: "watchcollector", title: "Vintage Watch Showcase ⌚", viewers: 267, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", category: "accessories", tags: ["watches", "vintage", "luxury"], productType: "accessories", sellerNiche: "watches" },
  { id: 105, host: "homechef", title: "Kitchen Essentials Deal 🍳", viewers: 89, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", category: "home", tags: ["kitchen", "cooking", "essentials"], productType: "kitchen", sellerNiche: "kitchen" },
  { id: 106, host: "skateshop", title: "Skateboard Gear Drop 🛹", viewers: 176, image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400", category: "sports", tags: ["skateboard", "gear", "extreme"], productType: "sports", sellerNiche: "skateboarding" },
  { id: 107, host: "perfumery", title: "Fragrance Collection 🌸", viewers: 134, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400", category: "beauty", tags: ["fragrance", "perfume", "luxury"], productType: "fragrance", sellerNiche: "beauty" },
  { id: 108, host: "cameragear", title: "Photography Equipment 📷", viewers: 221, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", category: "electronics", tags: ["camera", "photography", "equipment"], productType: "electronics", sellerNiche: "photography" },
  { id: 109, host: "vinylshop", title: "Rare Vinyl Records 🎵", viewers: 93, image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=400", category: "music", tags: ["vinyl", "records", "rare"], productType: "music", sellerNiche: "music" },
  { id: 110, host: "sneakerhead", title: "Exclusive Sneaker Drops 👟", viewers: 345, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", category: "footwear", tags: ["sneakers", "exclusive", "drops"], productType: "shoes", sellerNiche: "sneakers" },
];

// Weights for scoring
const WEIGHTS = {
  categoryMatch: 0.3,
  tagOverlap: 0.25,
  nicheMatch: 0.15,
  productTypeMatch: 0.1,
  popularity: 0.1,
  recency: 0.1,
};

/**
 * Compute similarity score between two streams based on metadata.
 */
function similarityScore(current: StreamMeta, candidate: StreamMeta): number {
  let score = 0;

  // Category match
  if (current.category === candidate.category) score += WEIGHTS.categoryMatch;

  // Tag overlap (Jaccard-like)
  const commonTags = current.tags.filter(t => candidate.tags.includes(t)).length;
  const totalTags = new Set([...current.tags, ...candidate.tags]).size;
  if (totalTags > 0) score += WEIGHTS.tagOverlap * (commonTags / totalTags);

  // Seller niche match
  if (current.sellerNiche === candidate.sellerNiche) score += WEIGHTS.nicheMatch;

  // Product type match
  if (current.productType === candidate.productType) score += WEIGHTS.productTypeMatch;

  // Popularity (normalized viewers out of 500)
  score += WEIGHTS.popularity * Math.min(candidate.viewers / 500, 1);

  // Recency bonus (simulated — all are recent, give flat bonus)
  score += WEIGHTS.recency * 0.8;

  return score;
}

/**
 * Get similar streams ranked by similarity to current stream.
 */
export function getSimilarStreams(currentStreamId: number, count = 8): StreamMeta[] {
  const current = streamsWithMeta.find(s => s.id === currentStreamId);
  if (!current) {
    // Fallback: return by popularity
    return streamsWithMeta
      .filter(s => s.id !== currentStreamId)
      .sort((a, b) => b.viewers - a.viewers)
      .slice(0, count);
  }

  return streamsWithMeta
    .filter(s => s.id !== currentStreamId)
    .map(s => ({ stream: s, score: similarityScore(current, s) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(r => r.stream);
}

/**
 * Simulated user interest categories (cold start fallback: trending).
 * In production, this would come from watch history, likes, purchases.
 */
function getUserInterests(): { categories: string[]; niches: string[] } | null {
  // Simulate: 50% chance user has history
  // For demo, always return some interests
  return {
    categories: ["fashion", "footwear", "electronics"],
    niches: ["sneakers", "streetwear", "tech"],
  };
}

/**
 * Get recommended streams personalized to user or trending fallback.
 */
export function getRecommendedStreams(currentStreamId: number, count = 8): StreamMeta[] {
  const interests = getUserInterests();

  if (!interests) {
    // Cold start: return trending (highest viewers)
    return recommendedPool
      .filter(s => s.id !== currentStreamId)
      .sort((a, b) => b.viewers - a.viewers)
      .slice(0, count);
  }

  return recommendedPool
    .filter(s => s.id !== currentStreamId)
    .map(s => {
      let score = 0;
      // Category interest match
      if (interests.categories.includes(s.category)) score += 0.35;
      // Niche interest match
      if (interests.niches.includes(s.sellerNiche)) score += 0.25;
      // Tag overlap with interests
      const interestTags = [...interests.categories, ...interests.niches];
      const tagMatch = s.tags.filter(t => interestTags.includes(t)).length;
      score += 0.2 * Math.min(tagMatch / 3, 1);
      // Popularity
      score += 0.1 * Math.min(s.viewers / 400, 1);
      // Recency
      score += 0.1 * 0.7;
      return { stream: s, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(r => r.stream);
}

/**
 * Get explore more streams — diverse discovery pool.
 */
export function getExploreStreams(currentStreamId: number, count = 8): StreamMeta[] {
  return exploreStreams
    .filter(s => s.id !== currentStreamId)
    .sort((a, b) => b.viewers - a.viewers)
    .slice(0, count);
}

/**
 * Look up any stream by ID across all pools.
 */
export function findStreamById(id: number): StreamMeta | undefined {
  return streamsWithMeta.find(s => s.id === id)
    || recommendedPool.find(s => s.id === id)
    || exploreStreams.find(s => s.id === id);
}
