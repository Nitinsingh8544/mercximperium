import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, Volume2, Camera, Share2, Grid3X3, Timer } from "lucide-react";

interface LiveStreamVideoProps {
  currentBid: number;
  onBid: () => void;
}

const LiveStreamVideo = ({ currentBid, onBid }: LiveStreamVideoProps) => {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="relative rounded-xl overflow-hidden bg-card border border-border">
      {/* Video Area */}
      <div className="relative aspect-video bg-gradient-to-br from-muted to-card">
        {/* Streamer Info Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border-2 border-secondary">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" />
              <AvatarFallback>SS</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-foreground">stewsshoes</p>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-muted-foreground">4.8</span>
              </div>
            </div>
            <Button
              variant={isFollowing ? "outline" : "secondary"}
              size="sm"
              className="ml-2"
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          {/* Live Badge & Viewers */}
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="animate-pulse">
              🔴 LIVE
            </Badge>
            <div className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              👁 1,055
            </div>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border">
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border">
            <Camera className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border">
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>

        {/* Placeholder for video - shows sample image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800" 
            alt="Product showcase" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Current Winner Banner */}
        <div className="absolute bottom-20 left-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-lg">
          <span className="text-sm">
            <span className="font-semibold text-foreground">kingd72</span>
            <span className="text-secondary font-bold ml-1">is Winning!</span>
          </span>
        </div>
      </div>

      {/* Product Info Bar */}
      <div className="p-4 bg-gradient-to-r from-card to-muted border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg">
              RB CRIMSON JORDAN RETRO 3 SZ: 14
            </h3>
            <p className="text-muted-foreground text-sm">USED REP BOX AS-482</p>
            <p className="text-muted-foreground text-sm">34 Bids</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-secondary">${currentBid}</p>
            <div className="flex items-center gap-1 text-muted-foreground text-sm">
              <Timer className="h-3 w-3" />
              <span>00:00</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-shrink-0">
            Custom
          </Button>
          <Button 
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg"
            onClick={onBid}
          >
            Bid: ${currentBid + 5}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamVideo;
