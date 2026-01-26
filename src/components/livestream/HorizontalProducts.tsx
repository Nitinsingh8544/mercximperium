import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";

const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200",
    title: "Nobero Printed Hoodies for Man | 280 GSM Rich Cotton Fleece...",
    price: 1064,
    originalPrice: 3799,
    currency: "₹"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200",
    title: "NOBERO Men's Cotton Regular Fit Typography T-Shirt",
    price: 404,
    originalPrice: 799,
    currency: "₹"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200",
    title: "NOBERO Men's Sweatpants",
    price: 895,
    originalPrice: 3199,
    currency: "₹"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200",
    title: "Premium Running Shoes - Limited Edition",
    price: 2499,
    originalPrice: 5999,
    currency: "₹"
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=200",
    title: "Classic Sneakers - All Colors",
    price: 1899,
    originalPrice: 3499,
    currency: "₹"
  },
];

interface HorizontalProductsProps {
  hostName?: string;
  hostAvatar?: string;
}

const HorizontalProducts = ({ hostName = "Fashion Expert", hostAvatar }: HorizontalProductsProps) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <div className="bg-card rounded-b-xl border-x border-b border-border p-4">
      {/* Description/Title - First */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-bold text-foreground text-base">From Chill to Sharp: Everyday Fashion Edit</h3>
        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Stream Details - Second */}
      <p className="text-xs text-muted-foreground mb-3">Streamed live 2 days ago</p>

      {/* Channel Info with Follow Button - Third */}
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={hostAvatar} />
          <AvatarFallback className="bg-muted text-muted-foreground text-sm">
            {hostName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <Badge variant="outline" className="text-xs px-2 py-0.5">Sponsored</Badge>
        <span className="text-xs text-muted-foreground">Earns commissions</span>
        <Button variant="outline" size="sm" className="ml-auto h-7 text-xs">
          + Follow
        </Button>
      </div>

      {/* Horizontal Scrollable Products with Navigation */}
      <div className="relative group/scroll">
        {/* Left Arrow */}
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

        {/* Right Arrow */}
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

        <div id="products-scroll" className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-1">
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[120px] sm:w-[130px] cursor-pointer group"
            >
              <div className="aspect-square bg-muted rounded-md overflow-hidden mb-1.5">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-[11px] text-foreground line-clamp-2 mb-0.5 leading-tight">
                {product.title}
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-foreground">
                  {product.currency}{product.price.toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground line-through">
                  {product.currency}{product.originalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalProducts;
