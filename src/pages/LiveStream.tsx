import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import LiveStreamVideo from "@/components/livestream/LiveStreamVideo";
import LiveStreamShop from "@/components/livestream/LiveStreamShop";
import LiveStreamChat from "@/components/livestream/LiveStreamChat";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Gavel } from "lucide-react";
import { allStreams } from "@/data/streamData";
import { auctionStreams, findStreamById } from "@/lib/streamRanking";

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

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="pt-32 sm:pt-28 md:pt-20 px-2 sm:px-4 lg:px-6 pb-8">
        <div className="max-w-[1600px] mx-auto mb-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2 text-foreground hover:bg-muted">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

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
            <div className="h-full overflow-hidden">
              <LiveStreamShop />
            </div>
            <div className="h-full min-w-0 overflow-hidden">
              <LiveStreamVideo 
                currentBid={currentBid} 
                onBid={(amount) => setCurrentBid(amount)} 
                streamId={streamId}
              />
            </div>
            <div className="h-full overflow-hidden">
              <LiveStreamChat streamId={streamChatId} />
            </div>
          </div>
        </div>

        <div className="lg:hidden mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          <LiveStreamVideo 
            currentBid={currentBid} 
            onBid={(amount) => setCurrentBid(amount)} 
            streamId={streamId}
          />
          <LiveStreamShop />
          <LiveStreamChat streamId={streamChatId} />
        </div>

        <div className="max-w-[1600px] mx-auto mt-6">
          <RecommendedStreams currentStreamId={streamId} onStreamSelect={handleStreamSelect} />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
