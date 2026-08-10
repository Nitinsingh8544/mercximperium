import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { useFollows } from "@/hooks/useFollows";
import { streamsWithMeta, exploreStreams, recommendedPool, StreamMeta } from "@/lib/streamRanking";
import { useMemo, useState } from "react";
import { Search, Filter, X, SlidersHorizontal, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const allAvailableStreams: StreamMeta[] = [
  ...streamsWithMeta,
  ...recommendedPool,
  ...exploreStreams,
];

const uniqueStreams = allAvailableStreams.filter(
  (s, i, arr) => arr.findIndex((x) => x.id === s.id) === i
);

const ShopLiveLanding = () => {
  const navigate = useNavigate();
  const { follows } = useFollows();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProductType, setSelectedProductType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("viewers");
  const [showFilters, setShowFilters] = useState(false);

  const followedSellerNames = useMemo(
    () => new Set(follows.map((f) => f.seller_name.toLowerCase())),
    [follows]
  );

  const categories = useMemo(() => {
    return [...new Set(uniqueStreams.map((s) => s.category))].sort();
  }, []);

  const productTypes = useMemo(() => {
    return [...new Set(uniqueStreams.map((s) => s.productType))].sort();
  }, []);

  const { followedStreams, otherStreams } = useMemo(() => {
    let filtered = uniqueStreams.filter((s) => {
      const matchesSearch =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
      const matchesType = selectedProductType === "all" || s.productType === selectedProductType;
      return matchesSearch && matchesCategory && matchesType;
    });

    if (sortBy === "viewers") {
      filtered.sort((a, b) => b.viewers - a.viewers);
    } else if (sortBy === "az") {
      filtered.sort((a, b) => a.host.localeCompare(b.host));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    }

    const followed = filtered.filter((s) => followedSellerNames.has(s.host.toLowerCase()));
    const other = filtered.filter((s) => !followedSellerNames.has(s.host.toLowerCase()));
    return { followedStreams: followed, otherStreams: other };
  }, [searchQuery, selectedCategory, selectedProductType, sortBy, followedSellerNames]);

  const activeFilterCount = [
    selectedCategory !== "all",
    selectedProductType !== "all",
    searchQuery.length > 0,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedProductType("all");
    setSortBy("viewers");
  };

  const handleSellerClick = (e: React.MouseEvent, host: string) => {
    e.stopPropagation();
    navigate(`/seller/${encodeURIComponent(host)}`);
  };

  const StreamCard = ({ stream }: { stream: StreamMeta }) => (
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

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-[100px] sm:pt-24 md:pt-24 pb-24 sm:pb-8 relative z-10">
        {/* Search & Filter Bar */}
        <div className="mb-3 space-y-2">

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              aria-label="Back"
              className="h-9 w-9 shrink-0 text-foreground hover:bg-muted"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search streams by name, seller, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1.5 shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="flex flex-wrap items-center gap-2 p-3 bg-card rounded-lg border border-border">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[150px] sm:w-[180px] h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedProductType} onValueChange={setSelectedProductType}>
                <SelectTrigger className="w-[150px] sm:w-[180px] h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="Item Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Items</SelectItem>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px] sm:w-[160px] h-9 text-xs sm:text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewers">Most Viewers</SelectItem>
                  <SelectItem value="az">A–Z</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-9 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Followed Sellers' Streams */}
        {followedStreams.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
              From Sellers You Follow
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {followedStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </div>
        )}

        {/* All Live Streams */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-foreground mb-2">
            {followedStreams.length > 0 ? "Discover More" : "Live Now"}
          </h2>
          {otherStreams.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {otherStreams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Filter className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No streams match your filters.</p>
              <Button variant="link" size="sm" onClick={clearFilters} className="mt-1">
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopLiveLanding;
