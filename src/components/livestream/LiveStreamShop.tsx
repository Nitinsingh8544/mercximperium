import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

const shopProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=100",
    title: "BLESS THE CHAT WITH A BRAND NEW TRAVIS SCOTT!!!!",
    price: 140,
    estInr: "₹13,034.50",
    qty: 118,
    bids: 0,
    type: "buy"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=100",
    title: "BLESS THE CHAT WITH A DS JORDAN!!!!!!",
    price: 50,
    estInr: "₹4,655.18",
    qty: 170,
    bids: 0,
    type: "buy"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100",
    title: "Vintage Boston Red Sox Mesh Snapback Hat...",
    price: 5,
    estInr: "₹465.45",
    qty: 1,
    bids: 1,
    type: "bid"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=100",
    title: "Rider Cup New Era Strap",
    price: 3,
    estInr: "₹279.27",
    qty: 1,
    bids: 0,
    type: "bid"
  },
];

type FilterType = "filter" | "sort" | "auction" | "sold";

const LiveStreamShop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);

  const filters: { label: string; value: FilterType }[] = [
    { label: "Filter", value: "filter" },
    { label: "Sort", value: "sort" },
    { label: "Auction", value: "auction" },
    { label: "Sold", value: "sold" },
  ];

  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch =
      !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      !activeFilter ||
      (activeFilter === "auction" && p.type === "bid") ||
      (activeFilter !== "auction");
    return matchesSearch && matchesFilter;
  });

  // Separate auction items from results
  const auctionItems = filteredProducts.filter((p) => p.type === "bid");
  const resultItems = filteredProducts.filter((p) => p.type === "buy");

  return (
    <div className="bg-card rounded-xl border border-border p-4 h-full overflow-y-auto">
      <h2 className="font-bold text-foreground text-lg mb-4">Shop</h2>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shop..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-muted border-border"
        />
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <Badge
            key={filter.value}
            variant={activeFilter === filter.value ? "default" : "outline"}
            className={`cursor-pointer transition-colors px-3 py-1.5 text-xs font-medium rounded-md ${
              activeFilter === filter.value
                ? "bg-foreground text-background hover:bg-foreground/90"
                : "bg-background text-foreground border-border hover:bg-muted"
            }`}
            onClick={() =>
              setActiveFilter(activeFilter === filter.value ? null : filter.value)
            }
          >
            {filter.label}
          </Badge>
        ))}
      </div>

      {/* Auction items */}
      {auctionItems.length > 0 && (
        <div className="space-y-3 mb-4">
          {auctionItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Results */}
      {resultItems.length > 0 && (
        <>
          <p className="font-semibold text-foreground mb-3 text-sm">
            Results ({resultItems.length})
          </p>
          <div className="space-y-3">
            {resultItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}

      {filteredProducts.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          No products found.
        </p>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: {
    id: number;
    image: string;
    title: string;
    price: number;
    estInr?: string;
    qty: number;
    bids?: number;
    type: string;
  };
}

const ProductCard = ({ product }: ProductCardProps) => (
  <div className="flex gap-3 p-2 bg-background rounded-lg hover:bg-muted/50 transition-colors">
    <div className="relative flex-shrink-0">
      <img
        src={product.image}
        alt={product.title}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <button className="absolute top-1 left-1 p-0.5 bg-card/80 rounded">
        <Bookmark className="h-3 w-3 text-muted-foreground" />
      </button>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground line-clamp-2 mb-1 leading-tight">
        {product.title}
      </p>
      <div className="flex items-center gap-1.5 text-sm">
        <span className="font-bold text-foreground">${product.price}</span>
        {product.estInr && (
          <span className="text-muted-foreground text-xs">(est. {product.estInr})</span>
        )}
        {product.bids !== undefined && product.bids > 0 && (
          <span className="text-destructive text-xs">{product.bids} bid</span>
        )}
        {product.bids !== undefined && product.bids === 0 && product.type === "bid" && (
          <span className="text-muted-foreground text-xs">0 bids</span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Qty. {product.qty}</p>
      <Button
        size="sm"
        variant="outline"
        className="w-full mt-1.5 text-xs h-8 rounded-full"
      >
        {product.type === "buy" ? "Buy Now" : "Pre-bid"}
      </Button>
    </div>
  </div>
);

export default LiveStreamShop;
