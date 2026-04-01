import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface FollowEntry {
  seller_name: string;
  follow_source: string;
}

export const useFollows = () => {
  const { user } = useAuth();
  const [follows, setFollows] = useState<FollowEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollows = useCallback(async () => {
    if (!user) {
      setFollows([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("follows")
        .select("seller_name, follow_source")
        .eq("user_id", user.id);

      if (error) throw error;
      setFollows(data?.map((f: any) => ({ seller_name: f.seller_name, follow_source: f.follow_source })) || []);
    } catch (error) {
      console.error("Error fetching follows:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollows();
  }, [fetchFollows]);

  const followedSellers = follows.map((f) => f.seller_name);
  const auctionFollows = follows.filter((f) => f.follow_source === "auction").map((f) => f.seller_name);
  const shopLiveFollows = follows.filter((f) => f.follow_source === "shop_live").map((f) => f.seller_name);

  const isFollowing = useCallback(
    (sellerName: string) => followedSellers.includes(sellerName),
    [followedSellers]
  );

  const toggleFollow = async (sellerName: string, source: string = "auction") => {
    if (!user) return;

    const alreadyFollowing = isFollowing(sellerName);

    if (alreadyFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("user_id", user.id)
        .eq("seller_name", sellerName);

      if (!error) {
        setFollows((prev) => prev.filter((f) => f.seller_name !== sellerName));
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({ user_id: user.id, seller_name: sellerName, follow_source: source });

      if (!error) {
        setFollows((prev) => [...prev, { seller_name: sellerName, follow_source: source }]);
      }
    }
  };

  return { follows, followedSellers, auctionFollows, shopLiveFollows, loading, isFollowing, toggleFollow, refetch: fetchFollows };
};
