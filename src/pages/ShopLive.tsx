import { useState, useCallback, useMemo } from "react";
import RecommendedSection from "@/components/livestream/RecommendedSection";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import FeaturedCreators from "@/components/livestream/FeaturedCreators";
import ShopLiveVideo from "@/components/livestream/ShopLiveVideo";
import ShopLiveChat from "@/components/livestream/ShopLiveChat";
import { getStreamById as getStreamDataById } from "@/data/streamData";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import ExploreMoreSection from "@/components/livestream/ExploreMoreSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { findStreamById, streamsWithMeta } from "@/lib/streamRanking";

const ShopLive = () => {
  const navigate = useNavigate();
  const { streamId } = useParams();

  // History stack: array of stream IDs the user has viewed
  const [history, setHistory] = useState<number[]>(() => {
    const initialId = streamId ? Number(streamId) : streamsWithMeta[0]?.id || 1;
    return [initialId];
  });
  // Pointer into the history stack (current position)
  const [historyIndex, setHistoryIndex] = useState(0);

  const currentStreamId = history[historyIndex];
  const currentStream = useMemo(() => {
    const found = findStreamById(currentStreamId);
    if (found) return found;
    // Fallback to first stream
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
      <AuthenticatedHeader />
      
      <div className="pt-32 sm:pt-28 md:pt-20 px-2 sm:px-4 lg:px-6 pb-24 lg:pb-8">
        <div className="max-w-[1600px] mx-auto mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
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
                products={streamProducts}
                onNext={goNext}
                onPrev={goPrev}
                hasNext={hasNext}
                hasPrev={hasPrev}
              />
            </div>

            <div className="h-full overflow-hidden">
              <ShopLiveChat streamId={chatStreamId} />
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <RecommendedStreams currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
            <RecommendedSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
            <ExploreMoreSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          </div>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden mt-4 space-y-4 max-w-[1600px] mx-auto">
          <ShopLiveVideo
            hostName={currentStream.host}
            hostAvatar={undefined}
            streamImage={currentStream.image.replace('w=400', 'w=800')}
            streamTitle={currentStream.title}
            streamDate={`${currentStream.viewers} viewers`}
            products={streamProducts}
            onNext={goNext}
            onPrev={goPrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
          <ShopLiveChat streamId={chatStreamId} />
          <FeaturedCreators onCreatorSelect={handleCreatorSelect} activeStreamId={currentStream.id} />
          <RecommendedStreams currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          <RecommendedSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          <ExploreMoreSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
        </div>
      </div>
    </div>
  );
};

export default ShopLive;
