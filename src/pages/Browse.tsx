import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { browseCategories } from "@/lib/browseCategories";
import { Check, X, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const Browse = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recommended");
  const [selected, setSelected] = useState<string[]>([]);

  const parseViewers = (viewers: string): number => {
    const num = parseFloat(viewers.replace("K", ""));
    return viewers.includes("K") ? num * 1000 : num;
  };

  const filteredCategories = useMemo(() => {
    switch (activeTab) {
      case "popular":
        return [...browseCategories].sort((a, b) => parseViewers(b.viewers) - parseViewers(a.viewers));
      case "az":
        return [...browseCategories].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return browseCategories;
    }
  }, [activeTab]);

  const toggleSelect = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleCardClick = (slug: string) => {
    if (selected.length > 0) {
      // selection mode: toggle instead of navigating
      setSelected((prev) =>
        prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
      );
      return;
    }
    navigate(`/browse/${slug}`);
  };

  const viewSelected = () => {
    if (!selected.length) return;
    navigate(`/browse/${selected.join(",")}`);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />

      <AuthenticatedHeader />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-[100px] sm:pt-24 md:pt-24 pb-24 sm:pb-8 relative z-10">
        <div className="flex items-end justify-between gap-3 mb-4 sm:mb-6 flex-wrap">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
            Browse by Category
          </h1>
          <p className="text-xs text-muted-foreground">
            Tap to open · long-press or use ✓ to multi-select
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6 flex-wrap">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted">
              <TabsTrigger value="recommended" className="text-xs sm:text-sm">Recommended</TabsTrigger>
              <TabsTrigger value="popular" className="text-xs sm:text-sm">Popular</TabsTrigger>
              <TabsTrigger value="az" className="text-xs sm:text-sm">A-Z</TabsTrigger>
            </TabsList>
          </Tabs>

          {selected.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                {selected.length} selected
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => setSelected([])} className="gap-1">
                <X className="w-3.5 h-3.5" /> Clear
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {filteredCategories.map((category) => {
            const isSelected = selected.includes(category.slug);
            return (
              <Card
                key={category.slug}
                onClick={() => handleCardClick(category.slug)}
                className={cn(
                  "relative hover:shadow-lg transition-all cursor-pointer group hover:scale-105",
                  isSelected && "ring-2 ring-primary shadow-lg"
                )}
              >
                <button
                  onClick={(e) => toggleSelect(category.slug, e)}
                  aria-label={isSelected ? "Deselect" : "Select"}
                  className={cn(
                    "absolute top-1.5 right-1.5 z-10 h-6 w-6 rounded-full border flex items-center justify-center transition-all",
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background/80 border-border text-muted-foreground opacity-0 group-hover:opacity-100"
                  )}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                </button>
                <CardContent className="p-0 overflow-hidden rounded-xl">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={category.image}
                      alt={`${category.name} live shopping category`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                    <Badge className="absolute bottom-1.5 left-1.5 bg-secondary text-secondary-foreground text-[10px] sm:text-xs px-1.5 py-0.5">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full inline-block mr-1 animate-pulse"></span>
                      {category.viewers}
                    </Badge>
                  </div>
                  <div className="p-2 sm:p-3 text-center">
                    <h3 className="font-semibold text-xs sm:text-sm text-foreground line-clamp-2">
                      {category.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={viewSelected}
            size="lg"
            className="shadow-2xl gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Eye className="w-4 h-4" />
            View {selected.length} {selected.length === 1 ? "category" : "categories"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Browse;
