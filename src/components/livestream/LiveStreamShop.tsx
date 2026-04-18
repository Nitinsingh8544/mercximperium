import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProductDetailModal from "@/components/livestream/ProductDetailModal";
import { useAuctionQueue, QueueItem } from "@/hooks/useAuctionQueue";

interface ShopSellerInfo {
  name: string;
  image: string;
}

type SortOption = "none" | "price-asc" | "price-desc" | "name-asc" | "name-desc";
type FilterType = "auction" | "buynow" | "sold";

// Base seed data per stream — defines the seller-defined order via `order` field.
// status will be derived from the queue context (pending/active/sold)
interface SeedItem {
  id: number;
  order: number;
  image: string;
  title: string;
  startingPrice: number;
}

const streamSeed: Record<number, SeedItem[]> = {
  301: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", title: "Victorian Mahogany Cabinet", startingPrice: 7355 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100", title: "Antique Brass Wall Clock", startingPrice: 3200 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100", title: "Carved Oak Writing Desk", startingPrice: 12500 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=100", title: "Crystal Chandelier Set", startingPrice: 8900 },
    { id: 5, order: 5, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Persian Silk Rug", startingPrice: 15000 },
  ],
  302: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100", title: "Vintage Denim Jacket", startingPrice: 4500 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100", title: "Designer Silk Scarf", startingPrice: 2800 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100", title: "Leather Crossbody Bag", startingPrice: 6200 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100", title: "Retro Sneakers Limited Ed.", startingPrice: 9500 },
  ],
  303: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=100", title: "Natural Blue Sapphire Ring", startingPrice: 25000 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1515562141589-67f0d89b23c5?w=100", title: "Pearl Necklace Set", startingPrice: 8500 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=100", title: "Gold Filigree Earrings", startingPrice: 4200 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100", title: "Diamond Tennis Bracelet", startingPrice: 35000 },
    { id: 5, order: 5, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100", title: "Emerald Pendant", startingPrice: 12000 },
  ],
  304: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Hand-knotted Wool Carpet", startingPrice: 18000 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=100", title: "Ceramic Vase Collection", startingPrice: 3500 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=100", title: "Vintage Oil Painting", startingPrice: 22000 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=100", title: "Bronze Horse Sculpture", startingPrice: 9800 },
  ],
  305: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100", title: "Omega Vintage Watch 1960", startingPrice: 45000 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100", title: "Rolex Submariner Case", startingPrice: 28000 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=100", title: "Seiko Presage Limited", startingPrice: 15000 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=100", title: "Casio G-Shock Rare Edition", startingPrice: 8500 },
  ],
  306: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Mughal Era Silver Coin", startingPrice: 12000 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100", title: "British India Gold Sovereign", startingPrice: 55000 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=100", title: "Ancient Roman Denarius", startingPrice: 32000 },
  ],
  307: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=100", title: "Watercolor Landscape Original", startingPrice: 8500 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100", title: "Abstract Acrylic Canvas", startingPrice: 5200 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=100", title: "Modern Sculpture Print", startingPrice: 3800 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100", title: "Charcoal Portrait Study", startingPrice: 2500 },
  ],
  308: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Handwoven Banarasi Saree", startingPrice: 18500 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100", title: "Embroidered Sherwani Set", startingPrice: 12000 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100", title: "Pashmina Shawl Premium", startingPrice: 7500 },
  ],
  309: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=100", title: "Tanjore Gold Leaf Painting", startingPrice: 22000 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100", title: "Sandalwood Carved Elephant", startingPrice: 6500 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=100", title: "Brass Nataraja Statue", startingPrice: 9800 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=100", title: "Marble Inlay Box Set", startingPrice: 4500 },
  ],
  310: [
    { id: 1, order: 1, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100", title: "Grandfather Pendulum Clock", startingPrice: 28000 },
    { id: 2, order: 2, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", title: "Art Deco Table Clock", startingPrice: 5500 },
    { id: 3, order: 3, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100", title: "Swiss Cuckoo Clock", startingPrice: 15000 },
    { id: 4, order: 4, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100", title: "Pocket Watch Victorian Era", startingPrice: 11000 },
  ],
};

const defaultSeed: SeedItem[] = [
  { id: 1, order: 1, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", title: "Antique Collection Item", startingPrice: 5000 },
  { id: 2, order: 2, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100", title: "Vintage Decor Piece", startingPrice: 2500 },
  { id: 3, order: 3, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100", title: "Classic Wooden Frame", startingPrice: 1800 },
];

interface LiveStreamShopProps {
  streamId?: number;
  sellerInfo?: ShopSellerInfo;
}

const LiveStreamShop = ({ streamId = 301, sellerInfo }: LiveStreamShopProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [selectedProduct, setSelectedProduct] = useState<QueueItem | null>(null);

  const { registerStream, getItemsForStream } = useAuctionQueue();
  const seller = sellerInfo || { name: "Seller", image: "" };

  // Register seed items for this stream once
  useEffect(() => {
    const seed = streamSeed[streamId] || defaultSeed;
    registerStream(
      streamId,
      seed.map((s) => ({
        id: s.id,
        order: s.order,
        image: s.image,
        title: s.title,
        startingPrice: s.startingPrice,
      }))
    );
  }, [streamId, registerStream]);

  const items = getItemsForStream(streamId);

  const filters: { label: string; value: FilterType }[] = [
    { label: "Auction", value: "auction" },
    { label: "Buy Now", value: "buynow" },
    { label: "Sold", value: "sold" },
  ];

  const sortLabels: Record<SortOption, string> = {
    "none": "All Items",
    "name-asc": "Name: A → Z",
    "name-desc": "Name: Z → A",
    "price-asc": "Price: Low → High",
    "price-desc": "Price: High → Low",
  };

  const filteredItems = useMemo(() => {
    return items
      .filter((p) => {
        const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;
        if (activeFilter === "auction") return p.status === "pending"; // not started yet
        if (activeFilter === "buynow") return p.status === "active"; // started, unsold
        if (activeFilter === "sold") return p.status === "sold";
        return true; // no filter — show all (ordered by seller-defined sequence by default)
      })
      .sort((a, b) => {
        switch (sortOption) {
          case "price-asc": return a.startingPrice - b.startingPrice;
          case "price-desc": return b.startingPrice - a.startingPrice;
          case "name-asc": return a.title.localeCompare(b.title);
          case "name-desc": return b.title.localeCompare(a.title);
          default: return a.order - b.order; // seller-defined queue order
        }
      });
  }, [items, searchQuery, activeFilter, sortOption]);

  return (
    <div className="bg-card rounded-xl border border-border p-4 h-full overflow-y-auto">
      <h2 className="font-bold text-foreground text-lg mb-4">Shop</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search shop..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-muted border-border" />
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Badge variant="outline" className="cursor-pointer transition-colors px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1">
              <ArrowUpDown className="h-3 w-3" />
              Sort
            </Badge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(Object.keys(sortLabels) as SortOption[]).map((key) => (
              <DropdownMenuItem key={key} onClick={() => setSortOption(key)} className={sortOption === key ? "bg-muted font-semibold" : ""}>
                {sortLabels[key]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {filters.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className={`cursor-pointer transition-colors px-3 py-1.5 text-xs font-medium rounded-md ${
              activeFilter === filter.value
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
            onClick={() => setActiveFilter(activeFilter === filter.value ? null : filter.value)}
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      {/* Products */}
      <div className="space-y-3">
        {filteredItems.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No products found.</p>
      )}

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={
          selectedProduct
            ? {
                id: selectedProduct.id,
                image: selectedProduct.image.replace("w=100", "w=500"),
                title: selectedProduct.title,
                price: selectedProduct.startingPrice,
                originalPrice: Math.round(selectedProduct.startingPrice * 1.2),
                currency: "₹",
              }
            : null
        }
        sellerName={seller.name}
        sellerAvatar={seller.image}
      />
    </div>
  );
};

interface ProductCardProps {
  product: QueueItem;
  onClick?: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const isSold = product.status === "sold";
  const isActive = product.status === "active";
  const isPending = product.status === "pending";

  // Status label per area:
  // - pending → "Upcoming" (no action button, listed in Auction filter)
  // - active  → "Buy Now" (listed in Buy Now filter)
  // - sold    → "Sold"   (listed in Sold filter)
  const buttonLabel = isSold ? "Sold" : isActive ? "Buy Now" : null;

  return (
    <div
      className={`flex gap-3 p-2 bg-background rounded-lg hover:bg-muted/50 transition-colors cursor-pointer ${isSold ? "opacity-60" : ""}`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-2 mb-1 leading-tight">{product.title}</p>
        <div className="flex items-center gap-1.5 text-sm flex-wrap">
          <span className="font-bold text-foreground">₹{product.startingPrice.toLocaleString("en-IN")}</span>
          {isActive && (
            <span className="inline-flex items-center gap-0.5 bg-destructive/10 text-destructive text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              🔴 LIVE
            </span>
          )}
          {isPending && (
            <span className="inline-flex items-center gap-0.5 bg-muted text-muted-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              #{product.order} Upcoming
            </span>
          )}
        </div>

        {buttonLabel && (
          <Button
            size="sm"
            variant="outline"
            disabled={isSold}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            className={`w-full mt-1.5 text-xs h-8 rounded-full ${
              isSold
                ? "border-muted-foreground/30 text-muted-foreground"
                : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LiveStreamShop;
