import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

export type QueueItemStatus = "pending" | "active" | "sold" | "unsold";

export interface QueueItem {
  id: number;
  streamId: number;
  order: number;
  image: string;
  title: string;
  description?: string;
  startingPrice: number; // in INR
  status: QueueItemStatus;
}

interface AuctionQueueContextValue {
  getItemsForStream: (streamId: number) => QueueItem[];
  getActiveItem: (streamId: number) => QueueItem | undefined;
  /**
   * Mark current active item as sold (had bids) or unsold (no bids during auction),
   * then activate the next pending item in the queue.
   */
  advanceQueue: (streamId: number, outcome: "sold" | "unsold") => QueueItem | undefined;
  registerStream: (streamId: number, items: Omit<QueueItem, "streamId" | "status">[]) => void;
}

const AuctionQueueContext = createContext<AuctionQueueContextValue | undefined>(undefined);

export const AuctionQueueProvider = ({ children }: { children: ReactNode }) => {
  const [streams, setStreams] = useState<Record<number, QueueItem[]>>({});

  const registerStream = useCallback(
    (streamId: number, items: Omit<QueueItem, "streamId" | "status">[]) => {
      setStreams((prev) => {
        if (prev[streamId]) return prev;
        const sorted = [...items].sort((a, b) => a.order - b.order);
        const queue: QueueItem[] = sorted.map((it, idx) => ({
          ...it,
          streamId,
          status: idx === 0 ? "active" : "pending",
        }));
        return { ...prev, [streamId]: queue };
      });
    },
    []
  );

  const getItemsForStream = useCallback(
    (streamId: number) => streams[streamId] || [],
    [streams]
  );

  const getActiveItem = useCallback(
    (streamId: number) => (streams[streamId] || []).find((i) => i.status === "active"),
    [streams]
  );

  const advanceQueue = useCallback(
    (streamId: number, outcome: "sold" | "unsold"): QueueItem | undefined => {
      let nextActive: QueueItem | undefined;
      setStreams((prev) => {
        const list = prev[streamId];
        if (!list) return prev;
        const activeIdx = list.findIndex((i) => i.status === "active");
        if (activeIdx === -1) return prev;
        const updated = [...list];
        updated[activeIdx] = { ...updated[activeIdx], status: outcome };
        const nextIdx = updated.findIndex((i, idx) => idx > activeIdx && i.status === "pending");
        if (nextIdx !== -1) {
          updated[nextIdx] = { ...updated[nextIdx], status: "active" };
          nextActive = updated[nextIdx];
        }
        return { ...prev, [streamId]: updated };
      });
      return nextActive;
    },
    []
  );

  const value = useMemo(
    () => ({ getItemsForStream, getActiveItem, advanceQueue, registerStream }),
    [getItemsForStream, getActiveItem, advanceQueue, registerStream]
  );

  return <AuctionQueueContext.Provider value={value}>{children}</AuctionQueueContext.Provider>;
};

export const useAuctionQueue = () => {
  const ctx = useContext(AuctionQueueContext);
  if (!ctx) throw new Error("useAuctionQueue must be used within AuctionQueueProvider");
  return ctx;
};
