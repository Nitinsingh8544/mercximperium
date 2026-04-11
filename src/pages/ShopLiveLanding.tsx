import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { useProfile } from "@/hooks/useProfile";
import { useFollows } from "@/hooks/useFollows";
import { streamsWithMeta } from "@/lib/streamRanking";
import { useMemo } from "react";

const ShopLiveLanding = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { follows } = useFollows();

  const followedSellerNames = useMemo(
    () => new Set(follows.map((f) => f.seller_name.toLowerCase())),
    [follows]
  );

  // Separate followed and other streams
  const { followedStreams, otherStreams } = useMemo(() => {
    const followed = streamsWithMeta.filter((s) =>
      followedSellerNames.has(s.host.toLowerCase())
    );
    const other = streamsWithMeta.filter(
      (s) => !followedSellerNames.has(s.host.toLowerCase())
    );
    // Shuffle other streams for randomness
    const shuffled = [...other].sort(() => Math.random() - 0.5);
    return { followedStreams: followed, otherStreams: shuffled };
  }, [followedSellerNames]);

  const handleSellerClick = (e: React.MouseEvent, host: string) => {
    e.stopPropagation();
    navigate(`/seller/${encodeURIComponent(host)}`);
  };

  const StreamCard = ({ stream }: { stream: (typeof streamsWithMeta)[0] }) => (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => navigate(`/shop-live/${stream.id}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={stream.image}
          alt={stream.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <Badge className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 md:top-3 md:left-3 bg-red-600 hover:bg-red-600 text-white border-0 text-[10px] sm:text-xs px-1.5 sm:px-2">
          Live · {stream.viewers}
        </Badge>
      </div>
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
          <button
            onClick={(e) => handleSellerClick(e, stream.host)}
            className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0 hover:bg-primary/30 hover:ring-2 hover:ring-secondary transition-all"
          >
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold text-primary">
              {stream.host.charAt(0).toUpperCase()}
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={(e) => handleSellerClick(e, stream.host)}
              className="font-medium text-[11px] sm:text-xs md:text-sm text-foreground truncate block hover:text-secondary transition-colors text-left w-full"
            >
              {stream.host}
            </button>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground line-clamp-1 sm:line-clamp-2 mt-0.5 sm:mt-1">
              {stream.title}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />

      <AuthenticatedHeader />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-36 sm:pt-32 md:pt-24 pb-6 sm:pb-8 relative z-10">
        {/* Horizontal Navigation for Mobile */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-4 lg:hidden scrollbar-hide -mx-3 px-3">
          <Link
            to="/dashboard"
            className="shrink-0 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium whitespace-nowrap hover:bg-muted/80"
          >
            Auction
          </Link>
          <Link
            to="/shop-live"
            className="shrink-0 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap"
          >
            Shop Live
          </Link>
          <Link
            to="/followed"
            className="shrink-0 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium whitespace-nowrap hover:bg-muted/80"
          >
            Followed Host
          </Link>
          <Link
            to="/browse"
            className="shrink-0 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium whitespace-nowrap hover:bg-muted/80"
          >
            Browse Categories
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block lg:w-56 xl:w-64 shrink-0">
            <div className="space-y-2 sticky top-24">
              <Link
                to="/dashboard"
                className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Auction
              </Link>
              <Link
                to="/shop-live"
                className="block px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm"
              >
                Shop Live
              </Link>
              <Link
                to="/followed"
                className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Followed Host
              </Link>
              <Link
                to="/browse"
                className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                Browse Categories
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Followed Sellers' Streams */}
            {followedStreams.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                  From Sellers You Follow
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                  {followedStreams.map((stream) => (
                    <StreamCard key={stream.id} stream={stream} />
                  ))}
                </div>
              </div>
            )}

            {/* All Live Streams */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                {followedStreams.length > 0 ? "Discover More" : "Live Now"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                {otherStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopLiveLanding;
