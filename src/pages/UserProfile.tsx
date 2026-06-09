import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageCircle, Share2, UserPlus, UserCheck } from "lucide-react";
import { useFollows } from "@/hooks/useFollows";
import { toast } from "@/hooks/use-toast";
import BlockReportMenu from "@/components/seller/BlockReportMenu";

interface PublicProfile {
  user_id: string;
  username: string | null;
  name: string | null;
  avatar_url: string | null;
  bio: string | null;
}

const UserProfile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollows();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("user_id, username, name, avatar_url, bio")
        .eq("username", username)
        .maybeSingle();
      setProfile(data as PublicProfile | null);
      if (data) {
        const { count } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("seller_name", (data as PublicProfile).username || "");
        setFollowers(count || 0);
      }
      setLoading(false);
    };
    load();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <AuthenticatedHeader />
        <div className="container mx-auto pt-32 text-center">
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-muted-foreground mb-4">
            No user with username "@{username}"
          </p>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    );
  }

  const isSelf = user?.id === profile.user_id;
  const handle = profile.username || "user";
  const following = isFollowing(handle);
  const initial = (profile.username || profile.name || "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <AuthenticatedHeader />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-24 sm:pt-28 pb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
              {initial}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
              {profile.name || handle}
            </h1>
            <p className="text-sm text-muted-foreground">@{handle}</p>
            {profile.bio && (
              <p className="text-sm text-foreground mt-2">{profile.bio}</p>
            )}
            <div className="flex gap-4 text-sm text-foreground mt-3">
              <span>
                <strong>0</strong>{" "}
                <span className="text-muted-foreground">Posts</span>
              </span>
              <span>
                <strong>{followers}</strong>{" "}
                <span className="text-muted-foreground">Followers</span>
              </span>
              <span>
                <strong>0</strong>{" "}
                <span className="text-muted-foreground">Following</span>
              </span>
            </div>
          </div>

          {!isSelf && (
            <div className="flex items-center gap-2">
              <Button
                variant={following ? "outline" : "default"}
                onClick={async () => {
                  await toggleFollow(handle, "auction");
                  toast({
                    title: following ? "Unfollowed" : "Following",
                    description: `@${handle}`,
                  });
                }}
              >
                {following ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-1.5" /> Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-1.5" /> Follow
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/messages?user=${profile.user_id}`)}
              >
                <MessageCircle className="w-4 h-4 mr-1.5" /> Message
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/u/${handle}`
                  );
                  toast({ title: "Link copied" });
                }}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-4">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="purchases"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm"
            >
              Purchases
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts">
            <div className="text-center py-12 text-muted-foreground text-sm">
              No posts yet
            </div>
          </TabsContent>
          <TabsContent value="purchases">
            <div className="text-center py-12 text-muted-foreground text-sm">
              Purchases are private to each user.
            </div>
          </TabsContent>
          <TabsContent value="reviews">
            <div className="text-center py-12 text-muted-foreground text-sm">
              No reviews yet
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserProfile;
