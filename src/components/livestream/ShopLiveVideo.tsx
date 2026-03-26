import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, ChevronRight, ChevronLeft, Share2, ThumbsUp, ThumbsDown, Flag, Eye } from "lucide-react";
import { useFollows } from "@/hooks/useFollows";
import ShareProfileModal from "@/components/seller/ShareProfileModal";
import ReportModal from "@/components/livestream/ReportModal";
import SellerProfileModal from "@/components/seller/SellerProfileModal";
import ProductDetailModal from "@/components/livestream/ProductDetailModal";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
}

interface ShopLiveVideoProps {
  hostName?: string;
  hostAvatar?: string;
  streamImage?: string;
  streamTitle?: string;
  streamDate?: string;
  products?: Product[];
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ShopLiveVideo = ({ hostName = "Sponsored Live", hostAvatar, streamImage, streamTitle, streamDate, products = [], onNext, onPrev, hasNext = true, hasPrev = true }: ShopLiveVideoProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [sellerProfileOpen, setSellerProfileOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const productsScrollRef = useRef<HTMLDivElement>(null);
  const { isFollowing, toggleFollow } = useFollows();
  const isFollowingHost = isFollowing(hostName);

  const viewerCount = Math.floor(Math.random() * 500) + 50;

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    if (disliked) setDisliked(false);
  };

  const handleDislike = () => {
    setDisliked(!disliked);
    if (liked) setLiked(false);
  };

  return (
    <>
      <div ref={containerRef} className="relative rounded-xl overflow-hidden bg-card border border-border">
        <div className="relative aspect-video bg-gradient-to-br from-muted to-card">
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <Badge variant="destructive" className="bg-red-600 text-white flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {viewerCount}
            </Badge>
            <Badge variant="destructive" className="bg-red-600 text-white">LIVE</Badge>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src={streamImage || "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"}
              alt="Live shopping stream"
              className="w-full h-full object-cover"
            />
          </div>
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button variant="ghost" size="icon" className="h-16 w-16 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsPlaying(true)}>
                <Play className="h-8 w-8 text-foreground" />
              </Button>
            </div>
          )}

          {hasPrev && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={onPrev}>
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </Button>
            </div>
          )}

          {hasNext && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={onNext}>
                <ChevronRight className="h-5 w-5 text-foreground" />
              </Button>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4 z-10">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-secondary rounded-full" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 bg-card/60 backdrop-blur-sm rounded-full hover:bg-card/80" onClick={toggleFullscreen}>
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Host info bar */}
        <div className="p-3 bg-card">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSellerProfileOpen(true)}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={hostAvatar} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {hostName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground">{hostName}</h3>
                <p className="text-xs text-muted-foreground">View my storefront &gt;</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 text-xs ${isFollowingHost ? "bg-muted text-muted-foreground" : ""}`}
              onClick={() => toggleFollow(hostName, "shop_live")}
            >
              {isFollowingHost ? "Following" : "+ Follow"}
            </Button>
            <div className="flex-1" />
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShareOpen(true)}>
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${liked ? "text-primary" : ""}`}
                onClick={handleLike}
              >
                <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${disliked ? "text-destructive" : ""}`}
                onClick={handleDislike}
              >
                <ThumbsDown className={`h-4 w-4 ${disliked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setReportOpen(true)}>
                <Flag className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stream title & date */}
          {streamTitle && (
            <div className="mt-2">
              <h4 className="font-bold text-foreground text-sm">{streamTitle}</h4>
              {streamDate && <p className="text-xs text-muted-foreground">{streamDate}</p>}
            </div>
          )}

          {/* Products list */}
          {products.length > 0 && (
            <div className="mt-3 relative group/products">
              <div
                ref={productsScrollRef}
                className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
              >
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="shrink-0 w-[100px] cursor-pointer group/item"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <div className="w-[100px] h-[100px] rounded-lg overflow-hidden border border-border bg-muted">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-200"
                      />
                    </div>
                    <p className="text-[10px] text-foreground mt-1 truncate">{product.title}</p>
                    <p className="text-[10px] font-semibold text-primary">{product.currency}{product.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ShareProfileModal isOpen={shareOpen} onClose={() => setShareOpen(false)} userName={hostName} />
      <ReportModal isOpen={reportOpen} onClose={() => setReportOpen(false)} streamName={hostName} />
      <SellerProfileModal
        isOpen={sellerProfileOpen}
        onClose={() => setSellerProfileOpen(false)}
        sellerName={hostName}
        sellerImage={hostAvatar}
      />
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
        sellerName={hostName}
        sellerAvatar={hostAvatar}
      />
    </>
  );
};

export default ShopLiveVideo;
