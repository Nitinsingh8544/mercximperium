import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gavel, TrendingUp, Trophy, Clock } from "lucide-react";
import { useSellerAuctionHistory } from "@/hooks/useAuctionItems";

interface AuctionHistoryTabProps {
  sellerName: string;
}

const AuctionHistoryTab = ({ sellerName }: AuctionHistoryTabProps) => {
  const { items, loading } = useSellerAuctionHistory(sellerName);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-pulse text-muted-foreground text-sm">Loading auction history...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Gavel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">No auction history</p>
        <p className="text-sm text-muted-foreground mt-2">Items sold through auctions will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {items.map((item) => {
        const winningBid = item.bids[item.bids.length - 1];
        const totalBids = item.bids.length;
        const priceIncrease = item.current_price - item.starting_price;
        const increasePercent = item.starting_price > 0 ? Math.round((priceIncrease / item.starting_price) * 100) : 0;

        return (
          <div key={item.id} className="border border-border rounded-xl overflow-hidden">
            {/* Item header */}
            <div className="p-4 bg-muted/30 border-b border-border">
              <div className="flex gap-3">
                {item.item_image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border shrink-0">
                    <img src={item.item_image} alt={item.item_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">{item.item_name}</h4>
                  {item.item_description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.item_description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] border-green-500/30 text-green-600">
                      <Trophy className="h-3 w-3 mr-1" />
                      Sold for ₹{item.current_price.toLocaleString()}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{totalBids} bids</span>
                    {increasePercent > 0 && (
                      <span className="text-[10px] text-green-600 font-medium">+{increasePercent}% from start</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bid timeline */}
            <div className="p-4">
              <p className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Bid Timeline
              </p>
              <div className="relative pl-4 border-l-2 border-border space-y-3">
                {/* Starting price */}
                <div className="relative flex items-center gap-3">
                  <div className="absolute -left-[calc(1rem+5px)] w-2 h-2 rounded-full bg-muted-foreground" />
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Auction started</span>
                    <span className="text-xs font-medium text-foreground">₹{item.starting_price.toLocaleString()}</span>
                  </div>
                </div>

                {/* Each bid */}
                {item.bids.map((bid, idx) => (
                  <div key={bid.id} className="relative flex items-center gap-2">
                    <div className={`absolute -left-[calc(1rem+5px)] w-2 h-2 rounded-full ${idx === item.bids.length - 1 ? "bg-secondary ring-2 ring-secondary/30" : "bg-primary/60"}`} />
                    <Avatar className="h-5 w-5 shrink-0">
                      <AvatarFallback className="text-[8px] bg-muted">
                        {(bid.username || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-foreground font-medium truncate">{bid.username || "User"}</span>
                    <TrendingUp className="h-3 w-3 text-green-500 shrink-0" />
                    <span className="text-xs font-bold text-foreground ml-auto">₹{bid.bid_amount.toLocaleString()}</span>
                    {idx === item.bids.length - 1 && (
                      <Badge className="text-[9px] bg-secondary text-secondary-foreground ml-1">Winner</Badge>
                    )}
                  </div>
                ))}

                {item.bids.length === 0 && (
                  <div className="text-xs text-muted-foreground italic">No bid details available</div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-muted/20 border-t border-border flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground">Start:</span>
                <span className="text-[10px] font-medium text-foreground">₹{item.starting_price.toLocaleString()}</span>
                <span className="text-[10px] text-muted-foreground mx-1">→</span>
                <span className="text-[10px] text-muted-foreground">Final:</span>
                <span className="text-[10px] font-bold text-secondary">₹{item.current_price.toLocaleString()}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AuctionHistoryTab;
