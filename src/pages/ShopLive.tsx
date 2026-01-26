import { useNavigate } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import FeaturedCreators from "@/components/livestream/FeaturedCreators";
import ShopLiveVideo from "@/components/livestream/ShopLiveVideo";
import ShopLiveChat from "@/components/livestream/ShopLiveChat";
import HorizontalProducts from "@/components/livestream/HorizontalProducts";
import UpcomingStreams from "@/components/livestream/UpcomingStreams";
import RecommendedStreams from "@/components/livestream/RecommendedStreams";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ShopLive = () => {
  const navigate = useNavigate();

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
        
        {/* Main Content Grid: Creators | Video + Chat | then Products/Streams full width */}
        <div className="max-w-[1600px] mx-auto">
          {/* Top Section: Creators | Video | Chat */}
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_300px] xl:grid-cols-[220px_1fr_320px] gap-3 sm:gap-4">
            {/* Left Sidebar - Featured Creators (Desktop only - spans 2 rows) */}
            <div className="hidden lg:block lg:row-span-2">
              <FeaturedCreators />
            </div>

            {/* Center Column - Video and Products (seamless card) */}
            <div className="w-full min-w-0 lg:row-span-2">
              <ShopLiveVideo />
              <HorizontalProducts />
            </div>

            {/* Right Sidebar - Chat (Desktop only - spans 2 rows to align with video+products) */}
            <div className="hidden lg:block lg:row-span-2 min-w-0">
              <ShopLiveChat />
            </div>
          </div>

          {/* Full Width Sections: Upcoming and Recommended Streams */}
          <div className="mt-6">
            <UpcomingStreams />
            <RecommendedStreams />
          </div>
        </div>

        {/* Mobile: Creators, Products & Chat stacked */}
        <div className="lg:hidden mt-4 space-y-4 max-w-[1600px] mx-auto">
          <ShopLiveChat />
          <FeaturedCreators />
          <UpcomingStreams />
          <RecommendedStreams />
        </div>
      </div>
    </div>
  );
};

export default ShopLive;
