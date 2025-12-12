import { useState } from "react";
import { useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import LiveStreamVideo from "@/components/livestream/LiveStreamVideo";
import LiveStreamShop from "@/components/livestream/LiveStreamShop";
import LiveStreamChat from "@/components/livestream/LiveStreamChat";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";

const LiveStream = () => {
  const { id } = useParams();
  const [currentBid, setCurrentBid] = useState(79);
  const currentStreamId = id ? parseInt(id) : undefined;

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="pt-20 px-4 lg:px-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-4">
          {/* Left Sidebar - Shop */}
          <div className="hidden lg:block">
            <LiveStreamShop />
          </div>

          {/* Center - Video Player */}
          <div className="w-full">
            <LiveStreamVideo 
              currentBid={currentBid} 
              onBid={() => setCurrentBid(prev => prev + 5)} 
            />
          </div>

          {/* Right Sidebar - Chat */}
          <div className="hidden lg:block">
            <LiveStreamChat />
          </div>
        </div>

        {/* Mobile Shop & Chat Tabs */}
        <div className="lg:hidden mt-4 space-y-4">
          <LiveStreamShop />
          <LiveStreamChat />
        </div>

        {/* Recommended Streams */}
        <div className="max-w-[1600px] mx-auto">
          <RecommendedStreams currentStreamId={currentStreamId} />
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
