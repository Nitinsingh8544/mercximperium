import { useState } from "react";
import { Trophy } from "lucide-react";
import { useAuctionWinners, type AuctionWinner } from "@/hooks/useAuctionWinners";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import WinnerDetailModal from "./WinnerDetailModal";

interface AuctionWinnersPanelProps {
  streamId: number;
}

const AuctionWinnersPanel = ({ streamId }: AuctionWinnersPanelProps) => {
  const { getWinnersForStream } = useAuctionWinners();
  const winners = getWinnersForStream(streamId);
  const [selected, setSelected] = useState<AuctionWinner | null>(null);

  return (
    <div className="bg-card rounded-xl border border-border p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="h-4 w-4 text-secondary" />
        <h2 className="font-bold text-foreground text-sm">Auction Winners</h2>
      </div>

      {winners.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-6">
          No winners yet. Winners will appear here as auctions end.
        </p>
      ) : (
        <ScrollArea className="max-h-[260px]">
          <div className="space-y-2 pr-2">
            {winners.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelected(w)}
                className="w-full flex gap-2 p-2 bg-background rounded-lg border border-border text-left hover:border-secondary hover:bg-secondary/5 transition-colors"
              >
                <img
                  src={w.itemImage}
                  alt={w.itemName}
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground line-clamp-1">
                    {w.itemName}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-[8px] bg-secondary text-secondary-foreground">
                        {w.winnerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[11px] text-foreground font-medium truncate">
                      {w.winnerName}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs font-bold text-secondary">
                      ₹{w.finalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {w.totalBids} bid{w.totalBids !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}

      <WinnerDetailModal
        open={!!selected}
        onOpenChange={(o) => !o && setSelected(null)}
        winner={selected}
      />
    </div>
  );
};

export default AuctionWinnersPanel;
