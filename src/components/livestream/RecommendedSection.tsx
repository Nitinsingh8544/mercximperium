import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Stream {
  id: number;
  host: string;
  title: string;
  viewers: number;
  image: string;
}

interface RecommendedSectionProps {
  currentStreamId?: number;
  onStreamSelect?: (streamId: number) => void;
}

const recommendedItems: Stream[] = [
  { id: 101, host: "luxuryfinds", title: "Luxury Bags & Accessories 👜", viewers: 312, image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },
  { id: 102, host: "plantparadise", title: "Indoor Plants Collection 🌿", viewers: 145, image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=400" },
  { id: 103, host: "audiophile", title: "Premium Headphones Sale 🎧", viewers: 198, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
  { id: 104, host: "watchcollector", title: "Vintage Watch Showcase ⌚", viewers: 267, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400" },
  { id: 105, host: "homechef", title: "Kitchen Essentials Deal 🍳", viewers: 89, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
  { id: 106, host: "skateshop", title: "Skateboard Gear Drop 🛹", viewers: 176, image: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=400" },
  { id: 107, host: "perfumery", title: "Fragrance Collection 🌸", viewers: 134, image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400" },
  { id: 108, host: "cameragear", title: "Photography Equipment 📷", viewers: 221, image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400" },
  { id: 109, host: "vinylshop", title: "Rare Vinyl Records 🎵", viewers: 93, image: "https://images.unsplash.com/photo-1539375665275-f9de415ef9ac?w=400" },
  { id: 110, host: "sneakerhead", title: "Exclusive Sneaker Drops 👟", viewers: 345, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
];

const RecommendedSection = ({ currentStreamId, onStreamSelect }: RecommendedSectionProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const streams = recommendedItems
    .filter(stream => stream.id !== currentStreamId)
    .slice(0, 8);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="pb-6 sm:pb-8">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Recommended</h2>

      <div className="relative group/scroll">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/90 border-border shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/90 border-border shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div
          ref={scrollRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-2"
        >
          {streams.map((stream) => (
            <Card
              key={stream.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:scale-105 shrink-0 w-[160px] sm:w-[180px] md:w-[200px]"
              onClick={() => onStreamSelect ? onStreamSelect(stream.id) : navigate(`/shop-live/${stream.id}`)}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={stream.image}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-primary hover:bg-primary text-primary-foreground border-0 text-[10px] sm:text-xs px-1 sm:px-1.5">
                  Live · {stream.viewers}
                </Badge>
              </div>
              <CardContent className="p-2 sm:p-2.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-[9px] sm:text-xs font-semibold text-primary">
                      {stream.host.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[10px] sm:text-xs text-foreground truncate">
                      {stream.host}
                    </p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground truncate">
                      {stream.title}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedSection;
