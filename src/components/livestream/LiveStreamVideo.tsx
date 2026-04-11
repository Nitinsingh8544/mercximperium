import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Volume2, VolumeX, Share2, Play, Pause, Maximize, Minimize, ChevronLeft, ChevronRight, Copy } from "lucide-react";
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
    itemNumber: "03",
  };

  const following = isFollowing(sellerInfo.name);
  const estimatedINR = (currentBid * 93.1).toFixed(2);
  const nextBid = currentBid + 5;
  const nextBidINR = (nextBid * 93.1).toFixed(2);

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
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-black flex flex-col h-full">
        {/* Video Area - fills available space */}
        <div className="relative flex-1 min-h-0 bg-black">
          {/* Video/Image */}
          <div className="absolute inset-0">
            <img
              src={itemInfo.image}
              alt="Product showcase"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Streamer Info Overlay - top left */}
          <div className="absolute top-4 left-4 z-10">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(`/seller/${encodeURIComponent(sellerInfo.name)}`)}
            >
              <Avatar className="h-10 w-10 border-2 border-yellow-400">
                <AvatarImage src={sellerInfo.image} />
                <AvatarFallback>SS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white text-sm">{sellerInfo.name}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-white/80">{sellerInfo.rating}</span>
                </div>
              </div>
              <Button
                size="sm"
                className={`ml-2 rounded-full text-xs font-semibold ${
                  following
                    ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                    : "bg-yellow-400 text-black hover:bg-yellow-500"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollow(sellerInfo.name, "auction");
                }}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          {/* Viewers count - top right */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
              👍 38
            </div>
          </div>

          {/* Left Arrow */}
          {hasPrev && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 hover:text-white" onClick={onPrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Right Arrow */}
          {hasNext && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 hover:text-white" onClick={onNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Video Controls - right side vertical */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:text-white rounded-full" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:text-white rounded-full">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 hover:text-white rounded-full">
              <Copy className="h-5 w-5" />
            </Button>
          </div>

          {/* Paused overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-[5]">
              <Button variant="ghost" size="icon" className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 text-white hover:text-white" onClick={() => setIsPlaying(true)}>
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}

          {/* Current Winner Banner */}
          <div className="absolute bottom-[120px] left-4 z-10">
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs bg-purple-500 text-white">K</AvatarFallback>
              </Avatar>
              <span className="text-sm text-white">
                <span className="font-semibold">kingd72</span>
                <span className="text-yellow-400 font-bold ml-1">is Winning!</span>
              </span>
            </div>
          </div>

          {/* Product Info Overlay - bottom of video */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/70 to-transparent pt-8">
            <div className="flex items-end gap-3 px-4 pb-2">
              {/* Product thumbnail */}
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                <img src={itemInfo.image} alt={itemInfo.name} className="w-full h-full object-cover" />
              </div>
              {/* Product details */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">
                  {itemInfo.itemNumber}. {itemInfo.name}
                </p>
                <p className="text-white/60 text-xs">{itemInfo.description}</p>
                <p className="text-white/50 text-xs">34 Bids</p>
                <p className="text-white/40 text-xs">Shipping + Taxes are extra</p>
              </div>
              {/* Price */}
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold text-lg">${currentBid}</p>
                <p className="text-white/60 text-xs">est. ₹{estimatedINR}</p>
                <p className="text-yellow-400 text-xs font-medium">00:09</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Buttons - outside video, at bottom */}
        <div className="flex gap-2 p-3 bg-black">
          <Button
            variant="outline"
            className="flex-shrink-0 border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white rounded-full px-5"
            onClick={() => setIsCustomBidOpen(true)}
          >
            Custom
          </Button>
          <Button
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base rounded-full"
            onClick={() => handleBid(nextBid)}
          >
            <span className="flex flex-col items-center leading-tight">
              <span>Bid: ${nextBid}</span>
              <span className="text-[10px] font-normal opacity-70">est. ₹{nextBidINR}</span>
            </span>
          </Button>
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
              Current highest bid: <span className="font-bold text-yellow-400">${currentBid}</span>
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
            <Button onClick={handleCustomBidSubmit} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Place Bid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveStreamVideo;
