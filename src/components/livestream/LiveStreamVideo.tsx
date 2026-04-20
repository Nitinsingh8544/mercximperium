import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Star, Volume2, VolumeX, Share2, Play, StickyNote, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useFollows } from "@/hooks/useFollows";
import { useAuctionBids } from "@/hooks/useAuctionBids";
import { useAuctionWinners } from "@/hooks/useAuctionWinners";
import { useAuctionQueue } from "@/hooks/useAuctionQueue";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { auctionStreams } from "@/lib/streamRanking";

interface LiveStreamVideoProps {
  currentBid: number;
  onBid: (amount: number) => void;
  streamId?: number;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const TOTAL_DURATION = 180;
const EXPLAIN_DURATION = 150;
const BID_DURATION = 30;

// Stream-specific data mapping
const streamSellerData: Record<number, { name: string; image: string; rating: number }> = {
  301: { name: "antiqueauctions", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", rating: 4.6 },
  302: { name: "cardkingz", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", rating: 4.9 },
  303: { name: "gemdealer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100", rating: 4.7 },
  304: { name: "retrorides", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100", rating: 4.5 },
  305: { name: "artbidhouse", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100", rating: 4.8 },
  306: { name: "winebidder", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100", rating: 4.4 },
  307: { name: "signedstuff", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100", rating: 4.7 },
  308: { name: "coinmaster", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100", rating: 4.6 },
  309: { name: "luxurywatchbid", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", rating: 4.9 },
  310: { name: "sneakervault", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100", rating: 4.8 },
};

const streamItemData: Record<number, { name: string; description: string; image: string; itemNumber: string }> = {
  301: { name: "Victorian Mahogany Cabinet", description: "CIRCA 1870 ORIGINAL", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800", itemNumber: "01" },
  302: { name: "1986 Fleer Michael Jordan RC", description: "PSA 9 MINT CONDITION", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800", itemNumber: "05" },
  303: { name: "Natural Blue Sapphire 3.2ct", description: "GIA CERTIFIED SRI LANKAN", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800", itemNumber: "02" },
  304: { name: "1967 Mustang GT500 Engine", description: "MATCHING NUMBERS ORIGINAL", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800", itemNumber: "04" },
  305: { name: "Original Oil on Canvas", description: "SIGNED CONTEMPORARY PIECE", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", itemNumber: "03" },
  306: { name: "Château Margaux 1982", description: "750ML PERFECT STORAGE", image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?w=800", itemNumber: "01" },
  307: { name: "Signed Muhammad Ali Gloves", description: "JSA AUTHENTICATED", image: "https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=800", itemNumber: "06" },
  308: { name: "1909-S VDB Lincoln Penny", description: "PCGS VF-35 GRADED", image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800", itemNumber: "02" },
  309: { name: "Rolex Daytona Ref. 6239", description: "PAUL NEWMAN DIAL 1968", image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800", itemNumber: "01" },
  310: { name: "Nike Air Mag 2016 DS", description: "SIZE 11 SELF-LACING", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800", itemNumber: "03" },
};

const defaultSeller = { name: "stewsshoes", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", rating: 4.8 };
const defaultItem = { name: "RB CRIMSON JORDAN RETRO 3 SZ: 14", description: "USED REP BOX AS-482", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", itemNumber: "03" };

const LiveStreamVideo = ({ currentBid, onBid, streamId = 1, onNext, onPrev, hasNext = false, hasPrev = false }: LiveStreamVideoProps) => {
  const navigate = useNavigate();
  const [isCustomBidOpen, setIsCustomBidOpen] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [likes, setLikes] = useState(38);
  const [dislikes, setDislikes] = useState(2);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION);
  const [phase, setPhase] = useState<"explain" | "bid">("explain");
  const [lastBidder, setLastBidder] = useState<string | null>(null);
  const [bidCount, setBidCount] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [nextItemCountdown, setNextItemCountdown] = useState<number | null>(null);
  const winnerRecordedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { isFollowing, toggleFollow } = useFollows();
  const { placeBid } = useAuctionBids();
  const { addWinner } = useAuctionWinners();
  const { getActiveItem, advanceQueue } = useAuctionQueue();
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const sellerInfo = streamSellerData[streamId] || defaultSeller;
  // Active item from queue takes precedence over static fallback
  const activeQueueItem = getActiveItem(streamId);
  const fallbackItem = streamItemData[streamId] || defaultItem;
  const itemInfo = activeQueueItem
    ? {
        name: activeQueueItem.title,
        description: fallbackItem.description,
        image: activeQueueItem.image.replace("w=100", "w=800"),
        itemNumber: String(activeQueueItem.order).padStart(2, "0"),
      }
    : fallbackItem;

  const following = isFollowing(sellerInfo.name);
  const nextBid = currentBid + 5;

  // Reset timer + bid state for a fresh auction cycle (called per item & per stream change)
  const startNewCycle = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(TOTAL_DURATION);
    setPhase("explain");
    setWinner(null);
    setShowWinner(false);
    setFadeOut(false);
    setLastBidder(null);
    setBidCount(0);
    winnerRecordedRef.current = false;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= BID_DURATION && next > 0) {
          setPhase("bid");
        }
        if (next <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("bid");
          return 0;
        }
        return next;
      });
    }, 1000);
  }, []);

  // Start a new cycle when stream OR active queue item changes
  useEffect(() => {
    startNewCycle();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [streamId, activeQueueItem?.id, startNewCycle]);

  // Record winner / outcome exactly once when timer hits 0,
  // then run a 3s countdown before activating the next item.
  useEffect(() => {
    if (timeLeft !== 0 || winnerRecordedRef.current) return;
    winnerRecordedRef.current = true;

    const hadBids = !!lastBidder;
    const outcome: "sold" | "unsold" = hadBids ? "sold" : "unsold";

    // Only the highest bidder (lastBidder) wins. If nobody bid → unsold (goes to Buy Now).
    if (hadBids && lastBidder) {
      setWinner(lastBidder);
      setShowWinner(true);
      addWinner({
        streamId,
        itemName: itemInfo.name,
        itemImage: itemInfo.image,
        winnerName: lastBidder,
        finalPrice: Math.round(currentBid * 93.1),
        totalBids: bidCount,
      });
    }

    // Splash duration: 2s if there's a winner, otherwise skip straight to countdown.
    const splashDuration = hadBids ? 2000 : 0;

    const splashTimer = setTimeout(() => {
      setFadeOut(true);
      // Start visible 3s countdown to next item
      setNextItemCountdown(3);
      const cdInterval = setInterval(() => {
        setNextItemCountdown((c) => {
          if (c === null) return null;
          if (c <= 1) {
            clearInterval(cdInterval);
            return 0;
          }
          return c - 1;
        });
      }, 1000);

      const advanceTimer = setTimeout(() => {
        clearInterval(cdInterval);
        setNextItemCountdown(null);
        const next = advanceQueue(streamId, outcome);
        if (!next) {
          // No more items — leave winner badge, stop overlays
          setShowWinner(false);
          setFadeOut(false);
        }
      }, 3000);

      return () => {
        clearInterval(cdInterval);
        clearTimeout(advanceTimer);
      };
    }, splashDuration);

    return () => clearTimeout(splashTimer);
  }, [timeLeft, lastBidder, streamId, itemInfo.name, itemInfo.image, currentBid, bidCount, addWinner, advanceQueue]);

  const bidTimeLeft = phase === "bid" ? timeLeft : Math.max(0, timeLeft - EXPLAIN_DURATION);
  const displayTime = phase === "bid" ? timeLeft : timeLeft - BID_DURATION;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleBid = async (amount: number) => {
    // Bidding strictly disabled outside the active 30s bid window
    if (phase !== "bid" || timeLeft <= 0) {
      toast({ title: "Bidding closed", description: "Bidding is not active right now.", variant: "destructive" });
      return;
    }

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
      setLastBidder("You");
      setBidCount(c => c + 1);
      // Per spec: do NOT show "you win" message during bidding.
      // Live ticker (`is Winning!` badge) already shows the current top bidder.
    }
  };

  const handleCustomBidSubmit = () => {
    const amount = parseFloat(customBidAmount);
    if (isNaN(amount) || amount <= currentBid) {
      toast({
        title: "Invalid bid",
        description: `Your bid must be greater than the current bid of ₹${(currentBid * 93.1).toFixed(0)}`,
        variant: "destructive",
      });
      return;
    }
    handleBid(amount);
    setIsCustomBidOpen(false);
    setCustomBidAmount("");
  };

  const handleLike = () => {
    if (liked) { setLiked(false); setLikes(l => l - 1); }
    else { setLiked(true); setLikes(l => l + 1); if (disliked) { setDisliked(false); setDislikes(d => d - 1); } }
  };

  const handleDislike = () => {
    if (disliked) { setDisliked(false); setDislikes(d => d - 1); }
    else { setDisliked(true); setDislikes(d => d + 1); if (liked) { setLiked(false); setLikes(l => l - 1); } }
  };

  const shareUrl = `${window.location.origin}/live/${streamId}`;

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: `Live Auction - ${itemInfo.name}`, text: `Check out this live auction by ${sellerInfo.name}!`, url: shareUrl }); } catch { setIsShareOpen(true); }
    } else { setIsShareOpen(true); }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", description: "Stream link copied to clipboard." });
    setIsShareOpen(false);
  };

  const handleSaveNote = () => {
    if (noteText.trim()) {
      toast({ title: "Note saved!", description: "Your note has been saved." });
      setNoteText("");
      setIsNoteOpen(false);
    }
  };

  return (
    <>
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-foreground flex flex-col h-full">
        {/* Video Area */}
        <div className="relative flex-1 min-h-0 bg-foreground">
          <div className="absolute inset-0">
            <img src={itemInfo.image} alt="Product showcase" className="w-full h-full object-cover" />
          </div>

          {/* Streamer Info Overlay - top left */}
          <div className="absolute top-4 left-4 z-10">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/seller/${encodeURIComponent(sellerInfo.name)}`)}>
              <Avatar className="h-10 w-10 border-2 border-secondary">
                <AvatarImage src={sellerInfo.image} />
                <AvatarFallback className="bg-primary text-primary-foreground">SS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-white text-sm">{sellerInfo.name}</p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="text-white/80">{sellerInfo.rating}</span>
                </div>
              </div>
              <Button
                size="sm"
                className={`ml-2 rounded-full text-xs font-semibold ${following ? "bg-white/20 text-white border border-white/30 hover:bg-white/30" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}`}
                onClick={(e) => { e.stopPropagation(); toggleFollow(sellerInfo.name, "auction"); }}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          {/* Countdown Timer - top right */}
          <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
            {/* Viewer count */}
            <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
              LIVE · 38
            </div>
            {/* Phase & Timer */}
            <div className={`px-3 py-1.5 rounded-lg text-sm font-bold backdrop-blur-sm ${phase === "bid" ? "bg-destructive/90 text-white animate-pulse" : "bg-primary/70 text-white"}`}>
              {phase === "explain" ? "📢 Explaining" : "🔥 BIDDING"} · {formatTime(displayTime > 0 ? displayTime : timeLeft)}
            </div>
          </div>

          {/* Left Arrow */}
          {hasPrev && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/40 backdrop-blur-sm rounded-full text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground" onClick={onPrev}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Right Arrow */}
          {hasNext && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/40 backdrop-blur-sm rounded-full text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground" onClick={onNext}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Video Controls - right side vertical */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
            <Button variant="ghost" size="icon" className="bg-primary/40 backdrop-blur-sm text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground rounded-full" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" className="bg-primary/40 backdrop-blur-sm text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground rounded-full" onClick={handleShare}>
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-primary/40 backdrop-blur-sm text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground rounded-full" onClick={() => setIsNoteOpen(true)}>
              <StickyNote className="h-5 w-5" />
            </Button>
            {/* Like */}
            <Button variant="ghost" size="icon" className="bg-primary/40 backdrop-blur-sm text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground rounded-full" onClick={handleLike}>
              <div className="flex flex-col items-center">
                <ThumbsUp className={`h-4 w-4 ${liked ? "fill-white" : ""}`} />
                <span className="text-[9px] mt-0.5">{likes}</span>
              </div>
            </Button>
            {/* Dislike */}
            <Button variant="ghost" size="icon" className="bg-primary/40 backdrop-blur-sm text-primary-foreground hover:bg-primary/60 hover:text-primary-foreground rounded-full" onClick={handleDislike}>
              <div className="flex flex-col items-center">
                <ThumbsDown className={`h-4 w-4 ${disliked ? "fill-white" : ""}`} />
                <span className="text-[9px] mt-0.5">{dislikes}</span>
              </div>
            </Button>
          </div>

          {/* Paused overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/40 z-[5]">
              <Button variant="ghost" size="icon" className="h-16 w-16 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 text-white hover:text-white" onClick={() => setIsPlaying(true)}>
                <Play className="h-8 w-8" />
              </Button>
            </div>
          )}

          {/* Winner Celebration Splash Overlay - 2s, then fade for 0.5s before next item */}
          {showWinner && winner && (
            <div className={`absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-secondary/80 via-primary/70 to-secondary/80 backdrop-blur-md transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100 animate-in fade-in"}`}>
              {/* Splash rays */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[150%] w-[150%] bg-[radial-gradient(circle,_hsl(var(--secondary)/0.4)_0%,_transparent_60%)] animate-ping" />
              </div>
              <div className="relative text-center animate-in zoom-in-50 duration-500 px-6 py-5 bg-card/95 rounded-2xl shadow-2xl border-2 border-secondary">
                <div className="text-5xl mb-2 animate-bounce">🎉🏆🎉</div>
                <p className="text-2xl font-extrabold text-secondary mb-2 tracking-wide">WINNER!</p>
                <Avatar className="h-20 w-20 mx-auto border-4 border-secondary shadow-lg mb-2">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-3xl font-bold">
                    {winner.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xl text-foreground font-bold">{winner}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  won <span className="font-semibold text-foreground">{itemInfo.name}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  at <span className="font-bold text-secondary">₹{(currentBid * 93.1).toFixed(0)}</span>
                </p>
                <div className="text-2xl mt-1">✨🎊✨</div>
              </div>
            </div>
          )}

          {/* Live bidder badge - only during active bidding (not after end) */}
          {lastBidder && !showWinner && timeLeft > 0 && (
            <div className="absolute bottom-[120px] left-4 z-10">
              <div className="flex items-center gap-2 bg-primary/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs bg-secondary text-secondary-foreground">{lastBidder[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-white">
                  <span className="font-semibold">{lastBidder}</span>
                  <span className="text-secondary font-bold ml-1">is Winning!</span>
                </span>
              </div>
            </div>
          )}

          {/* Final winner badge - persistent after auction ends */}
          {winner && timeLeft === 0 && !showWinner && (
            <div className="absolute bottom-[120px] left-4 z-10">
              <div className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-lg shadow-lg">
                <Avatar className="h-6 w-6 border border-secondary-foreground/30">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">{winner[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-secondary-foreground">
                  🏆 <span className="font-bold">{winner}</span>
                  <span className="font-semibold ml-1">won!</span>
                </span>
              </div>
            </div>
          )}

          {/* Product Info Overlay - bottom of video */}
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-primary/90 via-primary/70 to-transparent pt-8">
            <div className="flex items-end gap-3 px-4 pb-2">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
                <img src={itemInfo.image} alt={itemInfo.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">{itemInfo.itemNumber}. {itemInfo.name}</p>
                <p className="text-white/60 text-xs">{itemInfo.description}</p>
                <div className="mt-1 inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-[11px] font-bold shadow-md ring-1 ring-secondary-foreground/20">
                  🔥 {bidCount} Bids
                </div>
                <p className="text-white/40 text-xs mt-0.5">Shipping + Taxes are extra</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold text-lg">₹{(currentBid * 93.1).toFixed(0)}</p>
                <p className={`text-xs font-medium ${phase === "bid" ? "text-destructive-foreground animate-pulse" : "text-secondary"}`}>
                  {formatTime(displayTime > 0 ? displayTime : timeLeft)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bid Buttons */}
        <div className="flex gap-2 p-3 bg-primary">
          <Button
            variant="outline"
            className="flex-shrink-0 border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-full px-5"
            onClick={() => setIsCustomBidOpen(true)}
            disabled={phase !== "bid"}
          >
            Custom
          </Button>
          <Button
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base rounded-full"
            onClick={() => handleBid(nextBid)}
            disabled={phase !== "bid"}
          >
            Bid: ₹{(nextBid * 93.1).toFixed(0)}
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
              Current highest bid: <span className="font-bold text-secondary">₹{(currentBid * 93.1).toFixed(0)}</span>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your bid amount (₹)</label>
              <Input
                type="number"
                placeholder={`Enter more than ₹${(currentBid * 93.1).toFixed(0)}`}
                value={customBidAmount}
                onChange={(e) => setCustomBidAmount(e.target.value)}
                min={currentBid + 1}
                onKeyDown={(e) => { if (e.key === "Enter") handleCustomBidSubmit(); }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCustomBidOpen(false)}>Cancel</Button>
            <Button onClick={handleCustomBidSubmit} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold">Place Bid</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Share this stream</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Share this live auction with friends:</p>
            <div className="flex gap-2">
              <Input value={shareUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} className="bg-primary hover:bg-primary/90 text-primary-foreground">Copy</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Note Dialog */}
      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Seller Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Add a note for your customers about this item:</p>
            <Textarea placeholder="e.g. Condition details, sizing notes, bundle deals..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNote} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LiveStreamVideo;
