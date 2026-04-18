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
import ProductDetailModal from "@/components/livestream/ProductDetailModal";

interface ShopSellerInfo {
  name: string;
  image: string;
}

type ItemStatus = "auction" | "sold" | "buynow";
type SortOption = "none" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

interface ShopProduct {
  id: number;
  image: string;
  title: string;
  price: number;
  bids: number;
  status: ItemStatus;
}

// Stream-specific product data
const streamProducts: Record<number, ShopProduct[]> = {
  301: [
    { id: 1, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", title: "Victorian Mahogany Cabinet", price: 7355, bids: 34, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100", title: "Antique Brass Wall Clock", price: 3200, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100", title: "Carved Oak Writing Desk", price: 12500, bids: 12, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=100", title: "Crystal Chandelier Set", price: 8900, bids: 5, status: "auction" },
    { id: 5, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Persian Silk Rug", price: 15000, bids: 0, status: "buynow" },
  ],
  302: [
    { id: 1, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100", title: "Vintage Denim Jacket", price: 4500, bids: 8, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100", title: "Designer Silk Scarf", price: 2800, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100", title: "Leather Crossbody Bag", price: 6200, bids: 15, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100", title: "Retro Sneakers Limited Ed.", price: 9500, bids: 3, status: "auction" },
  ],
  303: [
    { id: 1, image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=100", title: "Natural Blue Sapphire Ring", price: 25000, bids: 22, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1515562141589-67f0d89b23c5?w=100", title: "Pearl Necklace Set", price: 8500, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=100", title: "Gold Filigree Earrings", price: 4200, bids: 10, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100", title: "Diamond Tennis Bracelet", price: 35000, bids: 7, status: "auction" },
    { id: 5, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=100", title: "Emerald Pendant", price: 12000, bids: 0, status: "buynow" },
  ],
  304: [
    { id: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Hand-knotted Wool Carpet", price: 18000, bids: 6, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=100", title: "Ceramic Vase Collection", price: 3500, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=100", title: "Vintage Oil Painting", price: 22000, bids: 18, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=100", title: "Bronze Horse Sculpture", price: 9800, bids: 4, status: "auction" },
  ],
  305: [
    { id: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100", title: "Omega Vintage Watch 1960", price: 45000, bids: 30, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100", title: "Rolex Submariner Case", price: 28000, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=100", title: "Seiko Presage Limited", price: 15000, bids: 20, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=100", title: "Casio G-Shock Rare Edition", price: 8500, bids: 2, status: "auction" },
  ],
  306: [
    { id: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Mughal Era Silver Coin", price: 12000, bids: 14, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=100", title: "British India Gold Sovereign", price: 55000, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=100", title: "Ancient Roman Denarius", price: 32000, bids: 25, status: "sold" },
  ],
  307: [
    { id: 1, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=100", title: "Watercolor Landscape Original", price: 8500, bids: 9, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100", title: "Abstract Acrylic Canvas", price: 5200, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=100", title: "Modern Sculpture Print", price: 3800, bids: 6, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100", title: "Charcoal Portrait Study", price: 2500, bids: 1, status: "auction" },
  ],
  308: [
    { id: 1, image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=100", title: "Handwoven Banarasi Saree", price: 18500, bids: 11, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=100", title: "Embroidered Sherwani Set", price: 12000, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=100", title: "Pashmina Shawl Premium", price: 7500, bids: 8, status: "sold" },
  ],
  309: [
    { id: 1, image: "https://images.unsplash.com/photo-1616627561950-9f746e330187?w=100", title: "Tanjore Gold Leaf Painting", price: 22000, bids: 16, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100", title: "Sandalwood Carved Elephant", price: 6500, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=100", title: "Brass Nataraja Statue", price: 9800, bids: 12, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=100", title: "Marble Inlay Box Set", price: 4500, bids: 3, status: "auction" },
  ],
  310: [
    { id: 1, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100", title: "Grandfather Pendulum Clock", price: 28000, bids: 20, status: "auction" },
    { id: 2, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", title: "Art Deco Table Clock", price: 5500, bids: 0, status: "buynow" },
    { id: 3, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100", title: "Swiss Cuckoo Clock", price: 15000, bids: 14, status: "sold" },
    { id: 4, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=100", title: "Pocket Watch Victorian Era", price: 11000, bids: 5, status: "auction" },
  ],
};

// Default products for unknown streams
const defaultProducts: ShopProduct[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100", title: "Antique Collection Item", price: 5000, bids: 3, status: "auction" },
  { id: 2, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100", title: "Vintage Decor Piece", price: 2500, bids: 0, status: "buynow" },
  { id: 3, image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=100", title: "Classic Wooden Frame", price: 1800, bids: 7, status: "sold" },
];

type FilterType = "auction" | "buynow" | "sold";

interface LiveStreamShopProps {
  streamId?: number;
  sellerInfo?: ShopSellerInfo;
}

const LiveStreamShop = ({ streamId = 301, sellerInfo }: LiveStreamShopProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(null);

  const products = streamProducts[streamId] || defaultProducts;
  const seller = sellerInfo || { name: "Seller", image: "" };

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

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeFilter === "auction") {
        // Show only items currently in auction (active bidding)
        return matchesSearch && p.status === "auction";
      }
      if (activeFilter === "buynow") {
        // Show items listed in auction but not yet sold
        return matchesSearch && (p.status === "buynow" || p.status === "auction");
      }
      if (activeFilter === "sold") {
        // Show only sold items
        return matchesSearch && p.status === "sold";
      }
      // No filter (Sort) - show all items
      return matchesSearch;
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
          <ProductCard
            key={product.id}
            product={product}
            hidePrebid={activeFilter === "auction"}
            onClick={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
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
                price: selectedProduct.price,
                originalPrice: Math.round(selectedProduct.price * 1.2),
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
  product: ShopProduct;
  hidePrebid?: boolean;
  onClick?: () => void;
}

const ProductCard = ({ product, hidePrebid, onClick }: ProductCardProps) => {
  const statusLabel = product.status === "auction" ? "Pre-bid" : product.status === "sold" ? "Sold" : "Buy Now";
  const isSold = product.status === "sold";
  const showButton = !(hidePrebid && product.status === "auction");

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
        <div className="flex items-center gap-1.5 text-sm">
          <span className="font-bold text-foreground">₹{product.price.toLocaleString("en-IN")}</span>
          {product.bids > 0 && (
            <span className="text-destructive text-xs">{product.bids} bid{product.bids > 1 ? "s" : ""}</span>
          )}
          {product.bids === 0 && product.status === "auction" && (
            <span className="text-muted-foreground text-xs">0 bids</span>
          )}
        </div>

        {showButton && (
          <Button
            size="sm"
            variant="outline"
            disabled={isSold}
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
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
        )}
      </div>
    </div>
  );
};

export default LiveStreamShop;
