import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trophy, Send, ArrowLeft, Volume2, VolumeX, Wallet as WalletIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LiveStreamVideo from "./LiveStreamVideo";
import LiveStreamShop from "./LiveStreamShop";
import AuctionWinnersPanel from "./AuctionWinnersPanel";
import ProductDetailModal from "./ProductDetailModal";


import { auctionStreams } from "@/lib/streamRanking";
import { useLiveComments } from "@/hooks/useLiveComments";
import { useWallet } from "@/hooks/useWallet";

interface MobileLiveFeedProps {
  streamId: number;
  currentBid: number;
  onBid: (amount: number) => void;
  sellerInfo: { name: string; image: string };
}

const INR_CONVERSION_RATE = 93.1;

// Match the static item data inside LiveStreamVideo so the mobile item bar shows
// exactly what the auction is currently selling.
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
const defaultItem = { name: "RB CRIMSON JORDAN RETRO 3 SZ: 14", description: "USED REP BOX AS-482", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800", itemNumber: "03" };

// Build the vertical feed using natural order of auctionStreams.
const buildFeed = (currentId: number) => {
  const ids = auctionStreams.map((s) => s.id);
  return ids.includes(currentId) ? ids : [currentId, ...ids];
};

const getMeta = (id: number) =>
  auctionStreams.find((s) => s.id === id) || {
    id,
    host: "stewsshoes",
    title: "Live Auction",
    viewers: 38,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    category: "",
    tags: [],
    productType: "",
    sellerNiche: "",
  };

const ChatOverlay = ({ streamId }: { streamId: number }) => {
  const { comments, sendComment } = useLiveComments(`live-${streamId}`);
  const [message, setMessage] = useState("");

  const recent = comments.slice(-5);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendComment(message);
    setMessage("");
  };

  return (
    <>
      {/* Floating chat messages on the left - above the item info bar */}
      <div className="pointer-events-none absolute left-3 right-20 bottom-[170px] z-20 flex flex-col gap-1.5 max-h-32 overflow-hidden">
        {[
          { name: "baseset_jett", text: "joined 👋" },
          { name: "hairysax", text: "joined 👋" },
        ].map((u, i) => (
          <div
            key={`j-${i}`}
            className="flex items-center gap-2 bg-foreground/40 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 w-fit max-w-full"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                {u.name[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-white truncate">
              <span className="font-semibold">{u.name}</span>{" "}
              <span className="text-white/80">{u.text}</span>
            </span>
          </div>
        ))}
        {recent.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-2 bg-foreground/40 backdrop-blur-sm rounded-2xl pl-1 pr-3 py-1 w-fit max-w-full animate-in fade-in slide-in-from-bottom-2"
          >
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                {(c.username || "U")[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-white break-words">
              <span className="font-semibold">{c.username || "User"}</span>{" "}
              <span className="text-white/90">{c.message}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Say something input - sits just above the bid bar, below the item info */}
      <div className="absolute left-3 right-3 bottom-[80px] z-20">
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Say something..."
            className="h-9 pr-10 rounded-full bg-foreground/50 backdrop-blur-md border border-white/30 text-white placeholder:text-white/70"
          />
          <Button
            size="icon"
            variant="ghost"
            disabled={!message.trim()}
            onClick={handleSend}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-white hover:text-white hover:bg-white/20"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

const ActiveSlide = ({
  streamId,
  currentBid,
  onBid,
  sellerInfo,
}: MobileLiveFeedProps) => {
  const navigate = useNavigate();
  const [muted, setMuted] = useState(false);
  const [showMuteHint, setShowMuteHint] = useState(false);
  const [productOpen, setProductOpen] = useState(false);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { balance: walletBalance } = useWallet();

  const itemInfo = streamItemData[streamId] || defaultItem;
  const currentBidInRupees = Math.round(currentBid * INR_CONVERSION_RATE);

  const toggleMute = () => {
    setMuted((m) => !m);
    setShowMuteHint(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setShowMuteHint(false), 800);
  };

  return (
    <div className="relative h-full w-full">
      <LiveStreamVideo
        key={`mvideo-${streamId}`}
        currentBid={currentBid}
        onBid={onBid}
        streamId={streamId}
      />

      {/* Tap-to-mute layer - kept clear of bottom controls (bid bar, say-something, item bar, action stack) */}
      <button
        type="button"
        aria-label={muted ? "Unmute" : "Mute"}
        onClick={toggleMute}
        className="absolute left-0 right-0 top-14 bottom-[400px] z-[6] bg-transparent"
      />

      {/* Mute state hint flash */}
      {showMuteHint && (
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[7] h-16 w-16 rounded-full bg-foreground/60 backdrop-blur-md flex items-center justify-center animate-in fade-in zoom-in-50">
          {muted ? <VolumeX className="h-8 w-8 text-white" /> : <Volume2 className="h-8 w-8 text-white" />}
        </div>
      )}

      {/* Back to dashboard */}
      <Button
        size="icon"
        onClick={() => navigate("/dashboard")}
        aria-label="Back"
        className="absolute top-3 left-3 z-30 h-9 w-9 rounded-full bg-foreground/55 backdrop-blur-md text-white hover:bg-foreground/75 border border-white/20"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Floating action stack on the right - sits above the chat overlay */}
      <div className="absolute right-3 bottom-[300px] z-30 flex flex-col items-center gap-2.5">
        {/* Wallet pill */}
        <div className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-2xl bg-foreground/55 backdrop-blur-md border border-white/20">
          <WalletIcon className="h-4 w-4 text-secondary" />
          <span className="text-[10px] font-bold text-white leading-none">
            ₹{walletBalance >= 1000 ? `${(walletBalance / 1000).toFixed(1)}k` : walletBalance.toLocaleString("en-IN")}
          </span>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-11 w-11 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
              aria-label="Shop"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle>Shop this stream</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden px-3 pb-4">
              <LiveStreamShop streamId={streamId} sellerInfo={sellerInfo} />
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-11 w-11 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
              aria-label="Winners"
            >
              <Trophy className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[60vh] p-0">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle>Auction Winners</SheetTitle>
            </SheetHeader>
            <div className="px-3 pb-4">
              <AuctionWinnersPanel streamId={streamId} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Item info bar - sits above the say-something input. Tap opens product details. */}
      <button
        type="button"
        onClick={() => setProductOpen(true)}
        className="absolute left-3 right-3 bottom-[130px] z-20 text-left"
      >
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-foreground/60 backdrop-blur-md border border-white/15 shadow-lg">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/20">
            <img src={itemInfo.image} alt={itemInfo.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-tight truncate">
              {itemInfo.itemNumber}. {itemInfo.name}
            </p>
            <p className="text-white/70 text-[11px] truncate">{itemInfo.description}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white font-bold text-sm leading-tight">
              ₹{currentBidInRupees.toLocaleString("en-IN")}
            </p>
            <p className="text-secondary text-[10px] font-semibold">Tap for details</p>
          </div>
        </div>
      </button>

      <ChatOverlay streamId={streamId} />

      <ProductDetailModal
        isOpen={productOpen}
        onClose={() => setProductOpen(false)}
        product={{
          id: streamId,
          image: itemInfo.image,
          title: itemInfo.name,
          price: currentBidInRupees,
          originalPrice: Math.round(currentBidInRupees * 1.2),
          currency: "₹",
        }}
        sellerName={sellerInfo.name}
        sellerAvatar={sellerInfo.image}
      />
    </div>
  );
};



const PreviewSlide = ({ id }: { id: number }) => {
  const meta = getMeta(id);
  return (
    <div className="relative h-full w-full bg-foreground overflow-hidden">
      <img
        src={meta.image}
        alt={meta.title}
        className="absolute inset-0 w-full h-full object-cover opacity-80"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/30 to-foreground/40" />
      <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
        <Avatar className="h-9 w-9 border-2 border-secondary">
          <AvatarImage src={meta.image} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {meta.host[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white text-sm font-semibold">{meta.host}</p>
          <p className="text-white/70 text-xs">Live auction</p>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <span className="bg-destructive text-destructive-foreground text-xs font-bold px-2.5 py-1 rounded-full">
          LIVE · {meta.viewers}
        </span>
      </div>
      <div className="absolute bottom-10 left-0 right-0 px-5 z-10 text-center">
        <p className="text-white font-bold text-lg drop-shadow">{meta.title}</p>
        <p className="text-white/70 text-xs mt-1">Scroll to load this auction</p>
      </div>
    </div>
  );
};

const MobileLiveFeed = (props: MobileLiveFeedProps) => {
  const navigate = useNavigate();
  const { streamId } = props;
  const feed = useMemo(() => buildFeed(streamId), [streamId]);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const didInitialScroll = useRef(false);

  useEffect(() => {
    if (didInitialScroll.current) return;
    const el = slideRefs.current.get(streamId);
    const root = containerRef.current;
    if (el && root) {
      root.scrollTo({ top: el.offsetTop, behavior: "auto" });
      didInitialScroll.current = true;
    }
  }, [streamId, feed]);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
            const idAttr = (entry.target as HTMLElement).dataset.streamId;
            if (!idAttr) return;
            const id = parseInt(idAttr, 10);
            if (!Number.isNaN(id) && id !== streamId) {
              navigate(`/live/${id}`, { replace: true });
            }
          }
        });
      },
      { root, threshold: [0.65] }
    );

    slideRefs.current.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [streamId, navigate, feed]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto snap-y snap-mandatory"
      style={{ scrollbarWidth: "none" }}
    >
      {feed.map((id) => (
        <div
          key={id}
          data-stream-id={id}
          ref={(el) => {
            if (el) slideRefs.current.set(id, el);
            else slideRefs.current.delete(id);
          }}
          className="h-full w-full snap-start"
        >
          {id === streamId ? (
            <ActiveSlide {...props} streamId={id} />
          ) : (
            <PreviewSlide id={id} />
          )}
        </div>
      ))}
    </div>
  );
};

export default MobileLiveFeed;
