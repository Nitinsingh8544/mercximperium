import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AuctionItem {
  id: string;
  stream_id: number;
  item_name: string;
  item_image: string | null;
  item_description: string | null;
  starting_price: number;
  current_price: number;
  min_increment: number;
  auction_duration_seconds: number;
  auction_started_at: string | null;
  auction_ends_at: string | null;
  status: string;
  winner_user_id: string | null;
  seller_name: string | null;
  seller_image: string | null;
  item_order: number;
  created_at: string;
}

export interface BidHistoryEntry {
  id: string;
  auction_item_id: string;
  user_id: string;
  username: string | null;
  bid_amount: number;
  created_at: string;
}

export const useAuctionItems = (streamId: number) => {
  const { user } = useAuth();
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [activeItem, setActiveItem] = useState<AuctionItem | null>(null);
  const [bidHistory, setBidHistory] = useState<BidHistoryEntry[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch all auction items for this stream
  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("auction_items")
      .select("*")
      .eq("stream_id", streamId)
      .order("item_order", { ascending: true });

    if (error) {
      console.error("Error fetching auction items:", error);
      setLoading(false);
      return;
    }

    const typedData = (data || []) as unknown as AuctionItem[];
    setItems(typedData);

    // Find currently active item or activate the first pending one
    const active = typedData.find((i) => i.status === "active");
    if (active) {
      setActiveItem(active);
      fetchBidHistory(active.id);
    } else {
      // Auto-activate first pending item
      const pending = typedData.find((i) => i.status === "pending");
      if (pending) {
        await activateItem(pending.id);
      }
    }
    setLoading(false);
  }, [streamId]);

  // Fetch bid history for an auction item
  const fetchBidHistory = useCallback(async (auctionItemId: string) => {
    const { data, error } = await supabase
      .from("bid_history")
      .select("*")
      .eq("auction_item_id", auctionItemId)
      .order("created_at", { ascending: true });

    if (!error) {
      setBidHistory((data || []) as unknown as BidHistoryEntry[]);
    }
  }, []);

  // Activate an auction item (set status to active, set timer)
  const activateItem = useCallback(async (itemId: string) => {
    const item = items.find((i) => i.id === itemId) || (await supabase
      .from("auction_items")
      .select("*")
      .eq("id", itemId)
      .single()
      .then(r => r.data as unknown as AuctionItem));

    if (!item) return;

    const now = new Date();
    const endsAt = new Date(now.getTime() + (item.auction_duration_seconds || 60) * 1000);

    await supabase
      .from("auction_items")
      .update({
        status: "active",
        auction_started_at: now.toISOString(),
        auction_ends_at: endsAt.toISOString(),
      })
      .eq("id", itemId);

    const updatedItem = { ...item, status: "active", auction_started_at: now.toISOString(), auction_ends_at: endsAt.toISOString() };
    setActiveItem(updatedItem);
    setBidHistory([]);
    fetchBidHistory(itemId);
  }, [items, fetchBidHistory]);

  // Place a bid
  const placeBid = useCallback(async (bidAmount: number) => {
    if (!user || !activeItem) return { error: new Error("Not ready") };

    if (bidAmount < activeItem.current_price + activeItem.min_increment) {
      return { error: new Error(`Minimum bid is ₹${activeItem.current_price + activeItem.min_increment}`) };
    }

    // Get username from profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("user_id", user.id)
      .single();

    const username = profile?.username || user.email?.split("@")[0] || "User";

    // Insert bid history
    const { error: bidError } = await supabase
      .from("bid_history")
      .insert({
        auction_item_id: activeItem.id,
        user_id: user.id,
        username,
        bid_amount: bidAmount,
      });

    if (bidError) return { error: bidError };

    // Update current price on the item
    await supabase
      .from("auction_items")
      .update({ current_price: bidAmount })
      .eq("id", activeItem.id);

    setActiveItem((prev) => prev ? { ...prev, current_price: bidAmount } : prev);

    return { error: null };
  }, [user, activeItem]);

  // End current auction and move to next
  const endAuction = useCallback(async () => {
    if (!activeItem) return;

    // Find the last bidder as winner
    const lastBid = bidHistory[bidHistory.length - 1];

    await supabase
      .from("auction_items")
      .update({
        status: "sold",
        winner_user_id: lastBid?.user_id || null,
      })
      .eq("id", activeItem.id);

    // If there was a winner, create an auction_bids entry for their Activity page
    if (lastBid) {
      await supabase
        .from("auction_bids")
        .insert({
          user_id: lastBid.user_id,
          stream_id: activeItem.stream_id,
          item_name: activeItem.item_name,
          item_image: activeItem.item_image,
          item_description: activeItem.item_description,
          bid_amount: activeItem.current_price,
          is_winning: true,
          seller_name: activeItem.seller_name,
          seller_image: activeItem.seller_image,
        });
    }

    // Activate next pending item
    const nextPending = items.find(
      (i) => i.status === "pending" && i.item_order > activeItem.item_order
    );
    if (nextPending) {
      await activateItem(nextPending.id);
    } else {
      setActiveItem(null);
      setTimeLeft(0);
    }

    // Refresh items
    fetchItems();
  }, [activeItem, bidHistory, items, activateItem, fetchItems]);

  // Timer countdown
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!activeItem?.auction_ends_at) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((new Date(activeItem.auction_ends_at!).getTime() - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        endAuction();
      }
    };

    updateTimer();
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeItem?.auction_ends_at, endAuction]);

  // Real-time subscription for bid_history changes
  useEffect(() => {
    if (!activeItem) return;

    const channel = supabase
      .channel(`auction-bids-${activeItem.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bid_history",
          filter: `auction_item_id=eq.${activeItem.id}`,
        },
        (payload) => {
          const newBid = payload.new as unknown as BidHistoryEntry;
          setBidHistory((prev) => [...prev, newBid]);
          setActiveItem((prev) =>
            prev ? { ...prev, current_price: newBid.bid_amount } : prev
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeItem?.id]);

  // Real-time subscription for auction_items status changes
  useEffect(() => {
    const channel = supabase
      .channel(`auction-items-${streamId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "auction_items",
          filter: `stream_id=eq.${streamId}`,
        },
        () => {
          fetchItems();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId, fetchItems]);

  // Initial fetch
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    activeItem,
    bidHistory,
    timeLeft,
    loading,
    placeBid,
    refetch: fetchItems,
  };
};

// Hook for fetching bid history for seller profile (all items by seller)
export const useSellerAuctionHistory = (sellerName: string) => {
  const [items, setItems] = useState<(AuctionItem & { bids: BidHistoryEntry[] })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: auctionItems, error } = await supabase
        .from("auction_items")
        .select("*")
        .eq("seller_name", sellerName)
        .eq("status", "sold")
        .order("created_at", { ascending: false });

      if (error || !auctionItems) {
        setLoading(false);
        return;
      }

      const typedItems = auctionItems as unknown as AuctionItem[];

      // Fetch bid history for each item
      const withBids = await Promise.all(
        typedItems.map(async (item) => {
          const { data: bids } = await supabase
            .from("bid_history")
            .select("*")
            .eq("auction_item_id", item.id)
            .order("created_at", { ascending: true });
          return { ...item, bids: (bids || []) as unknown as BidHistoryEntry[] };
        })
      );

      setItems(withBids);
      setLoading(false);
    };

    if (sellerName) fetch();
  }, [sellerName]);

  return { items, loading };
};
