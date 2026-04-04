import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getExploreStreams } from "@/lib/streamRanking";

interface ExploreMoreSectionProps {
  currentStreamId?: number;
  onStreamSelect?: (streamId: number) => void;
}

const ExploreMoreSection = ({ currentStreamId, onStreamSelect }: ExploreMoreSectionProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const streams = getExploreStreams(currentStreamId || 0, 8);

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
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Explore more livestreams</h2>

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
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-2"
        >
          {streams.map((stream) => (
            <Card
              key={stream.id}
              className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group hover:scale-[1.02] shrink-0 w-[240px] sm:w-[280px] md:w-[300px]"
              onClick={() => onStreamSelect ? onStreamSelect(stream.id) : navigate(`/shop-live/${stream.id}`)}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={stream.image}
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-600 text-white border-0 text-xs px-2">
                  Live · {stream.viewers}
                </Badge>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <p className="text-white text-sm font-semibold truncate">{stream.title}</p>
                </div>
              </div>
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">
                      {stream.host.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">
                      {stream.host}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {stream.category} · {stream.viewers} watching
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

export default ExploreMoreSection;
