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
        
        {/* Main Content Grid: Creators | Video+Products+Streams | Chat */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[220px_1fr_280px] gap-3 sm:gap-4">
          {/* Left Sidebar - Featured Creators (Desktop only - spans full height) */}
          <div className="hidden lg:block lg:row-span-3">
            <FeaturedCreators />
          </div>

          {/* Center Column - Video, Products, Upcoming, Recommended */}
          <div className="w-full space-y-4 lg:row-span-3">
            <ShopLiveVideo />
            <HorizontalProducts />
            <UpcomingStreams />
            <RecommendedStreams />
          </div>

          {/* Right Sidebar - Chat (Desktop only) */}
          <div className="hidden lg:block">
            <ShopLiveChat />
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
