import { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from "react";

export type QueueItemStatus = "pending" | "active" | "sold";

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
  // get items for a stream (with current statuses)
  getItemsForStream: (streamId: number) => QueueItem[];
  getActiveItem: (streamId: number) => QueueItem | undefined;
  // mark current active item sold and advance to next pending
  advanceQueue: (streamId: number) => QueueItem | undefined;
  // Initialize queue for a stream from a base list (idempotent)
  registerStream: (streamId: number, items: Omit<QueueItem, "streamId" | "status">[]) => void;
}

const AuctionQueueContext = createContext<AuctionQueueContextValue | undefined>(undefined);

export const AuctionQueueProvider = ({ children }: { children: ReactNode }) => {
  // Map streamId -> ordered items
  const [streams, setStreams] = useState<Record<number, QueueItem[]>>({});

  const registerStream = useCallback(
    (streamId: number, items: Omit<QueueItem, "streamId" | "status">[]) => {
      setStreams((prev) => {
        if (prev[streamId]) return prev; // already initialised
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

  const advanceQueue = useCallback((streamId: number): QueueItem | undefined => {
    let nextActive: QueueItem | undefined;
    setStreams((prev) => {
      const list = prev[streamId];
      if (!list) return prev;
      const activeIdx = list.findIndex((i) => i.status === "active");
      if (activeIdx === -1) return prev;
      const updated = [...list];
      updated[activeIdx] = { ...updated[activeIdx], status: "sold" };
      const nextIdx = updated.findIndex((i, idx) => idx > activeIdx && i.status === "pending");
      if (nextIdx !== -1) {
        updated[nextIdx] = { ...updated[nextIdx], status: "active" };
        nextActive = updated[nextIdx];
      }
      return { ...prev, [streamId]: updated };
    });
    return nextActive;
  }, []);

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
