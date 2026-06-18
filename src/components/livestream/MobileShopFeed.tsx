import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Eye,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { streamsWithMeta } from "@/lib/streamRanking";
import { getStreamById } from "@/data/streamData";
import { useFollows } from "@/hooks/useFollows";
import { useLiveComments } from "@/hooks/useLiveComments";
import ProductDetailModal from "./ProductDetailModal";
import ShopLiveChat from "./ShopLiveChat";

interface MobileShopFeedProps {
  streamId: number;
}

const buildFeed = (currentId: number) => {
  const ids = streamsWithMeta.map((s) => s.id);
  return ids.includes(currentId) ? ids : [currentId, ...ids];
};

const ChatOverlay = ({ streamId }: { streamId: number }) => {
  const { comments, sendComment } = useLiveComments(`shop-live-${streamId}`);
  const [message, setMessage] = useState("");
  const recent = comments.slice(-3);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendComment(message);
    setMessage("");
  };

  return (
    <>
      <div className="pointer-events-none absolute left-3 right-20 bottom-[152px] z-20 flex flex-col gap-1.5 max-h-32 overflow-hidden">
        {recent.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-2 bg-foreground/40 backdrop-blur-sm rounded-2xl pl-1 pr-3 py-1 w-fit max-w-full"
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
      <div className="absolute left-3 right-3 bottom-3 z-20">
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Say something..."
            className="h-9 pr-10 rounded-full bg-foreground/30 backdrop-blur-md border border-white/30 text-white placeholder:text-white/70"
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

const ActiveSlide = ({ streamId }: { streamId: number }) => {
  const navigate = useNavigate();
  const { isFollowing, toggleFollow } = useFollows();
  const meta = useMemo(
    () => streamsWithMeta.find((s) => s.id === streamId),
    [streamId]
  );
  const data = useMemo(() => getStreamById(streamId), [streamId]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  if (!meta) return null;

  const products = data?.products || [];
  const following = isFollowing(meta.host);

  // Swipe-right → seller profile
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    touchStart.current = null;
    if (dx > 80 && Math.abs(dy) < 60) {
      navigate(`/seller/${encodeURIComponent(meta!.host)}`);
    }
  };

  return (
    <div
      className="relative h-full w-full bg-foreground overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background image */}
      <img
        src={meta.image.replace("w=400", "w=800")}
        alt={meta.title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-foreground/40"
        onClick={() => setIsPlaying((p) => !p)}
      />

      {/* Top bar: back + LIVE/viewers */}
      <Button
        size="icon"
        onClick={() => navigate("/shop-live")}
        aria-label="Back"
        className="absolute top-3 left-3 z-30 h-9 w-9 rounded-full bg-foreground/55 backdrop-blur-md text-white hover:bg-foreground/75 border border-white/20"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
        <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold gap-1">
          <Eye className="h-3 w-3" /> {meta.viewers}
        </Badge>
        <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold">
          LIVE
        </Badge>
      </div>

      {/* Play indicator (only when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="h-16 w-16 rounded-full bg-foreground/50 backdrop-blur-sm flex items-center justify-center">
            <Play className="h-8 w-8 text-white" />
          </div>
        </div>
      )}

      {/* Right action stack */}
      <div className="absolute right-3 bottom-[148px] z-20 flex flex-col items-center gap-2.5">
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setIsMuted((m) => !m);
          }}
          className="h-11 w-11 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
          aria-label="Mute"
        >
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            setLiked((l) => !l);
          }}
          className={`h-11 w-11 rounded-full backdrop-blur-md border border-white/20 text-white hover:bg-foreground/70 ${
            liked ? "bg-primary/80" : "bg-foreground/50"
          }`}
          aria-label="Like"
        >
          <ThumbsUp className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
        </Button>
        <Button
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.share) navigator.share({ title: meta.title, url: window.location.href }).catch(() => {});
          }}
          className="h-11 w-11 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className="h-11 w-11 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
              aria-label="Chat"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle>Live Chat</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-hidden px-3 pb-4">
              <ShopLiveChat streamId={`shop-live-${streamId}`} />
            </div>
          </SheetContent>
        </Sheet>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              onClick={(e) => e.stopPropagation()}
              className="h-11 w-11 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 border border-white/20"
              aria-label="Shop all products"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[75vh] p-0 flex flex-col">
            <SheetHeader className="px-4 pt-4 pb-2">
              <SheetTitle>Shop this stream</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <div className="grid grid-cols-2 gap-3">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="text-left rounded-lg border border-border bg-card overflow-hidden"
                  >
                    <div className="aspect-square bg-muted">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground line-clamp-2">{p.title}</p>
                      <p className="text-sm font-bold text-primary mt-1">
                        {p.currency}{p.price.toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Host bar */}
      <div className="absolute left-3 right-3 bottom-[130px] z-20 flex items-center gap-2">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(`/seller/${encodeURIComponent(meta.host)}`)}
        >
          <Avatar className="h-9 w-9 border-2 border-secondary">
            <AvatarImage src={meta.image} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {meta.host[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{meta.host}</p>
            <p className="text-white/80 text-[11px] truncate">{meta.title}</p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => toggleFollow(meta.host, "shop_live")}
          className={`ml-auto h-7 rounded-full text-[11px] font-semibold ${
            following
              ? "bg-white/20 text-white border border-white/30 hover:bg-white/30"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          }`}
        >
          {following ? "Following" : "+ Follow"}
        </Button>
      </div>

      {/* Left-bottom products menu trigger */}
      {products.length > 0 && (
        <div className="absolute left-3 bottom-3 z-20">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                onClick={(e) => e.stopPropagation()}
                className="h-11 px-3 rounded-full bg-foreground/55 backdrop-blur-md text-white hover:bg-foreground/75 border border-white/20 flex items-center gap-2"
                aria-label="Stream products"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="text-[11px] font-semibold">{products.length} items</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh] p-0 flex flex-col">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle>Items in this live</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-3 pb-4">
                <div className="grid grid-cols-2 gap-3">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProduct(p)}
                      className="text-left rounded-lg border border-border bg-card overflow-hidden"
                    >
                      <div className="aspect-square bg-muted">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium text-foreground line-clamp-2">{p.title}</p>
                        <p className="text-sm font-bold text-primary mt-1">
                          {p.currency}{p.price.toLocaleString()}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={() => navigate(`/seller/${encodeURIComponent(meta.host)}`)}
                  className="w-full mt-4 h-11 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 flex items-center justify-center gap-2 font-semibold"
                >
                  More from {meta.host}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}


      <ChatOverlay streamId={streamId} />

      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        sellerName={meta.host}
      />
    </div>
  );
};

const PreviewSlide = ({ id }: { id: number }) => {
  const meta = streamsWithMeta.find((s) => s.id === id);
  if (!meta) return null;
  return (
    <div className="relative h-full w-full bg-foreground overflow-hidden">
      <img
        src={meta.image.replace("w=400", "w=800")}
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
          <p className="text-white/70 text-xs">Live shopping</p>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Badge className="bg-destructive text-destructive-foreground text-[11px] font-bold">
          LIVE · {meta.viewers}
        </Badge>
      </div>
      <div className="absolute bottom-10 left-0 right-0 px-5 z-10 text-center">
        <p className="text-white font-bold text-lg drop-shadow">{meta.title}</p>
        <p className="text-white/70 text-xs mt-1">Swipe to load this stream</p>
      </div>
    </div>
  );
};

const MobileShopFeed = ({ streamId }: MobileShopFeedProps) => {
  const navigate = useNavigate();
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
              navigate(`/shop-live/${id}`, { replace: true });
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
          {id === streamId ? <ActiveSlide streamId={id} /> : <PreviewSlide id={id} />}
        </div>
      ))}
    </div>
  );
};

export default MobileShopFeed;
