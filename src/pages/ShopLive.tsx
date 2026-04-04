import { useState, useCallback, useMemo } from "react";
import RecommendedSection from "@/components/livestream/RecommendedSection";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import FeaturedCreators from "@/components/livestream/FeaturedCreators";
import ShopLiveVideo from "@/components/livestream/ShopLiveVideo";
import ShopLiveChat from "@/components/livestream/ShopLiveChat";
import { allStreams } from "@/data/streamData";
import RecommendedStreams, { similarStreams } from "@/components/livestream/RecommendedStreams";
import ExploreMoreSection from "@/components/livestream/ExploreMoreSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ShopLive = () => {
  const navigate = useNavigate();
  const { streamId } = useParams();

  const [currentSimilarIndex, setCurrentSimilarIndex] = useState(() => {
    if (streamId) {
      const idx = similarStreams.findIndex(s => s.id === Number(streamId));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentStream = similarStreams[currentSimilarIndex];

  const streamProducts = useMemo(() => {
    const match = allStreams.find(s => s.host === currentStream.host || s.id === currentStream.id);
    return match?.products || [];
  }, [currentStream]);

  const chatStreamId = `shop-live-${currentStream.id}`;

  const goNext = useCallback(() => {
    setCurrentSimilarIndex(prev => Math.min(prev + 1, similarStreams.length - 1));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentSimilarIndex(prev => Math.max(prev - 1, 0));
  }, []);

  const handleStreamSelect = useCallback((id: number) => {
    const idx = similarStreams.findIndex(s => s.id === id);
    if (idx >= 0) setCurrentSimilarIndex(idx);
  }, []);

  const handleCreatorSelect = useCallback((streamId: number) => {
    const idx = similarStreams.findIndex(s => s.id === streamId);
    if (idx >= 0) {
      setCurrentSimilarIndex(idx);
    }
  }, []);

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
                hasNext={currentSimilarIndex < similarStreams.length - 1}
                hasPrev={currentSimilarIndex > 0}
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
            hasNext={currentSimilarIndex < similarStreams.length - 1}
            hasPrev={currentSimilarIndex > 0}
          />
          <ShopLiveChat streamId={chatStreamId} />
          <FeaturedCreators onCreatorSelect={handleCreatorSelect} activeStreamId={currentStream.id} />
          <RecommendedStreams currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
          <RecommendedSection currentStreamId={currentStream.id} onStreamSelect={handleStreamSelect} />
        </div>
      </div>
    </div>
  );
};

export default ShopLive;
