import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { useFollows } from "@/hooks/useFollows";
import { useProfile } from "@/hooks/useProfile";
import { Users, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FollowedHost = () => {
  const { profile } = useProfile();
  const { follows, loading, toggleFollow } = useFollows();
  const { toast } = useToast();

  const fullName = profile?.name || profile?.username || "there";
  const firstName = fullName.split(" ")[0];

  const handleUnfollow = async (sellerName: string, source: string) => {
    await toggleFollow(sellerName, source);
    toast({ title: "Unfollowed", description: `You unfollowed ${sellerName}.` });
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />

      <AuthenticatedHeader />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-36 sm:pt-32 md:pt-24 pb-6 sm:pb-8 relative z-10">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-1 sm:mb-2">
            Hi {firstName}!
          </h1>
        </div>

        {/* Mobile Nav */}
        <div className="flex overflow-x-auto gap-2 pb-3 mb-4 lg:hidden scrollbar-hide -mx-3 px-3">
          <Link to="/dashboard" className="shrink-0 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium whitespace-nowrap hover:bg-muted/80">
            Auction
          </Link>
          <Link to="/shop-live" className="shrink-0 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium whitespace-nowrap hover:bg-muted/80">
            Shop Live
          </Link>
          <Link to="/followed" className="shrink-0 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium whitespace-nowrap">
            Followed Host
          </Link>
          <Link to="/browse" className="shrink-0 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium whitespace-nowrap hover:bg-muted/80">
            Browse Categories
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block lg:w-56 xl:w-64 shrink-0">
            <div className="space-y-2 sticky top-24">
              <Link to="/dashboard" className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm">
                Auction
              </Link>
              <Link to="/shop-live" className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm">
                Shop Live
              </Link>
              <Link to="/followed" className="block px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm">
                Followed Host
              </Link>
              <Link to="/browse" className="block px-4 py-2.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors text-sm">
                Browse Categories
              </Link>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4">
              Following ({follows.length})
            </h2>

            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : follows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No followed hosts yet</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Follow sellers from Auction or Shop Live sections and they will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {follows.map((follow, idx) => (
                  <Card key={idx} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <CardContent className="p-4 flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                          {follow.seller_name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{follow.seller_name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          From {follow.follow_source === "shop_live" ? "Shop Live" : "Auction"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleUnfollow(follow.seller_name, follow.follow_source)}
                        title="Unfollow"
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowedHost;
