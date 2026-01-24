import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, Play, Pause, Volume2, VolumeX, Maximize, ChevronRight } from "lucide-react";

interface ShopLiveVideoProps {
  hostName?: string;
  hostAvatar?: string;
}

const ShopLiveVideo = ({ hostName = "Sponsored Live", hostAvatar }: ShopLiveVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden bg-card border border-border">
      {/* Video Area */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-card">
        {/* Previously Live Badge */}
        <div className="absolute top-4 left-4 z-10">
          <Badge className="bg-primary text-primary-foreground">
            Previously Live
          </Badge>
        </div>

        {/* Amazon Live Logo (simulated) */}
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded text-sm font-semibold">
            <span className="text-foreground">amazon</span>
            <span className="text-secondary ml-1">live</span>
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800" 
            alt="Live shopping stream" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Play/Like Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-16 w-16 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            <ThumbsUp className="h-8 w-8 text-foreground" />
          </Button>
        </div>

        {/* Navigation Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </Button>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-center justify-between">
            {/* Progress Bar */}
            <div className="flex-1 mr-4">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-secondary rounded-full" />
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Host Info Bar */}
      <div className="p-3 bg-card border-t border-border">
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
