import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { auctionStreams, streamsWithMeta } from "@/lib/streamRanking";

// Re-export for backward compatibility
export const similarStreams = streamsWithMeta.map(s => ({
  id: s.id,
  host: s.host,
  title: s.title,
  viewers: s.viewers,
  image: s.image,
}));

interface RecommendedStreamsProps {
  currentStreamId?: number;
  onStreamSelect?: (streamId: number) => void;
}

const RecommendedStreams = ({ currentStreamId, onStreamSelect }: RecommendedStreamsProps) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use auction-specific streams, excluding current
  const recommendedStreams = auctionStreams.filter(s => s.id !== currentStreamId);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  const handleClick = (streamId: number) => {
    // Navigate and scroll to top
    navigate(`/live/${streamId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onStreamSelect) {
      onStreamSelect(streamId);
    }
  };

  return (
    <div className="mt-6 sm:mt-8 pb-6 sm:pb-8">
      <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3 sm:mb-4">Explore more auctions</h2>
      
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
          {recommendedStreams.map((stream) => (
            <div
              key={stream.id}
              className="shrink-0 w-[200px] sm:w-[220px] md:w-[240px] cursor-pointer group"
              onClick={() => handleClick(stream.id)}
            >
              {/* Host avatar + name above card */}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-border">
                  <span className="text-[10px] font-semibold text-primary">
                    {stream.host.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground truncate">
                  {stream.host}
                </span>
              </div>

              {/* Image card */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden border border-border">
                <img 
                  src={stream.image} 
                  alt={stream.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-600 text-white border-0 text-xs px-2 py-0.5">
                  Live · {stream.viewers}
                </Badge>
              </div>

              {/* Title + category below card */}
              <div className="mt-2 px-0.5">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-tight">
                  {stream.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                  {stream.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendedStreams;
