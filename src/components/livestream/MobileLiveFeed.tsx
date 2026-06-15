import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Trophy, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LiveStreamVideo from "./LiveStreamVideo";
import LiveStreamShop from "./LiveStreamShop";
import AuctionWinnersPanel from "./AuctionWinnersPanel";
import LiveStreamChat from "./LiveStreamChat";
import { auctionStreams } from "@/lib/streamRanking";
import { useLiveComments } from "@/hooks/useLiveComments";

interface MobileLiveFeedProps {
  streamId: number;
  currentBid: number;
  onBid: (amount: number) => void;
  sellerInfo: { name: string; image: string };
}

// Build the vertical feed order: current stream first, then the rest of auctionStreams
const buildFeed = (currentId: number) => {
  const ids = auctionStreams.map((s) => s.id);
  const list = ids.includes(currentId) ? ids : [currentId, ...ids];
  // Move currentId to front, then preserve order of the others
  return [currentId, ...list.filter((id) => id !== currentId)];
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

  // Show the last few real comments + a couple of seeded joins for liveliness
  const recent = comments.slice(-4);

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendComment(message);
    setMessage("");
  };

  return (
    <>
      {/* Floating chat messages on the left, above bid bar */}
      <div className="pointer-events-none absolute left-3 right-24 bottom-[150px] z-20 flex flex-col gap-1.5 max-h-40 overflow-hidden">
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

      {/* Say something input, above bid bar */}
      <div className="absolute left-3 right-3 bottom-[96px] z-20">
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

const ActiveSlide = ({
  streamId,
  currentBid,
  onBid,
  sellerInfo,
}: MobileLiveFeedProps) => {
  return (
    <div className="relative h-full w-full">
      <LiveStreamVideo
        key={`mvideo-${streamId}`}
        currentBid={currentBid}
        onBid={onBid}
        streamId={streamId}
      />

      {/* Floating action stack on the right (above timer block sits at top) */}
      <div className="absolute right-3 bottom-[170px] z-20 flex flex-col items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
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
              className="h-12 w-12 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
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

        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-foreground/50 backdrop-blur-md text-white hover:bg-foreground/70 border border-white/20"
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
              {/* Lazy import the real chat */}
              <FullChat streamId={streamId} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <ChatOverlay streamId={streamId} />
    </div>
  );
};

// Lightweight wrapper to keep this file's import surface obvious
const FullChat = ({ streamId }: { streamId: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const LiveStreamChat = require("./LiveStreamChat").default as React.FC<{
    streamId?: string;
  }>;
  return <LiveStreamChat streamId={`live-${streamId}`} />;
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

  // Observe slides to switch route when one comes into view
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
      className="h-[calc(100dvh-7.5rem)] overflow-y-auto snap-y snap-mandatory -mx-2 sm:-mx-4 rounded-none scroll-smooth"
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
