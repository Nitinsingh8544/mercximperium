import { useState, useCallback, useMemo } from "react";
import RecommendedSection from "@/components/livestream/RecommendedSection";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import FeaturedCreators from "@/components/livestream/FeaturedCreators";
import ShopLiveVideo from "@/components/livestream/ShopLiveVideo";
import ShopLiveChat from "@/components/livestream/ShopLiveChat";
import AuctionPanel from "@/components/livestream/AuctionPanel";
import { getStreamById as getStreamDataById } from "@/data/streamData";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import ExploreMoreSection from "@/components/livestream/ExploreMoreSection";
import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Gavel } from "lucide-react";
import { findStreamById, streamsWithMeta } from "@/lib/streamRanking";

const ShopLive = () => {
  const navigate = useNavigate();
  const { streamId } = useParams();
  const [mode, setMode] = useState<"sales" | "auction">("sales");

  // Redirect to landing if no streamId
  if (!streamId) {
    navigate("/shop-live", { replace: true });
  }

  const initialId = streamId ? Number(streamId) : streamsWithMeta[0]?.id || 1;

  // History stack: array of stream IDs the user has viewed
  const [history, setHistory] = useState<number[]>([initialId]);
  // Pointer into the history stack (current position)
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentStreamId = history[historyIndex];
  const currentStream = useMemo(() => {
    const found = findStreamById(currentStreamId);
    if (found) return found;
    return streamsWithMeta[0];
  }, [currentStreamId]);

  const streamProducts = useMemo(() => {
    const match = getStreamDataById(currentStream.id);
    return match?.products || [];
  }, [currentStream]);

  const chatStreamId = `shop-live-${currentStream.id}`;

  // Navigate to a new stream: truncate forward history and push new entry
  const handleStreamSelect = useCallback((id: number) => {
    setHistory(prev => {
      // Avoid pushing duplicate of current
      const currentIdx = prev.length - 1; // we'll use the latest historyIndex
      return [...prev.slice(0, historyIndex + 1), id];
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  // Go back in history
  const goPrev = useCallback(() => {
    setHistoryIndex(prev => Math.max(prev - 1, 0));
  }, []);

  // Go forward in history
  const goNext = useCallback(() => {
    setHistoryIndex(prev => Math.min(prev + 1, history.length - 1));
  }, [history.length]);

  const hasPrev = historyIndex > 0;
  const hasNext = historyIndex < history.length - 1;

  const handleCreatorSelect = useCallback((streamId: number) => {
    handleStreamSelect(streamId);
  }, [handleStreamSelect]);

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden lg:block">
        <AuthenticatedHeader />
      </div>

      <div className="lg:pt-20 px-0 sm:px-4 lg:px-6 pb-20 lg:pb-8">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border/60 flex items-center justify-between px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/shop-live")}
            className="gap-1.5 text-foreground hover:bg-muted h-9 px-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs">Back</span>
          </Button>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
            <Button
              variant={mode === "sales" ? "default" : "ghost"}
              size="sm"
              className={`h-7 text-[11px] gap-1 px-2 ${mode === "sales" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setMode("sales")}
            >
              <ShoppingBag className="h-3 w-3" />
              Sales
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[11px] gap-1 px-2"
              onClick={() => navigate("/dashboard")}
            >
              <Gavel className="h-3 w-3" />
              Auction
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex max-w-[1600px] mx-auto mb-3 items-center justify-between px-2 sm:px-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={mode === "sales" ? "default" : "ghost"}
              size="sm"
              className={`h-8 text-xs gap-1.5 ${mode === "sales" ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setMode("sales")}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Live Sales
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs gap-1.5"
              onClick={() => navigate("/dashboard")}
            >
              <Gavel className="h-3.5 w-3.5" />
              Auction
            </Button>
          </div>
        </div>
        
        <div className="max-w-[1600px] mx-auto">
          {/* Main 3-column layout: Following | Stream | Chat - all same height */}
          <div className="hidden lg:grid lg:grid-cols-[200px_1fr_320px] xl:grid-cols-[220px_1fr_350px] gap-3 sm:gap-4 h-[672px]">
            <div className="h-full overflow-hidden">
              <FeaturedCreators onCreatorSelect={handleCreatorSelect} activeStreamId={currentStream.id} />
            </div>

            <div className="h-full min-w-0 overflow-hidden">
              <ShopLiveVideo
                hostName={currentStream.host}
                hostAvatar={undefined}
                streamImage={currentStream.image.replace('w=400', 'w=800')}
                streamTitle={currentStream.title}
                streamDate={`${currentStream.viewers} viewers`}
                products={mode === "sales" ? streamProducts : []}
                onNext={goNext}
                onPrev={goPrev}
                hasNext={hasNext}
                hasPrev={hasPrev}
              />
            </div>

            <div className="h-full overflow-hidden">
              {mode === "sales" ? (
                <ShopLiveChat streamId={chatStreamId} />
              ) : (
                <AuctionPanel streamId={currentStream.id} sellerName={currentStream.host} />
              )}
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <RecommendedStreams currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
            <RecommendedSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
            <ExploreMoreSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden mt-2 space-y-4 px-2 max-w-[1600px] mx-auto">
          <div className="h-[calc(100dvh-9rem)] min-h-[480px]">
            <ShopLiveVideo
              hostName={currentStream.host}
              hostAvatar={undefined}
              streamImage={currentStream.image.replace('w=400', 'w=800')}
              streamTitle={currentStream.title}
              streamDate={`${currentStream.viewers} viewers`}
              products={mode === "sales" ? streamProducts : []}
              onNext={goNext}
              onPrev={goPrev}
              hasNext={hasNext}
              hasPrev={hasPrev}
            />
          </div>
          {mode === "sales" ? (
            <ShopLiveChat streamId={chatStreamId} />
          ) : (
            <AuctionPanel streamId={currentStream.id} sellerName={currentStream.host} />
          )}
          <FeaturedCreators onCreatorSelect={handleCreatorSelect} activeStreamId={currentStream.id} />
          <RecommendedStreams currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          <RecommendedSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          <ExploreMoreSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
        </div>
      </div>

      <div className="lg:hidden">
        <BottomNav />
      </div>
    </div>
  );
};

export default ShopLive;
