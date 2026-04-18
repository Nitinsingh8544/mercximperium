import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import LiveStreamVideo from "@/components/livestream/LiveStreamVideo";
import LiveStreamShop from "@/components/livestream/LiveStreamShop";
import LiveStreamChat from "@/components/livestream/LiveStreamChat";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import AuctionWinnersPanel from "@/components/livestream/AuctionWinnersPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Gavel, ChevronLeft, ChevronRight } from "lucide-react";
import { auctionStreams } from "@/lib/streamRanking";

// Stream-specific seller mapping (mirror of LiveStreamVideo)
const streamSellerData: Record<number, { name: string; image: string }> = {
  301: { name: "antiqueauctions", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  302: { name: "cardkingz", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
  303: { name: "gemdealer", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" },
  304: { name: "retrorides", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100" },
  305: { name: "artbidhouse", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100" },
  306: { name: "winebidder", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100" },
  307: { name: "signedstuff", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100" },
  308: { name: "coinmaster", image: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100" },
  309: { name: "luxurywatchbid", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
  310: { name: "sneakervault", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
};

const LiveStream = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentBid, setCurrentBid] = useState(79);
  const [mode, setMode] = useState<"live" | "shopLive">("live");

  const streamId = id ? parseInt(id) : 1;

  // Reset bid when stream changes
  useEffect(() => {
    setCurrentBid(79);
  }, [streamId]);

  const streamChatId = `live-${streamId}`;

  // Prev / Next sync via auctionStreams ordering
  const auctionIds = useMemo(() => auctionStreams.map(s => s.id), []);
  const currentIdx = auctionIds.indexOf(streamId);
  const hasPrev = currentIdx > 0;
  const hasNext = currentIdx >= 0 && currentIdx < auctionIds.length - 1;

  const goToStream = useCallback((newId: number) => {
    navigate(`/live/${newId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const handlePrev = () => { if (hasPrev) goToStream(auctionIds[currentIdx - 1]); };
  const handleNext = () => { if (hasNext) goToStream(auctionIds[currentIdx + 1]); };

  const handleModeSwitch = (newMode: "live" | "shopLive") => {
    if (newMode === "shopLive") {
      navigate("/shop-live");
    } else {
      setMode("live");
    }
  };

  const handleStreamSelect = (newStreamId: number) => {
    navigate(`/live/${newStreamId}`);
  };

  const sellerInfo = streamSellerData[streamId] || { name: "Seller", image: "" };

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="pt-32 sm:pt-28 md:pt-20 px-2 sm:px-4 lg:px-6 pb-8">
        <div className="max-w-[1600px] mx-auto mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-foreground hover:bg-muted">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            {/* Prev / Next auction navigation */}
            <div className="flex items-center gap-1 ml-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasPrev}
                onClick={handlePrev}
                className="h-8 gap-1 text-xs"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!hasNext}
                onClick={handleNext}
                className="h-8 gap-1 text-xs"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={mode === "live" ? "default" : "ghost"}
              size="sm"
              className={`h-8 text-xs gap-1.5 ${mode === "live" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => handleModeSwitch("live")}
            >
              <Gavel className="h-3.5 w-3.5" />
              Auction
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => handleModeSwitch("shopLive")}>
              <ShoppingBag className="h-3.5 w-3.5" />
              Shop Live
            </Button>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto">
          {/* Desktop 3-column layout */}
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr_320px] gap-3 sm:gap-4 h-[672px]">
            <div className="h-full overflow-hidden flex flex-col gap-3" key={`shop-${streamId}`}>
              <div className="flex-1 min-h-0 overflow-hidden">
                <LiveStreamShop streamId={streamId} sellerInfo={sellerInfo} />
              </div>
              <AuctionWinnersPanel streamId={streamId} />
            </div>
            <div className="h-full min-w-0 overflow-hidden" key={`video-${streamId}`}>
              <LiveStreamVideo 
                currentBid={currentBid} 
                onBid={(amount) => setCurrentBid(amount)} 
                streamId={streamId}
                onPrev={handlePrev}
                onNext={handleNext}
                hasPrev={hasPrev}
                hasNext={hasNext}
              />
            </div>
            <div className="h-full overflow-hidden" key={`chat-${streamId}`}>
              <LiveStreamChat streamId={streamChatId} />
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          <LiveStreamVideo 
            key={`mvideo-${streamId}`}
            currentBid={currentBid} 
            onBid={(amount) => setCurrentBid(amount)} 
            streamId={streamId}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
          <AuctionWinnersPanel streamId={streamId} />
          <LiveStreamShop key={`mshop-${streamId}`} streamId={streamId} sellerInfo={sellerInfo} />
          <LiveStreamChat key={`mchat-${streamId}`} streamId={streamChatId} />
        </div>

        <div className="max-w-[1600px] mx-auto mt-6">
          <RecommendedStreams currentStreamId={streamId} onStreamSelect={handleStreamSelect} />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
