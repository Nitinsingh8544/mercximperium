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
      const { data, error } = await supabase.functions.invoke("wallet-operations", {
        body: { action: "apply_credits", amount: creditsToUse },
      });
      if (error || data?.error) return false;
      setCredits(Number(data.credits) || 0);
      return true;
    } catch {
      return false;
    }
  };

  const earnCredits = async (orderAmount: number): Promise<number> => {
    if (!user || orderAmount <= 0) return 0;
    try {
      const { data, error } = await supabase.functions.invoke("wallet-operations", {
        body: { action: "earn_credits", amount: orderAmount },
      });
      if (error || data?.error) return 0;
      setCredits(Number(data.credits) || 0);
      return Number(data.earned) || 0;
    } catch {
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
