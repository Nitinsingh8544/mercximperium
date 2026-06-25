import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface AuctionBid {
  id: string;
  user_id: string;
  stream_id: number;
  item_name: string;
  item_image: string | null;
  item_description: string | null;
  bid_amount: number;
  is_winning: boolean;
  seller_name: string | null;
  seller_image: string | null;
  created_at: string;
}

export const useAuctionBids = () => {
  const { user } = useAuth();
  const [bids, setBids] = useState<AuctionBid[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBids = useCallback(async () => {
    if (!user) {
      setBids([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("auction_bids")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBids((data as AuctionBid[]) || []);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  const placeBid = async (bid: {
    stream_id: number;
    item_name: string;
    item_image?: string;
    item_description?: string;
    bid_amount: number;
    seller_name?: string;
    seller_image?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase.functions.invoke("auction-operations", {
        body: {
          action: "track_stream_bid",
          stream_id: bid.stream_id,
          item_name: bid.item_name,
          item_image: bid.item_image,
          item_description: bid.item_description,
          bid_amount: bid.bid_amount,
          seller_name: bid.seller_name,
          seller_image: bid.seller_image,
        },
      });

      if (error) throw error;
      if (data?.bid) setBids((prev) => [data.bid as AuctionBid, ...prev]);
      return { error: null, data: data?.bid };
    } catch (error) {
      console.error("Error placing bid:", error);
      return { error };
    }
  };

  const wonBids = bids.filter((b) => b.is_winning);

  return { bids, wonBids, loading, placeBid, refetch: fetchBids };
};
