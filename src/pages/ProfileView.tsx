import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthenticatedHeader from "@/components/AuthenticatedHeader";
import EditProfileModal from "@/components/EditProfileModal";
import { Share, Camera } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ProfileView = () => {
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userInitial = user?.email?.charAt(0).toUpperCase() || "U";
  const userName = user?.email?.split("@")[0] || "Your Name";
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  // Mock clips data
  const clips = [
    { id: 1, title: "THURSDAY RANDOM VINTAGE", views: 0, author: userName },
    { id: 2, title: "THURSDAY RANDOM VINTAGE", views: 0, author: userName },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Themed background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/10 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/20 via-transparent to-transparent" />
      
      <AuthenticatedHeader />
      
      <div className="container mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-8 relative z-10">
        {/* Profile Header */}
        <div className="flex items-start gap-4 sm:gap-6 mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-2xl sm:text-3xl font-bold text-primary-foreground flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">{userName}</h2>
            <p className="text-sm text-muted-foreground">{displayName}</p>
            <div className="flex gap-4 text-sm text-foreground mt-2">
              <span><strong>1</strong> Following</span>
              <span className="text-muted-foreground">•</span>
              <span><strong>0</strong> Followers</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </Button>
            <Button variant="ghost" size="icon" className="border border-border">
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clips" className="w-full">
          <TabsList className="bg-transparent border-b border-border rounded-none w-full justify-start h-auto p-0 mb-6">
            <TabsTrigger 
              value="sell" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              Sell
            </TabsTrigger>
            <TabsTrigger 
              value="clips" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-3"
            >
              Clips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sell" className="mt-0">
            <div className="text-center py-12 text-muted-foreground">
              <p>No items for sale yet</p>
            </div>
          </TabsContent>

          <TabsContent value="clips" className="mt-0">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Clips by {userName} ({clips.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {clips.map((clip) => (
                <div key={clip.id} className="group cursor-pointer">
                  <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden mb-2">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 bg-black/30 hover:bg-black/50">
                        <Camera className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 bg-secondary/30 rounded-lg" />
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-foreground truncate">{clip.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    {clip.views} Views · Clipped by @{clip.author}
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
