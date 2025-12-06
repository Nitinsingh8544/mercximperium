import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Browse = () => {
  const [activeTab, setActiveTab] = useState("recommended");
  const categories = [
    { name: "Sneakers & Streetwear", icon: "👟", viewers: "2.8K" },
    { name: "Home & Garden", icon: "🌿", viewers: "1.2K" },
    { name: "Toys & Hobbies", icon: "🎮", viewers: "8.7K" },
    { name: "Trading Card Games", icon: "🃏", viewers: "8.9K" },
    { name: "Books & Movies", icon: "📚", viewers: "126" },
    { name: "Sports Cards", icon: "⚾", viewers: "7.6K" },
    { name: "Electronics", icon: "🎧", viewers: "5K" },
    { name: "Coins & Money", icon: "🪙", viewers: "3K" },
    { name: "Estate Sales & Storage Units", icon: "📦", viewers: "2K" },
    { name: "Sports Memorabilia", icon: "🏆", viewers: "118" },
    { name: "Men's Fashion", icon: "👔", viewers: "2.6K" },
    { name: "Women's Fashion", icon: "👗", viewers: "12.6K" },
    { name: "Bags & Accessories", icon: "👜", viewers: "1.5K" },
    { name: "Beauty", icon: "💄", viewers: "3.4K" },
    { name: "Jewelry", icon: "💎", viewers: "2.1K" },
    { name: "Music", icon: "🎵", viewers: "890" },
  ];

  const parseViewers = (viewers: string): number => {
    const num = parseFloat(viewers.replace("K", ""));
    return viewers.includes("K") ? num * 1000 : num;
  };

  const filteredCategories = useMemo(() => {
    switch (activeTab) {
      case "popular":
        return [...categories].sort((a, b) => parseViewers(b.viewers) - parseViewers(a.viewers));
      case "az":
        return [...categories].sort((a, b) => a.name.localeCompare(b.name));
      default:
        return categories;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6">
          Browse by Category
        </h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-muted">
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="az">A-Z</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredCategories.map((category) => (
            <Card 
              key={category.name} 
              className="hover:shadow-lg transition-all cursor-pointer group hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2 text-foreground">
                  {category.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  <span className="w-2 h-2 bg-red-600 rounded-full inline-block mr-1"></span>
                  {category.viewers} Viewers
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Browse;
