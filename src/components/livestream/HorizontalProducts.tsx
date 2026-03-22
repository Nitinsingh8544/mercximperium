import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useFollows } from "@/hooks/useFollows";
import ProductDetailModal from "./ProductDetailModal";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
}

const defaultProducts: Product[] = [
  { id: 1, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200", title: "Nobero Printed Hoodies for Man | 280 GSM Rich Cotton Fleece...", price: 1064, originalPrice: 3799, currency: "₹" },
  { id: 2, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", title: "NOBERO Men's Cotton Regular Fit Typography T-Shirt", price: 404, originalPrice: 799, currency: "₹" },
  { id: 3, image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200", title: "NOBERO Men's Sweatpants", price: 895, originalPrice: 3199, currency: "₹" },
  { id: 4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200", title: "Premium Running Shoes - Limited Edition", price: 2499, originalPrice: 5999, currency: "₹" },
  { id: 5, image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200", title: "Classic Sneakers - All Colors", price: 1899, originalPrice: 3499, currency: "₹" },
];

interface HorizontalProductsProps {
  hostName?: string;
  hostAvatar?: string;
  streamTitle?: string;
  streamDate?: string;
  products?: Product[];
}

const HorizontalProducts = ({
  hostName = "Fashion Expert",
  hostAvatar,
  streamTitle = "From Chill to Sharp: Everyday Fashion Edit",
  streamDate = "Streamed live 2 days ago",
  products = defaultProducts,
}: HorizontalProductsProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isFollowing, toggleFollow } = useFollows();

  const following = isFollowing(hostName);

  return (
    <>
      <div className="bg-card rounded-b-xl border-x border-b border-border p-4">
        {/* Title */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-foreground text-base">{streamTitle}</h3>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stream Date */}
        <p className="text-xs text-muted-foreground mb-3">{streamDate}</p>

        {/* Channel Name + Sponsored Badge + Follow */}
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={hostAvatar} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              {hostName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground text-sm">{hostName}</span>
          <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-500 text-amber-600 bg-amber-50">Sponsored</Badge>
          <span className="text-xs text-muted-foreground">Earns commissions</span>
          <Button
            variant={following ? "outline" : "outline"}
            size="sm"
            className={`ml-auto h-7 text-xs ${following ? "bg-muted text-muted-foreground" : ""}`}
            onClick={() => toggleFollow(hostName)}
          >
            {following ? "Following" : "+ Follow"}
          </Button>
        </div>

        {/* Horizontal Scrollable Products */}
        <div className="relative group/scroll">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 bg-background/90 border-border shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
            onClick={() => {
              const container = document.getElementById('products-scroll');
              if (container) container.scrollBy({ left: -200, behavior: 'smooth' });
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-7 w-7 bg-background/90 border-border shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
            onClick={() => {
              const container = document.getElementById('products-scroll');
              if (container) container.scrollBy({ left: 200, behavior: 'smooth' });
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div id="products-scroll" className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-1">
            {products.map((product) => (
              <div
                key={product.id}
                className="shrink-0 w-[140px] sm:w-[150px] cursor-pointer group"
                onClick={() => setSelectedProduct(product)}
              >
                <div className="h-[140px] bg-muted rounded-md overflow-hidden mb-2">
                  <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <p className="text-xs text-foreground line-clamp-2 mb-1 leading-tight h-8">{product.title}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-foreground">{product.currency}{product.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground line-through">{product.currency}{product.originalPrice.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        sellerName={hostName}
        sellerAvatar={hostAvatar}
      />
    </>
  );
};

export default HorizontalProducts;
