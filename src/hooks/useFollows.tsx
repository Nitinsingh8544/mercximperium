import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useFollows = () => {
  const { user } = useAuth();
  const [followedSellers, setFollowedSellers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFollows = useCallback(async () => {
    if (!user) {
      setFollowedSellers([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("follows")
        .select("seller_name")
        .eq("user_id", user.id);

      if (error) throw error;
      setFollowedSellers(data?.map((f: any) => f.seller_name) || []);
    } catch (error) {
      console.error("Error fetching follows:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFollows();
  }, [fetchFollows]);

  const isFollowing = useCallback(
    (sellerName: string) => followedSellers.includes(sellerName),
    [followedSellers]
  );

  const toggleFollow = async (sellerName: string) => {
    if (!user) return;

    const alreadyFollowing = isFollowing(sellerName);

    if (alreadyFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("user_id", user.id)
        .eq("seller_name", sellerName);

      if (!error) {
        setFollowedSellers((prev) => prev.filter((s) => s !== sellerName));
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert({ user_id: user.id, seller_name: sellerName });

      if (!error) {
        setFollowedSellers((prev) => [...prev, sellerName]);
      }
    }
  };

  return { followedSellers, loading, isFollowing, toggleFollow, refetch: fetchFollows };
};
