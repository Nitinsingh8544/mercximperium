import { useState } from "react";
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

type ItemStatus = "auction" | "sold" | "buynow";
type SortOption = "none" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";

const shopProducts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=100",
    title: "BLESS THE CHAT WITH A BRAND NEW TRAVIS SCOTT!!!!",
    price: 13034,
    qty: 118,
    bids: 0,
    status: "buynow" as ItemStatus,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=100",
    title: "BLESS THE CHAT WITH A DS JORDAN!!!!!!",
    price: 4655,
    qty: 170,
    bids: 0,
    status: "sold" as ItemStatus,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100",
    title: "Vintage Boston Red Sox Mesh Snapback Hat...",
    price: 465,
    qty: 1,
    bids: 1,
    status: "auction" as ItemStatus,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?w=100",
    title: "Rider Cup New Era Strap",
    price: 279,
    qty: 1,
    bids: 0,
    status: "auction" as ItemStatus,
  },
];

type FilterType = "auction" | "buynow" | "sold";

const LiveStreamShop = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("none");

  const filters: { label: string; value: FilterType }[] = [
    { label: "Auction", value: "auction" },
    { label: "Buy Now", value: "buynow" },
    { label: "Sold", value: "sold" },
  ];

  const sortLabels: Record<SortOption, string> = {
    "none": "None (Show All)",
    "newest": "Newest",
    "price-asc": "Price: Low → High",
    "price-desc": "Price: High → Low",
    "name-asc": "Name: A → Z",
    "name-desc": "Name: Z → A",
  };

  const filteredProducts = shopProducts
    .filter((p) => {
      const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = !activeFilter || p.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc": return a.title.localeCompare(b.title);
        case "name-desc": return b.title.localeCompare(a.title);
        default: return 0;
      }
    });

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
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">No products found.</p>
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
    qty: number;
    bids?: number;
    status: ItemStatus;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const statusLabel = product.status === "auction" ? "Pre-bid" : product.status === "sold" ? "Sold" : "Buy Now";
  const isSold = product.status === "sold";

  return (
    <div className={`flex gap-3 p-2 bg-background rounded-lg hover:bg-muted/50 transition-colors ${isSold ? "opacity-60" : ""}`}>
      <div className="flex-shrink-0">
        <img src={product.image} alt={product.title} className="w-16 h-16 rounded-lg object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground line-clamp-2 mb-1 leading-tight">{product.title}</p>
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
          {product.bids !== undefined && product.bids > 0 && (
            <span className="text-destructive text-xs">{product.bids} bid{product.bids > 1 ? "s" : ""}</span>
          )}
          {product.bids !== undefined && product.bids === 0 && product.status === "auction" && (
            <span className="text-muted-foreground text-xs">0 bids</span>
          )}
        </div>
        
        <Button
          size="sm"
          variant="outline"
          disabled={isSold}
          className={`w-full mt-1.5 text-xs h-8 rounded-full ${
            isSold
              ? "border-muted-foreground/30 text-muted-foreground"
              : product.status === "auction"
              ? "border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
              : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {statusLabel}
        </Button>
      </div>
    </div>
  );
};

export default LiveStreamShop;
