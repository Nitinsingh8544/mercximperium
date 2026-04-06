import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export const useCredits = () => {
  const { user } = useAuth();
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setCredits(0);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCredits(data.balance);
      } else {
        // Create credits row for existing users who don't have one
        const { data: newData, error: insertError } = await supabase
          .from("user_credits")
          .insert({ user_id: user.id, balance: 1000 })
          .select("balance")
          .single();

        if (!insertError && newData) {
          setCredits(newData.balance);
        }
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const creditsToRupees = (creditAmount: number) => {
    return creditAmount / 5;
  };

  const rupeesToCredits = (rupeeAmount: number) => {
    return rupeeAmount * 5;
  };

  const applyCredits = async (creditsToUse: number): Promise<boolean> => {
    if (!user || creditsToUse > credits || creditsToUse <= 0) return false;

    try {
      const newBalance = credits - creditsToUse;
      const { error } = await supabase
        .from("user_credits")
        .update({ balance: newBalance })
        .eq("user_id", user.id);

      if (error) throw error;
      setCredits(newBalance);
      return true;
    } catch (error) {
      console.error("Error applying credits:", error);
      return false;
    }
  };

  const earnCredits = async (orderAmount: number): Promise<number> => {
    if (!user) return 0;

    // Earn 2 credits per ₹10 spent (i.e., 1 credit per ₹5)
    const earned = Math.floor(orderAmount / 5);
    if (earned <= 0) return 0;

    try {
      const newBalance = credits + earned;
      const { error } = await supabase
        .from("user_credits")
        .update({ balance: newBalance })
        .eq("user_id", user.id);

      if (error) throw error;
      setCredits(newBalance);
      return earned;
    } catch (error) {
      console.error("Error earning credits:", error);
      return 0;
    }
  };

  return {
    credits,
    loading,
    creditsToRupees,
    rupeesToCredits,
    applyCredits,
    earnCredits,
    refetch: fetchCredits,
  };
};
