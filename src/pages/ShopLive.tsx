import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import FeaturedCreators from "@/components/livestream/FeaturedCreators";
import ShopLiveVideo from "@/components/livestream/ShopLiveVideo";
import ShopLiveChat from "@/components/livestream/ShopLiveChat";
import HorizontalProducts from "@/components/livestream/HorizontalProducts";
import UpcomingStreams from "@/components/livestream/UpcomingStreams";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getStreamById, getDefaultStream } from "@/data/streamData";

const ShopLive = () => {
  const navigate = useNavigate();
  const { streamId } = useParams();

  const stream = streamId ? getStreamById(Number(streamId)) : getDefaultStream();
  const currentStream = stream || getDefaultStream();
  const chatStreamId = `shop-live-${currentStream.id}`;

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedHeader />
      
      <div className="pt-32 sm:pt-28 md:pt-20 px-2 sm:px-4 lg:px-6 pb-24 lg:pb-8">
        {/* Back Button */}
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
        
        {/* Main Content Grid */}
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] xl:grid-cols-[220px_1fr_320px] gap-3 sm:gap-4">
            <div className="hidden lg:block lg:row-span-2">
              <FeaturedCreators />
            </div>

            <div className="w-full min-w-0 lg:row-span-2">
              <ShopLiveVideo
                hostName={currentStream.host}
                hostAvatar={currentStream.hostAvatar}
                streamImage={currentStream.image}
              />
              <HorizontalProducts
                hostName={currentStream.host}
                hostAvatar={currentStream.hostAvatar}
                streamTitle={currentStream.streamTitle}
                streamDate={currentStream.streamDate}
                products={currentStream.products}
              />
            </div>

            <div className="hidden lg:block lg:row-span-2 min-w-0">
              <ShopLiveChat streamId={chatStreamId} />
            </div>
          </div>

          <div className="mt-6">
            <UpcomingStreams />
            <RecommendedStreams currentStreamId={currentStream.id} />
          </div>
        </div>

        <div className="lg:hidden mt-4 space-y-4 max-w-[1600px] mx-auto">
          <ShopLiveChat />
          <FeaturedCreators />
          <UpcomingStreams />
          <RecommendedStreams currentStreamId={currentStream.id} />
        </div>
      </div>
    </div>
  );
};

export default ShopLive;
