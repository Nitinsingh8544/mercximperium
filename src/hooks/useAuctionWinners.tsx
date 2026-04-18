import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface AuctionWinner {
  id: string;
  streamId: number;
  itemName: string;
  itemImage: string;
  winnerName: string;
  finalPrice: number; // in INR
  totalBids: number;
  wonAt: number;
}

interface AuctionWinnersContextValue {
  winners: AuctionWinner[];
  addWinner: (w: Omit<AuctionWinner, "id" | "wonAt">) => void;
  getWinnersForStream: (streamId: number) => AuctionWinner[];
}

const AuctionWinnersContext = createContext<AuctionWinnersContextValue | undefined>(undefined);

export const AuctionWinnersProvider = ({ children }: { children: ReactNode }) => {
  const [winners, setWinners] = useState<AuctionWinner[]>([]);

  const addWinner = useCallback((w: Omit<AuctionWinner, "id" | "wonAt">) => {
    setWinners(prev => [
      { ...w, id: `${Date.now()}-${Math.random()}`, wonAt: Date.now() },
      ...prev,
    ]);
  }, []);

  const getWinnersForStream = useCallback(
    (streamId: number) => winners.filter(w => w.streamId === streamId),
    [winners]
  );

  return (
    <AuctionWinnersContext.Provider value={{ winners, addWinner, getWinnersForStream }}>
      {children}
    </AuctionWinnersContext.Provider>
  );
};

export const useAuctionWinners = () => {
  const ctx = useContext(AuctionWinnersContext);
  if (!ctx) throw new Error("useAuctionWinners must be used within AuctionWinnersProvider");
  return ctx;
};
