import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Gavel, Radio, Users, Eye } from "lucide-react";
import {
  allAuctionStreams,
  allLiveStreams,
  getCategoryBySlug,
  browseCategories,
} from "@/lib/browseCategories";
import type { StreamMeta } from "@/lib/streamRanking";

const CategoryView = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const selectedCategories = useMemo(() => {
    const slugs = slug.split(",").map((s) => s.trim()).filter(Boolean);
    return slugs
      .map((s) => getCategoryBySlug(s))
      .filter((c): c is NonNullable<ReturnType<typeof getCategoryBySlug>> => Boolean(c));
  }, [slug]);

  const [tab, setTab] = useState<"auction" | "live">("auction");

  const matchesAny = (s: StreamMeta) =>
    selectedCategories.some((c) => c.matches(s));

  const auctionItems = useMemo(
    () => (selectedCategories.length ? allAuctionStreams.filter(matchesAny) : []),
    [selectedCategories]
  );
  const liveItems = useMemo(
    () => (selectedCategories.length ? allLiveStreams.filter(matchesAny) : []),
    [selectedCategories]
  );

  if (!selectedCategories.length) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader />
        <div className="container mx-auto pt-[100px] px-4">
          <p className="text-muted-foreground">Category not found.</p>
          <Button variant="ghost" onClick={() => navigate("/browse")} className="mt-3 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const StreamCard = ({ s, mode }: { s: StreamMeta; mode: "auction" | "live" }) => {
    const goToStream = () =>
      navigate(mode === "auction" ? `/live/${s.id}` : `/shop-live/${s.id}`);
    const goToSeller = (e: React.MouseEvent) => {
      e.stopPropagation();
      navigate(`/seller/${s.host}`);
    };
    return (
      <Card
        className="overflow-hidden hover:shadow-xl transition-all cursor-pointer group border-border"
        onClick={goToStream}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge
            className={`absolute top-2 left-2 border-0 text-[10px] sm:text-xs ${
              mode === "auction"
                ? "bg-secondary text-secondary-foreground"
                : "bg-red-600 text-white"
            }`}
          >
            {mode === "auction" ? (
              <><Gavel className="w-3 h-3 mr-1 inline" /> Auction</>
            ) : (
              <><Radio className="w-3 h-3 mr-1 inline" /> Live</>
            )}
          </Badge>
          <Badge className="absolute top-2 right-2 bg-black/60 text-white border-0 text-[10px] gap-1">
            <Eye className="w-3 h-3" /> {s.viewers}
          </Badge>
        </div>
        <CardContent className="p-3 space-y-2">
          <p className="font-semibold text-sm text-foreground line-clamp-1">{s.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {mode === "auction"
              ? `Live ${s.sellerNiche || s.category} auction. Place your bid before the timer runs out.`
              : `Shop live ${s.sellerNiche || s.category} drops with exclusive in-stream pricing.`}
          </p>
          <button
            onClick={goToSeller}
            className="flex items-center gap-2 pt-1 w-full hover:bg-muted/50 -mx-1 px-1 py-1 rounded-md transition-colors"
          >
            <Avatar className="h-6 w-6 border border-border">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary font-semibold">
                {s.host.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium text-foreground truncate">@{s.host}</span>
            <Users className="w-3 h-3 ml-auto text-muted-foreground" />
          </button>
        </CardContent>
      </Card>
    );
  };

  const headerTitle =
    selectedCategories.length === 1
      ? selectedCategories[0].name
      : `${selectedCategories.length} Categories`;
  const headerIcon =
    selectedCategories.length === 1 ? selectedCategories[0].icon : "🎯";

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-[100px] sm:pt-24 md:pt-24 pb-8 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/browse")}
          className="gap-2 mb-3 text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Button>

        <div className="flex items-center gap-3 mb-3">
          {selectedCategories.length === 1 ? (
            <img
              src={selectedCategories[0].image}
              alt={`${selectedCategories[0].name} category`}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover shadow-md"
            />
          ) : (
            <div className="text-4xl sm:text-5xl">{headerIcon}</div>
          )}
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              {headerTitle}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {auctionItems.length} auctions · {liveItems.length} live streams
            </p>
          </div>
        </div>


        <div className="flex flex-wrap gap-1.5 mb-4">
          {selectedCategories.map((c) => (
            <button
              key={c.slug}
              onClick={() => {
                if (selectedCategories.length <= 1) return;
                const next = selectedCategories
                  .filter((x) => x.slug !== c.slug)
                  .map((x) => x.slug)
                  .join(",");
                navigate(`/browse/${next}`);
              }}
              className="group inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground text-xs px-3 py-1 hover:bg-secondary/80 transition-colors"
              title={selectedCategories.length > 1 ? "Click to remove" : ""}
            >
              <img src={c.image} alt="" className="w-4 h-4 rounded-full object-cover" />
              <span className="font-medium">{c.name}</span>
              {selectedCategories.length > 1 && (
                <span className="ml-1 opacity-70 group-hover:opacity-100">✕</span>
              )}
            </button>
          ))}
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "auction" | "live")}>
          <TabsList className="bg-muted">
            <TabsTrigger value="auction" className="text-xs sm:text-sm gap-1.5">
              <Gavel className="w-3.5 h-3.5" /> Auction
            </TabsTrigger>
            <TabsTrigger value="live" className="text-xs sm:text-sm gap-1.5">
              <Radio className="w-3.5 h-3.5" /> Live Shopping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auction" className="mt-4">
            {auctionItems.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {auctionItems.map((s) => (
                  <StreamCard key={`a-${s.id}`} s={s} mode="auction" />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-12">
                No active auctions in this category right now.
              </p>
            )}
          </TabsContent>

          <TabsContent value="live" className="mt-4">
            {liveItems.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {liveItems.map((s) => (
                  <StreamCard key={`l-${s.id}`} s={s} mode="live" />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-12">
                No live shopping streams in this category right now.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CategoryView;
