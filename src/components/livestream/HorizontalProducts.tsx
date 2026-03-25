import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Share2 } from "lucide-react";
import { useFollows } from "@/hooks/useFollows";
import ShareProfileModal from "@/components/seller/ShareProfileModal";

interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
}

interface HorizontalProductsProps {
  hostName?: string;
  hostAvatar?: string;
  streamTitle?: string;
  streamDate?: string;
  products?: Product[];
}

const HorizontalProducts = ({
  hostName = "Fashion Expert",
  hostAvatar,
  streamTitle = "From Chill to Sharp: Everyday Fashion Edit",
  streamDate = "Streamed live 2 days ago",
}: HorizontalProductsProps) => {
  const { isFollowing, toggleFollow } = useFollows();
  const [shareOpen, setShareOpen] = useState(false);

  const following = isFollowing(hostName);

  return (
    <>
      <div className="bg-card rounded-b-xl border-x border-b border-border p-4">
        {/* Title */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-bold text-foreground text-base">{streamTitle}</h3>
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => setShareOpen(true)}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Stream Date */}
        <p className="text-xs text-muted-foreground mb-3">{streamDate}</p>

        {/* Channel Name + Sponsored Badge + Follow */}
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={hostAvatar} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs">
              {hostName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="font-semibold text-foreground text-sm">{hostName}</span>
          <Badge variant="outline" className="text-xs px-2 py-0.5 border-amber-500 text-amber-600 bg-amber-50">Sponsored</Badge>
          <span className="text-xs text-muted-foreground">Earns commissions</span>
          <Button
            variant="outline"
            size="sm"
            className={`ml-auto h-7 text-xs ${following ? "bg-muted text-muted-foreground" : ""}`}
            onClick={() => toggleFollow(hostName, "shop_live")}
          >
            {following ? "Following" : "+ Follow"}
          </Button>
        </div>
      </div>

      <ShareProfileModal isOpen={shareOpen} onClose={() => setShareOpen(false)} userName={hostName} />
    </>
  );
};

export default HorizontalProducts;
