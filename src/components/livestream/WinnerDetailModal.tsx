import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Gavel, Calendar, Tag } from "lucide-react";
import type { AuctionWinner } from "@/hooks/useAuctionWinners";

interface WinnerDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  winner: AuctionWinner | null;
}

const WinnerDetailModal = ({ open, onOpenChange, winner }: WinnerDetailModalProps) => {
  if (!winner) return null;

  const wonAt = new Date(winner.wonAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="relative bg-gradient-to-br from-secondary/20 via-primary/10 to-secondary/20 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-5 w-5 text-secondary" />
            <DialogHeader className="p-0">
              <DialogTitle className="text-base">Auction Won</DialogTitle>
            </DialogHeader>
          </div>

          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <img
              src={winner.itemImage}
              alt={winner.itemName}
              className="w-full h-56 object-cover"
            />
          </div>
        </div>

        <div className="p-5 pt-2 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-foreground">{winner.itemName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Stream #{winner.streamId}</p>
          </div>

          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
            <Avatar className="h-12 w-12 border-2 border-secondary">
              <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                {winner.winnerName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Winner</p>
              <p className="font-semibold text-foreground truncate">{winner.winnerName}</p>
            </div>
            <Badge className="bg-secondary text-secondary-foreground">Winner</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Tag className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wide">Final Price</span>
              </div>
              <p className="text-lg font-bold text-secondary">
                ₹{winner.finalPrice.toLocaleString("en-IN")}
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg border border-border">
              <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Gavel className="h-3 w-3" />
                <span className="text-[10px] uppercase tracking-wide">Total Bids</span>
              </div>
              <p className="text-lg font-bold text-foreground">{winner.totalBids}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              Won on {wonAt.toLocaleDateString()} ·{" "}
              {wonAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WinnerDetailModal;
