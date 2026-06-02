import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import EditProfileModal from "@/components/EditProfileModal";
import { Share, Camera, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const ProfileView = () => {
  const { profile, loading } = useProfile();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userInitial = profile?.username?.charAt(0).toUpperCase() || profile?.name?.charAt(0).toUpperCase() || "U";
  const displayName = profile?.name || "Your Name";
  const username = profile?.username || "username";

  // Mock clips data
  const clips = [
    { id: 1, title: "THURSDAY RANDOM VINTAGE", views: 0, author: username },
    { id: 2, title: "THURSDAY RANDOM VINTAGE", views: 0, author: username },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-3 sm:px-4 md:px-6 pt-36 sm:pt-32 md:pt-24 pb-6 sm:pb-8 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground flex-shrink-0 overflow-hidden">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                userInitial
              )}
            </div>
            <div className="sm:hidden flex-1">
              <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
              <p className="text-xs text-muted-foreground">@{username}</p>
              <div className="flex gap-3 text-xs text-foreground mt-1">
                <span><strong>1</strong> Following</span>
                <span><strong>0</strong> Followers</span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:block flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">{displayName}</h2>
            <p className="text-sm text-muted-foreground">@{username}</p>
            {profile?.bio && (
              <p className="text-sm text-foreground mt-2">{profile.bio}</p>
            )}
            <div className="flex gap-4 text-sm text-foreground mt-2">
              <span><strong>1</strong> Following</span>
              <span className="text-muted-foreground">•</span>
              <span><strong>0</strong> Followers</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground flex-1 sm:flex-none text-sm"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </Button>
            <Button variant="ghost" size="icon" className="border border-border h-9 w-9 sm:h-10 sm:w-10">
              <Share className="w-4 h-4 sm:w-5 sm:h-5" />
            </Button>
          </div>
        </div>

        {profile?.bio && (
          <p className="text-sm text-foreground mb-4 sm:hidden">{profile.bio}</p>
        )}

        {/* Tabs */}
        <Tabs defaultValue="clips" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-4 sm:mb-6">
            <TabsTrigger 
              value="sell" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm"
            >
              Sell
            </TabsTrigger>
            <TabsTrigger 
              value="clips" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-3 sm:px-4 py-2.5 sm:py-3 text-sm"
            >
              Clips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sell" className="mt-0">
            <div className="text-center py-8 sm:py-12 text-muted-foreground">
              <p className="text-sm sm:text-base">No items for sale yet</p>
            </div>
          </TabsContent>

          <TabsContent value="clips" className="mt-0">
            <h3 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4">
              Clips by {username} ({clips.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
              {clips.map((clip) => (
                <div key={clip.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-1.5 sm:mb-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                      <Button variant="ghost" size="icon" className="w-6 h-6 sm:w-8 sm:h-8 bg-black/30 hover:bg-black/50">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </Button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-secondary/30 rounded-lg" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-medium text-foreground truncate">{clip.title}</h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {clip.views} Views · @{clip.author}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
};

export default ProfileView;
