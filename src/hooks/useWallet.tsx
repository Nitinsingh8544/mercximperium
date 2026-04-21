import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface WalletTransaction {
  id: string;
  user_id: string;
  type: "credit" | "debit";
  amount: number;
  description: string | null;
  payment_method: string | null;
  reference: string | null;
  balance_after: number;
  created_at: string;
}

export const useWallet = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }
    try {
      const [{ data: cred }, { data: tx }] = await Promise.all([
        supabase.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      if (cred) {
        setBalance(cred.balance);
      } else {
        const { data: created } = await supabase
          .from("user_credits")
          .insert({ user_id: user.id, balance: 1000 })
          .select("balance")
          .single();
        if (created) setBalance(created.balance);
      }

      setTransactions((tx as WalletTransaction[]) || []);
    } catch (e) {
      console.error("Wallet fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addMoney = async (
    rupees: number,
    paymentMethod: string,
    reference?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };
    if (rupees <= 0) return { success: false, error: "Enter a valid amount" };

    // 1 rupee = 5 credits (existing convention)
    const credits = Math.round(rupees * 5);
    const newBalance = balance + credits;

    const { error: updErr } = await supabase
      .from("user_credits")
      .update({ balance: newBalance })
      .eq("user_id", user.id);
    if (updErr) return { success: false, error: updErr.message };

    const { data: txRow, error: txErr } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        type: "credit",
        amount: credits,
        description: `Wallet top-up of ₹${rupees.toLocaleString()}`,
        payment_method: paymentMethod,
        reference: reference || null,
        balance_after: newBalance,
      })
      .select()
      .single();
    if (txErr) return { success: false, error: txErr.message };

    setBalance(newBalance);
    if (txRow) setTransactions((prev) => [txRow as WalletTransaction, ...prev]);
    return { success: true };
  };

  const spend = async (
    credits: number,
    description: string,
    reference?: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: "Not authenticated" };
    if (credits <= 0) return { success: false, error: "Invalid amount" };
    if (credits > balance) return { success: false, error: "Insufficient balance" };

    const newBalance = balance - credits;
    const { error: updErr } = await supabase
      .from("user_credits")
      .update({ balance: newBalance })
      .eq("user_id", user.id);
    if (updErr) return { success: false, error: updErr.message };

    const { data: txRow, error: txErr } = await supabase
      .from("wallet_transactions")
      .insert({
        user_id: user.id,
        type: "debit",
        amount: credits,
        description,
        reference: reference || null,
        balance_after: newBalance,
      })
      .select()
      .single();
    if (txErr) return { success: false, error: txErr.message };

    setBalance(newBalance);
    if (txRow) setTransactions((prev) => [txRow as WalletTransaction, ...prev]);
    return { success: true };
  };

  // Conversion helpers (5 credits = 1 rupee)
  const creditsToRupees = (c: number) => c / 5;
  const rupeesToCredits = (r: number) => r * 5;

  return {
    balance,
    transactions,
    loading,
    addMoney,
    spend,
    creditsToRupees,
    rupeesToCredits,
    refetch: fetchAll,
  };
};
