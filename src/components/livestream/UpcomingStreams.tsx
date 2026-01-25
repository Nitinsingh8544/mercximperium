import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Stream {
  id: number;
  host: string;
  title: string;
  image: string;
  isUpcoming?: boolean;
}

const upcomingStreams: Stream[] = [
  {
    id: 101,
    host: "TechReviews",
    title: "Latest Gadgets Unboxing",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400",
    isUpcoming: true
  },
  {
    id: 102,
    host: "FashionQueen",
    title: "Summer Collection Preview",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
    isUpcoming: true
  },
  {
    id: 103,
    host: "HomeDecorPro",
    title: "Interior Design Tips",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    isUpcoming: true
  },
  {
    id: 104,
    host: "FitLifestyle",
    title: "Fitness Gear Review",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400",
    isUpcoming: true
  },
  {
    id: 105,
    host: "BeautyGuru",
    title: "Skincare Essentials",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
    isUpcoming: true
  },
  {
    id: 106,
    host: "CookingMaster",
    title: "Kitchen Gadgets Review",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    isUpcoming: true
  },
];

const UpcomingStreams = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mt-6">
      <h2 className="font-bold text-foreground text-lg mb-4">Upcoming Streams</h2>
      
      <div className="relative group/scroll">
        {/* Left Arrow */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/90 border-border shadow-md opacity-0 group-hover/scroll:opacity-100 transition-opacity"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Right Arrow */}
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
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-2"
        >
          {upcomingStreams.map((stream) => (
            <Card
              key={stream.id}
              className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow shrink-0 w-[200px] sm:w-[240px] md:w-[280px]"
              onClick={() => navigate(`/live/${stream.id}`)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={stream.image}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 bg-purple-600 hover:bg-purple-600 text-white border-0 text-[10px] sm:text-xs">
                  Upcoming
                </Badge>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-xs sm:text-sm font-medium text-foreground truncate">{stream.host}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{stream.title}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingStreams;
