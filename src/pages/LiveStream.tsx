import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import LiveStreamVideo from "@/components/livestream/LiveStreamVideo";
import LiveStreamShop from "@/components/livestream/LiveStreamShop";
import LiveStreamChat from "@/components/livestream/LiveStreamChat";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { allStreams } from "@/data/streamData";

const LiveStream = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentBid, setCurrentBid] = useState(79);

  const [currentStreamIndex, setCurrentStreamIndex] = useState(() => {
    if (id) {
      const idx = allStreams.findIndex(s => s.id === parseInt(id));
      return idx >= 0 ? idx : 0;
    }
    return 0;
  });

  const currentStream = allStreams[currentStreamIndex];
  const streamChatId = `live-${currentStream.id}`;

  const goNext = useCallback(() => {
    setCurrentStreamIndex(prev => Math.min(prev + 1, allStreams.length - 1));
    setCurrentBid(79);
  }, []);

  const goPrev = useCallback(() => {
    setCurrentStreamIndex(prev => Math.max(prev - 1, 0));
    setCurrentBid(79);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="pt-32 sm:pt-28 md:pt-20 px-2 sm:px-4 lg:px-6">
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
        
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-3 sm:gap-4">
          <div className="hidden lg:block">
            <LiveStreamShop />
          </div>

          <div className="w-full">
            <LiveStreamVideo 
              currentBid={currentBid} 
              onBid={(amount) => setCurrentBid(amount)} 
              streamId={currentStream.id}
              onNext={goNext}
              onPrev={goPrev}
              hasNext={currentStreamIndex < allStreams.length - 1}
              hasPrev={currentStreamIndex > 0}
            />
          </div>

          <div className="hidden lg:block">
            <LiveStreamChat streamId={streamChatId} />
          </div>
        </div>

        <div className="lg:hidden mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          <LiveStreamShop />
          <LiveStreamChat streamId={streamChatId} />
        </div>

        <div className="max-w-[1600px] mx-auto">
          <RecommendedStreams currentStreamId={currentStream.id} />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
