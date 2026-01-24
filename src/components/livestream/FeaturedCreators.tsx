import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  id: number;
  name: string;
  avatar: string;
  isLive?: boolean;
}

const creators: Creator[] = [
  { id: 1, name: "Sponsored Live", avatar: "", isLive: true },
  { id: 2, name: "Celebrity Corner", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50", isLive: true },
  { id: 3, name: "Bhim Jain", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50", isLive: true },
  { id: 4, name: "Sonu Prajapati", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50", isLive: true },
  { id: 5, name: "Digit.in", avatar: "", isLive: true },
  { id: 6, name: "TechDot", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50", isLive: true },
  { id: 7, name: "Nadir Siddiqui", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50" },
  { id: 8, name: "The Exploring Beauty", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50" },
  { id: 9, name: "MASTER mini TECH", avatar: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=50" },
  { id: 10, name: "Tarun Goel", avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=50" },
];

const FeaturedCreators = () => {
  return (
    <div className="bg-card rounded-xl border border-border p-4 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
      <div className="mb-4">
        <h2 className="font-bold text-foreground text-lg">Following</h2>
        <p className="text-xs text-muted-foreground">Sign-in to see content from creators you follow.</p>
      </div>
      
      <div className="border-t border-border pt-4">
        <h3 className="font-semibold text-foreground text-sm mb-4">Featured Creators</h3>
        
        <div className="space-y-3">
          {creators.map((creator) => (
            <button
              key={creator.id}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <div className="relative">
                <Avatar className={`h-10 w-10 ${creator.isLive ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-background' : ''}`}>
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs">
                    {creator.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className={`text-sm font-medium truncate ${creator.isLive ? 'text-red-500' : 'text-foreground'}`}>
                {creator.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCreators;
