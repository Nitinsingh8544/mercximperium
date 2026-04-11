import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Volume2, VolumeX, Camera, Share2, Grid3X3, Timer, Play, Pause, Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFollows } from "@/hooks/useFollows";
import { useAuctionBids } from "@/hooks/useAuctionBids";
import { useToast } from "@/hooks/use-toast";

interface LiveStreamVideoProps {
  currentBid: number;
  onBid: (amount: number) => void;
  streamId?: number;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const LiveStreamVideo = ({ currentBid, onBid, streamId = 1, onNext, onPrev, hasNext = false, hasPrev = false }: LiveStreamVideoProps) => {
  const navigate = useNavigate();
  const [isCustomBidOpen, setIsCustomBidOpen] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { isFollowing, toggleFollow } = useFollows();
  const { placeBid } = useAuctionBids();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const sellerInfo = {
    name: "stewsshoes",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 4.8,
  };

  const itemInfo = {
    name: "RB CRIMSON JORDAN RETRO 3 SZ: 14",
    description: "USED REP BOX AS-482",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
  };

  const following = isFollowing(sellerInfo.name);

  const handleBid = async (amount: number) => {
    const result = await placeBid({
      stream_id: streamId,
      item_name: itemInfo.name,
      item_image: itemInfo.image,
      item_description: itemInfo.description,
      bid_amount: amount,
      seller_name: sellerInfo.name,
      seller_image: sellerInfo.image,
    });

    if (!result.error) {
      onBid(amount);
      toast({ title: "Bid placed!", description: `You bid $${amount}` });
    }
  };

  const handleCustomBidSubmit = () => {
    const amount = parseFloat(customBidAmount);
    if (isNaN(amount) || amount <= currentBid) {
      toast({
        title: "Invalid bid",
        description: `Your bid must be greater than the current bid of $${currentBid}`,
        variant: "destructive",
      });
      return;
    }
    handleBid(amount);
    setIsCustomBidOpen(false);
    setCustomBidAmount("");
  };

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  return (
    <>
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-card border border-border">
        {/* Video Area */}
        <div className="relative aspect-video bg-gradient-to-br from-muted to-card">
          {/* Streamer Info Overlay */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(`/seller/${encodeURIComponent(sellerInfo.name)}`)}
            >
              <Avatar className="h-10 w-10 border-2 border-secondary">
                <AvatarImage src={sellerInfo.image} />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{sellerInfo.name}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-muted-foreground">{sellerInfo.rating}</span>
                </div>
              </div>
              <Button
                variant={following ? "outline" : "secondary"}
                size="sm"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(sellerInfo.name, "auction");
                }}
              >
                {following ? "Following" : "Follow"}
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

          {/* Left Arrow */}
          {hasPrev && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="outline" size="icon" className="h-10 w-10 bg-card/80 backdrop-blur-sm border-border rounded-full" onClick={onPrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Right Arrow */}
          {hasNext && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 z-10">
              <Button variant="outline" size="icon" className="h-10 w-10 bg-card/80 backdrop-blur-sm border-border rounded-full" onClick={onNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Video Controls Overlay */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border">
              <Camera className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="bg-card/80 backdrop-blur-sm border-border" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>

          {/* Placeholder for video */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={itemInfo.image}
              alt="Product showcase"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Paused overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-[5]">
              <Button variant="ghost" size="icon" className="h-16 w-16 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsPlaying(true)}>
                <Play className="h-8 w-8 text-foreground" />
              </Button>
            </div>
          )}

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
              <h3 className="font-bold text-foreground text-lg">{itemInfo.name}</h3>
              <p className="text-muted-foreground text-sm">{itemInfo.description}</p>
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
            <Button
              variant="outline"
              className="flex-shrink-0"
              onClick={() => setIsCustomBidOpen(true)}
            >
              Custom
            </Button>
            <Button
              className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg"
              onClick={() => handleBid(currentBid + 5)}
            >
              Bid: ${currentBid + 5}
            </Button>
          </div>
        </div>
      </div>

      {/* Custom Bid Dialog */}
      <Dialog open={isCustomBidOpen} onOpenChange={setIsCustomBidOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enter Custom Bid</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Current highest bid: <span className="font-bold text-secondary">${currentBid}</span>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your bid amount ($)</label>
              <Input
                type="number"
                placeholder={`Enter more than $${currentBid}`}
                value={customBidAmount}
                onChange={(e) => setCustomBidAmount(e.target.value)}
                min={currentBid + 1}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCustomBidSubmit();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomBidOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCustomBidSubmit} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              Place Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};

export default LiveStreamVideo;
