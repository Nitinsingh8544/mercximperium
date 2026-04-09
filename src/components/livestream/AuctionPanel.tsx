import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Gavel, Timer, TrendingUp, Trophy, AlertCircle } from "lucide-react";
import { useAuctionItems } from "@/hooks/useAuctionItems";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface AuctionPanelProps {
  streamId: number;
  sellerName?: string;
}

const AuctionPanel = ({ streamId, sellerName }: AuctionPanelProps) => {
  const { user } = useAuth();
  const { activeItem, bidHistory, timeLeft, loading, placeBid, items } = useAuctionItems(streamId);
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlaceBid = async () => {
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({ title: "Invalid amount", description: "Please enter a valid bid amount", variant: "destructive" });
      return;
    }

    setBidding(true);
    const { error } = await placeBid(amount);
    setBidding(false);

    if (error) {
      toast({ title: "Bid failed", description: (error as Error).message, variant: "destructive" });
    } else {
      toast({ title: "Bid placed!", description: `Your bid of ₹${amount.toLocaleString()} has been placed` });
      setBidAmount("");
    }
  };

  const minBid = activeItem ? activeItem.current_price + activeItem.min_increment : 0;
  const soldItems = items.filter((i) => i.status === "sold");
  const pendingItems = items.filter((i) => i.status === "pending");

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-card rounded-xl border border-border">
        <div className="animate-pulse text-muted-foreground text-sm">Loading auction...</div>
      </div>
    );
  }

  if (!activeItem && pendingItems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-card rounded-xl border border-border p-6 text-center">
        <Gavel className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">No Active Auction</p>
        <p className="text-xs text-muted-foreground mt-1">
          {soldItems.length > 0 ? `${soldItems.length} item(s) have been sold` : "Auction items will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-card rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-muted/50 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-secondary" />
            <span className="font-semibold text-foreground text-sm">Live Auction</span>
          </div>
          <Badge variant="outline" className="text-[10px] border-border">
            {soldItems.length}/{items.length} sold
          </Badge>
        </div>
      </div>

      {activeItem ? (
        <>
          {/* Active item display */}
          <div className="p-4 border-b border-border">
            <div className="flex gap-3">
              {activeItem.item_image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0">
                  <img src={activeItem.item_image} alt={activeItem.item_name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground text-sm truncate">{activeItem.item_name}</h4>
                {activeItem.item_description && (
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{activeItem.item_description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-muted-foreground">Started at:</span>
                  <span className="text-xs font-medium text-muted-foreground">₹{activeItem.starting_price.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Timer & Current Price */}
            <div className="mt-3 flex items-center gap-3">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${timeLeft <= 10 ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"}`}>
                <Timer className="h-3.5 w-3.5" />
                <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex-1 text-right">
                <p className="text-[10px] text-muted-foreground">Current Bid</p>
                <p className="text-lg font-bold text-primary">₹{activeItem.current_price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Bid History Feed */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-3 space-y-2">
              {/* Starting price entry */}
              <div className="flex items-center gap-2 text-[11px]">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                <span className="text-muted-foreground">Auction started at</span>
                <span className="font-medium text-foreground ml-auto">₹{activeItem.starting_price.toLocaleString()}</span>
              </div>

              {bidHistory.map((bid, idx) => (
                <div key={bid.id} className="flex items-center gap-2 text-[11px]">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${idx === bidHistory.length - 1 ? "bg-secondary" : "bg-primary/50"}`} />
                  <Avatar className="h-5 w-5">
                    <AvatarFallback className="text-[8px] bg-muted">{(bid.username || "U").charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-foreground font-medium truncate">{bid.username || "User"}</span>
                  <TrendingUp className="h-3 w-3 text-green-500 shrink-0" />
                  <span className="font-bold text-foreground ml-auto">₹{bid.bid_amount.toLocaleString()}</span>
                </div>
              ))}

              {bidHistory.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">No bids yet. Be the first!</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Bid input */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="flex items-center gap-1 mb-2">
              <AlertCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Min bid: ₹{minBid.toLocaleString()}</span>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`₹${minBid.toLocaleString()}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="h-9 text-sm"
                min={minBid}
              />
              <Button
                size="sm"
                className="h-9 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                onClick={handlePlaceBid}
                disabled={bidding || !user || timeLeft <= 0}
              >
                <Gavel className="h-3.5 w-3.5 mr-1" />
                Bid
              </Button>
            </div>
            {/* Quick bid buttons */}
            <div className="flex gap-1.5 mt-2">
              {[minBid, minBid + 50, minBid + 100, minBid + 500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  className="h-7 text-[10px] flex-1"
                  onClick={() => setBidAmount(amount.toString())}
                  disabled={timeLeft <= 0}
                >
                  ₹{amount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Trophy className="h-10 w-10 text-secondary mb-3" />
          <p className="text-foreground font-semibold">All items sold!</p>
          <p className="text-xs text-muted-foreground mt-1">{soldItems.length} items auctioned</p>
        </div>
      )}

      {/* Upcoming items indicator */}
      {pendingItems.length > 0 && (
        <div className="px-3 py-2 border-t border-border bg-muted/20">
          <p className="text-[10px] text-muted-foreground">
            {pendingItems.length} more item{pendingItems.length > 1 ? "s" : ""} coming up
          </p>
        </div>
      )}
    </div>
  );
};

export default AuctionPanel;
