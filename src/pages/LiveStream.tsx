import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import LiveStreamVideo from "@/components/livestream/LiveStreamVideo";
import LiveStreamShop from "@/components/livestream/LiveStreamShop";
import LiveStreamChat from "@/components/livestream/LiveStreamChat";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const LiveStream = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentBid, setCurrentBid] = useState(79);
  const currentStreamId = id ? parseInt(id) : undefined;
  const streamId = `live-${id || "default"}`;

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
              streamId={currentStreamId}
            />
          </div>

          <div className="hidden lg:block">
            <LiveStreamChat streamId={streamId} />
          </div>
        </div>

        <div className="lg:hidden mt-3 sm:mt-4 space-y-3 sm:space-y-4">
          <LiveStreamShop />
          <LiveStreamChat streamId={streamId} />
        </div>

        <div className="max-w-[1600px] mx-auto">
          <RecommendedStreams currentStreamId={currentStreamId} />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
