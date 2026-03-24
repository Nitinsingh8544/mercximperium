import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ChevronRight, ChevronLeft } from "lucide-react";

interface ShopLiveVideoProps {
  hostName?: string;
  hostAvatar?: string;
  streamImage?: string;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ShopLiveVideo = ({ hostName = "Sponsored Live", hostAvatar, streamImage, onNext, onPrev, hasNext = true, hasPrev = true }: ShopLiveVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <div ref={containerRef} className="relative rounded-t-xl overflow-hidden bg-card border-x border-t border-border">
      <div className="relative aspect-video bg-gradient-to-br from-muted to-card">
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-primary text-primary-foreground">Previously Live</Badge>
        </div>
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="destructive" className="bg-red-600 text-white">LIVE</Badge>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={streamImage || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"}
            alt="Live shopping stream"
            className="w-full h-full object-cover"
          />
        </div>
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <Button variant="ghost" size="icon" className="h-16 w-16 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsPlaying(true)}>
              <Play className="h-8 w-8 text-foreground" />
            </Button>
          </div>
        )}
        
        {/* Left Arrow */}
        {hasPrev && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={onPrev}>
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        )}

        {/* Right Arrow */}
        {hasNext && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={onNext}>
              <ChevronRight className="h-5 w-5 text-foreground" />
            </Button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-secondary rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-card">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={hostAvatar} />
            <AvatarFallback className="bg-muted text-muted-foreground">
              {hostName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{hostName}</h3>
            <p className="text-xs text-muted-foreground">View my storefront &gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLiveVideo;
