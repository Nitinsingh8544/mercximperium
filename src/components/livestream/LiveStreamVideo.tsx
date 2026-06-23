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
import { useWallet } from "@/hooks/useWallet";
import { Wallet as WalletIcon } from "lucide-react";

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
const INR_CONVERSION_RATE = 93.1;

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
  const { balance: walletBalance, spend: walletSpend } = useWallet();
  const [lockedAmount, setLockedAmount] = useState(0); // in ₹
  const [insufficientOpen, setInsufficientOpen] = useState(false);
  const [insufficientNeed, setInsufficientNeed] = useState(0);
  const prevLastBidderRef = useRef<string | null>(null);
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
  const currentBidInRupees = Math.round(currentBid * INR_CONVERSION_RATE);
  const nextBidInRupees = Math.round(nextBid * INR_CONVERSION_RATE);

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
    setNextItemCountdown(null);
    winnerRecordedRef.current = false;
    setLockedAmount(0);
    prevLastBidderRef.current = null;

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
      const finalPriceInr = Math.round(currentBid * INR_CONVERSION_RATE);
      addWinner({
        streamId,
        itemName: itemInfo.name,
        itemImage: itemInfo.image,
        winnerName: lastBidder,
        finalPrice: finalPriceInr,
        totalBids: bidCount,
      });

      // If the current user won, actually deduct the locked amount from their wallet.
      if (lastBidder === "You" && lockedAmount > 0) {
        walletSpend(lockedAmount, `Auction win: ${itemInfo.name}`, `stream-${streamId}`).then((r) => {
          if (r.success) {
            toast({
              title: "🏆 You won the auction!",
              description: `₹${lockedAmount.toLocaleString("en-IN")} deducted from your wallet for ${itemInfo.name}.`,
            });
          } else {
            toast({
              title: "Payment issue",
              description: r.error || "Could not deduct funds from wallet.",
              variant: "destructive",
            });
          }
          setLockedAmount(0);
        });
      } else if (lastBidder !== "You" && lockedAmount > 0) {
        // Lost — release any locked funds
        setLockedAmount(0);
      }
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
  }, [timeLeft, lastBidder, streamId, itemInfo.name, itemInfo.image, currentBid, bidCount, addWinner, advanceQueue, lockedAmount, walletSpend, toast]);

  // Notify on winning/losing whenever the top bidder changes
  useEffect(() => {
    const prev = prevLastBidderRef.current;
    const curr = lastBidder;
    if (prev === curr) return;
    prevLastBidderRef.current = curr;
    if (!curr || timeLeft === 0) return;

    if (curr === "You") {
      toast({
        title: "🎯 You're winning!",
        description: `You're the top bidder at ₹${Math.round(currentBid * INR_CONVERSION_RATE).toLocaleString("en-IN")}. Hold your lead!`,
      });
    } else if (prev === "You") {
      // You were outbid — release locked funds
      if (lockedAmount > 0) setLockedAmount(0);
      toast({
        title: "📉 You've been outbid!",
        description: `${curr} is now winning at ₹${Math.round(currentBid * INR_CONVERSION_RATE).toLocaleString("en-IN")}. Place a higher bid to take the lead.`,
        variant: "destructive",
      });
    }
  }, [lastBidder, currentBid, timeLeft, lockedAmount, toast]);

  const bidTimeLeft = phase === "bid" ? timeLeft : Math.max(0, timeLeft - EXPLAIN_DURATION);
  const displayTime = phase === "bid" ? timeLeft : timeLeft - BID_DURATION;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const availableBalance = Math.max(0, walletBalance - lockedAmount);

  const handleBid = async (amount: number, lockAmountRupees = Math.round(amount * INR_CONVERSION_RATE)) => {
    // Allow bidding anytime the auction is live (timer hasn't ended).
    if (timeLeft <= 0) {
      toast({ title: "Bidding closed", description: "This auction has ended.", variant: "destructive" });
      return;
    }

    // Wallet check — bid amount in ₹
    const bidRupees = Math.round(lockAmountRupees);
    // Required funds = bid - already locked from your previous bid in this cycle
    const requiredNow = Math.max(0, bidRupees - lockedAmount);
    if (requiredNow > availableBalance) {
      setInsufficientNeed(bidRupees);
      setInsufficientOpen(true);
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
      // Lock the new bid amount (replaces prior lock for this cycle)
      setLockedAmount(bidRupees);
    }
  };

  const handleCustomBidSubmit = () => {
    const amountInRupees = Math.round(parseFloat(customBidAmount));
    if (isNaN(amountInRupees) || amountInRupees <= currentBidInRupees) {
      toast({
        title: "Invalid bid",
        description: `Your bid must be greater than the current bid of ₹${currentBidInRupees.toLocaleString("en-IN")}`,
        variant: "destructive",
      });
      return;
    }

    const internalBidAmount = amountInRupees / INR_CONVERSION_RATE;
    handleBid(internalBidAmount, amountInRupees);
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

          {/* Streamer Info Overlay - top left (mobile: compact, no follow inline) */}
          <div className="absolute top-4 left-4 max-lg:left-14 max-lg:top-3 z-10">
            <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate(`/seller/${encodeURIComponent(sellerInfo.name)}`)}>
              <Avatar className="h-9 w-9 max-lg:h-8 max-lg:w-8 border-2 border-secondary">
                <AvatarImage src={sellerInfo.image} />
                <AvatarFallback className="bg-primary text-primary-foreground">SS</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="font-semibold text-white text-sm leading-tight truncate max-w-[110px]">{sellerInfo.name}</p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-secondary text-secondary" />
                  <span className="text-white/80">{sellerInfo.rating}</span>
                </div>
              </div>
              {/* Follow inline only on desktop */}
              <Button
                size="sm"
                className={`ml-2 rounded-full text-xs font-semibold max-lg:hidden ${following ? "bg-white/20 text-white border border-white/30 hover:bg-white/30" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}`}
                onClick={(e) => { e.stopPropagation(); toggleFollow(sellerInfo.name, "auction"); }}
              >
                {following ? "Following" : "Follow"}
              </Button>
            </div>
          </div>

          {/* Top right cluster: uniform pills (Follow on mobile + LIVE + Phase) */}
          <div className="absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); toggleFollow(sellerInfo.name, "auction"); }}
                className={`lg:hidden h-7 px-3 rounded-full text-[11px] font-semibold ${following ? "bg-white/20 text-white border border-white/30 hover:bg-white/30" : "bg-secondary text-secondary-foreground hover:bg-secondary/90"}`}
              >
                {following ? "Following" : "Follow"}
              </Button>
              <div className="h-7 px-3 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold flex items-center">
                LIVE · 38
              </div>
            </div>
            <div className={`h-7 px-3 rounded-full text-[11px] font-bold backdrop-blur-sm flex items-center ${phase === "bid" ? "bg-destructive/90 text-white animate-pulse" : "bg-primary/70 text-white"}`}>
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

          {/* Winner Celebration Splash Overlay - sophisticated, with party poppers & confetti */}
          {showWinner && winner && (
            <div className={`absolute inset-0 flex items-center justify-center z-30 bg-gradient-to-br from-primary/80 via-secondary/60 to-primary/80 backdrop-blur-md overflow-hidden transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100 animate-in fade-in"}`}>
              {/* Radial glow */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[160%] w-[160%] bg-[radial-gradient(circle,_hsl(var(--secondary)/0.45)_0%,_transparent_55%)] animate-ping" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[120%] w-[120%] bg-[conic-gradient(from_0deg,_hsl(var(--secondary)/0.25),_transparent_30%,_hsl(var(--secondary)/0.25)_60%,_transparent_90%)] animate-spin [animation-duration:6s]" />
              </div>

              {/* Floating party poppers */}
              <div className="absolute top-[8%] left-[6%] text-5xl animate-bounce [animation-delay:0ms]">🎉</div>
              <div className="absolute top-[10%] right-[8%] text-5xl animate-bounce [animation-delay:200ms]">🎊</div>
              <div className="absolute top-[28%] left-[14%] text-3xl animate-bounce [animation-delay:400ms]">✨</div>
              <div className="absolute top-[30%] right-[16%] text-3xl animate-bounce [animation-delay:600ms]">🥳</div>
              <div className="absolute bottom-[14%] left-[10%] text-4xl animate-bounce [animation-delay:300ms]">🎊</div>
              <div className="absolute bottom-[12%] right-[10%] text-4xl animate-bounce [animation-delay:500ms]">🎉</div>
              <div className="absolute bottom-[28%] left-[22%] text-2xl animate-pulse">⭐</div>
              <div className="absolute bottom-[26%] right-[24%] text-2xl animate-pulse">⭐</div>

              {/* Confetti dots */}
              <div className="absolute inset-0 pointer-events-none">
                {[
                  "top-[12%] left-[30%] bg-secondary",
                  "top-[18%] left-[60%] bg-primary",
                  "top-[22%] left-[78%] bg-secondary",
                  "top-[40%] left-[8%] bg-primary",
                  "top-[55%] right-[6%] bg-secondary",
                  "bottom-[18%] left-[40%] bg-primary",
                  "bottom-[22%] right-[35%] bg-secondary",
                  "bottom-[40%] left-[18%] bg-primary",
                ].map((c, i) => (
                  <span
                    key={i}
                    className={`absolute h-2 w-2 rounded-full ${c} animate-ping`}
                    style={{ animationDelay: `${i * 120}ms` }}
                  />
                ))}
              </div>

              <div className="relative text-center animate-in zoom-in-50 duration-500 px-7 py-6 bg-card/95 rounded-2xl shadow-[0_20px_60px_-10px_hsl(var(--secondary)/0.6)] border-2 border-secondary">
                {/* Top crown of poppers */}
                <div className="flex items-center justify-center gap-3 mb-2 text-4xl">
                  <span className="animate-bounce [animation-delay:0ms]">🎉</span>
                  <span className="text-5xl drop-shadow-[0_4px_12px_hsl(var(--secondary)/0.6)]">🏆</span>
                  <span className="animate-bounce [animation-delay:200ms]">🎉</span>
                </div>
                <p className="text-[10px] font-semibold tracking-[0.3em] text-muted-foreground uppercase">Auction Won</p>
                <p className="text-3xl font-extrabold bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent mb-3 tracking-wider">
                  WINNER!
                </p>
                <div className="relative inline-block mb-2">
                  <div className="absolute inset-0 rounded-full bg-secondary/40 blur-lg animate-pulse" />
                  <Avatar className="relative h-20 w-20 mx-auto border-4 border-secondary shadow-lg">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-3xl font-bold">
                      {winner.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-xl text-foreground font-bold">{winner}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  won <span className="font-semibold text-foreground">{itemInfo.name}</span>
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-secondary/20 via-secondary/30 to-secondary/20 border border-secondary/40">
                  <span className="text-xs text-muted-foreground">at</span>
                  <span className="text-base font-extrabold text-secondary">
                    ₹{currentBidInRupees.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-2xl mt-2 tracking-[0.4em]">✨🎊✨</div>
              </div>
            </div>
          )}

          {/* Next-item countdown overlay (3s between auctions) */}
          {nextItemCountdown !== null && nextItemCountdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-40 bg-foreground/70 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="text-center px-8 py-6 bg-card rounded-2xl shadow-2xl border-2 border-secondary">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Next item in</p>
                <p className="text-7xl font-extrabold text-secondary tabular-nums animate-pulse">{nextItemCountdown}</p>
                <p className="text-xs text-muted-foreground mt-2">Get ready to bid!</p>
              </div>
            </div>
          )}

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
                 <p className="text-white font-bold text-lg">₹{currentBidInRupees.toLocaleString("en-IN")}</p>
                <p className={`text-xs font-medium ${phase === "bid" ? "text-destructive-foreground animate-pulse" : "text-secondary"}`}>
                  {formatTime(displayTime > 0 ? displayTime : timeLeft)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wallet status row */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1 bg-primary text-primary-foreground text-[11px]">
          <div className="flex items-center gap-1.5">
            <WalletIcon className="h-3 w-3" />
            <span>Available: <span className="font-semibold">₹{availableBalance.toLocaleString("en-IN")}</span></span>
          </div>
          {lockedAmount > 0 && (
            <span className="text-secondary font-semibold">
              🔒 Locked in bid: ₹{lockedAmount.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Bid Buttons */}
        <div className="flex gap-2 p-3 pt-2 bg-primary">
          <Button
            variant="outline"
            className="flex-shrink-0 border-primary-foreground/20 text-primary-foreground bg-transparent hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-full px-5"
            onClick={() => setIsCustomBidOpen(true)}
            disabled={timeLeft <= 0}
          >
            Custom
          </Button>
          <Button
            className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-base rounded-full"
            onClick={() => handleBid(nextBid)}
            disabled={timeLeft <= 0}
          >
             Bid: ₹{nextBidInRupees.toLocaleString("en-IN")}
          </Button>
        </div>
      </div>

      {/* Insufficient Wallet Dialog */}
      <Dialog open={insufficientOpen} onOpenChange={setInsufficientOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Insufficient wallet balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">
              This bid requires <span className="font-bold text-foreground">₹{insufficientNeed.toLocaleString("en-IN")}</span>{" "}
              to be locked from your wallet.
            </p>
            <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Wallet balance</span><span className="font-semibold">₹{walletBalance.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Locked in current bid</span><span className="font-semibold">₹{lockedAmount.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between border-t pt-1"><span className="text-muted-foreground">Available</span><span className="font-bold text-secondary">₹{availableBalance.toLocaleString("en-IN")}</span></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Top up your wallet to continue bidding. If another bidder outbids you, your locked amount is released back automatically.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInsufficientOpen(false)}>Cancel</Button>
            <Button
              onClick={() => { setInsufficientOpen(false); navigate("/wallet"); }}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold"
            >
              <WalletIcon className="h-4 w-4 mr-1.5" /> Add Money
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Bid Dialog */}
      <Dialog open={isCustomBidOpen} onOpenChange={setIsCustomBidOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enter Custom Bid</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
               Current highest bid: <span className="font-bold text-secondary">₹{currentBidInRupees.toLocaleString("en-IN")}</span>
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Your bid amount (₹)</label>
              <Input
                type="number"
                 placeholder={`Enter more than ₹${currentBidInRupees.toLocaleString("en-IN")}`}
                value={customBidAmount}
                onChange={(e) => setCustomBidAmount(e.target.value)}
                 min={currentBidInRupees + 1}
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
