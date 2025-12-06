import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Bookmark } from "lucide-react";

const shopProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=100",
    title: "BLESS THE CHAT WITH A BRAND NEW TRAVIS SCOTT!!!!",
    price: 140,
    qty: 118,
    type: "buy"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=100",
    title: "BLESS THE CHAT WITH A DS JORDAN!!!!!!",
    price: 50,
    qty: 170,
    type: "buy"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100",
    title: "BUNDLE BOX (SHOWN ON SCREEN)",
    price: 1,
    qty: 1000,
    bids: 1,
    type: "bid"
  },
];

const LiveStreamShop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = ["Filter", "Sort", "Auction", "Buy Now", "Giveaway"];

  return (
    <div className="bg-card rounded-xl border border-border p-4 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
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

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <Badge
            key={filter}
            variant={activeFilter === filter.toLowerCase() ? "default" : "outline"}
            className="cursor-pointer hover:bg-muted transition-colors"
            onClick={() => setActiveFilter(filter.toLowerCase())}
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Products Count */}
      <p className="font-semibold text-foreground mb-3">Products (1,560)</p>

      {/* Product List */}
      <div className="space-y-4">
        {shopProducts.map((product) => (
          <div key={product.id} className="flex gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
            <div className="relative flex-shrink-0">
              <img
                src={product.image}
                alt={product.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <button className="absolute top-1 left-1 p-1 bg-card/80 rounded">
                <Bookmark className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                {product.title}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-bold text-secondary">${product.price}</span>
                {product.bids && (
                  <span className="text-destructive">{product.bids} bid</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Qty. {product.qty}</p>
              <Button
                size="sm"
                variant={product.type === "buy" ? "outline" : "secondary"}
                className="w-full mt-2 text-xs"
              >
                {product.type === "buy" ? "Buy Now" : "Pre-bid"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStreamShop;
