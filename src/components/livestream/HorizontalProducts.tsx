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
    <div className="bg-card rounded-xl border border-border p-4 mt-4">
      {/* Stream Info Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-foreground">From Chill to Sharp: Everyday Fashion Edit</h3>
          <p className="text-xs text-muted-foreground">Streamed live 2 days ago</p>
        </div>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Host Info */}
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={hostAvatar} />
          <AvatarFallback className="bg-primary/20 text-primary">
            {hostName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Badge variant="outline" className="text-xs">Sponsored</Badge>
          <span className="text-xs text-muted-foreground ml-2">Earns commissions</span>
        </div>
        <Button variant="outline" size="sm">
          + Follow
        </Button>
      </div>

      {/* Horizontal Scrollable Products */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 w-[140px] sm:w-[160px] cursor-pointer group"
            >
              <div className="aspect-square bg-muted rounded-lg overflow-hidden mb-2">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <p className="text-xs text-foreground line-clamp-2 mb-1">
                {product.title}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">
                  {product.currency}{product.price.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground line-through">
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
