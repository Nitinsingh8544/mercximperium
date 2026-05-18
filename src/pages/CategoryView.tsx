import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Gavel, Radio } from "lucide-react";
import {
  allAuctionStreams,
  allLiveStreams,
  getCategoryBySlug,
} from "@/lib/browseCategories";
import type { StreamMeta } from "@/lib/streamRanking";

const CategoryView = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const category = getCategoryBySlug(slug);
  const [tab, setTab] = useState<"auction" | "live">("auction");

  const auctionItems = useMemo(
    () => (category ? allAuctionStreams.filter(category.matches) : []),
    [category]
  );
  const liveItems = useMemo(
    () => (category ? allLiveStreams.filter(category.matches) : []),
    [category]
  );

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader />
        <div className="container mx-auto pt-36 px-4">
          <p className="text-muted-foreground">Category not found.</p>
          <Button variant="ghost" onClick={() => navigate("/browse")} className="mt-3 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </Button>
        </div>
      </div>
    );
  }

  const StreamCard = ({ s, mode }: { s: StreamMeta; mode: "auction" | "live" }) => (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={() => navigate(`/shop-live/${s.id}`)}
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
            <><Gavel className="w-3 h-3 mr-1 inline" /> Auction · {s.viewers}</>
          ) : (
            <>Live · {s.viewers}</>
          )}
        </Badge>
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-xs sm:text-sm text-foreground line-clamp-1">{s.host}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.title}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-36 sm:pt-32 md:pt-24 pb-8 relative z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/browse")}
          className="gap-2 mb-3 text-foreground hover:bg-muted"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Browse
        </Button>

        <div className="flex items-center gap-3 mb-5">
          <div className="text-4xl sm:text-5xl">{category.icon}</div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {auctionItems.length} auctions · {liveItems.length} live streams
            </p>
          </div>
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
                  <StreamCard key={s.id} s={s} mode="auction" />
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
                  <StreamCard key={s.id} s={s} mode="live" />
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
