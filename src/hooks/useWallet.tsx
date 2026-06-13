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
        supabase
          .from("user_credits")
          .select("wallet_balance")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("wallet_transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(50),
      ]);

      setBalance(cred ? Number(cred.wallet_balance) || 0 : 0);
      setTransactions((tx as WalletTransaction[]) || []);
    } catch (e) {
      if (import.meta.env.DEV) console.error("Wallet fetch error", e);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const invokeWallet = async (payload: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("wallet-operations", { body: payload });
    if (error) return { success: false, error: error.message };
    if (data?.error) return { success: false, error: data.error };
    return { success: true, data };
  };

  const addMoney = async (rupees: number, paymentMethod: string, reference?: string) => {
    if (!user) return { success: false, error: "Not authenticated" };
    if (rupees <= 0) return { success: false, error: "Enter a valid amount" };
    const res = await invokeWallet({ action: "add_money", amount: Math.round(rupees), payment_method: paymentMethod, reference });
    if (res.success) await fetchAll();
    return res;
  };

  const spend = async (rupees: number, description: string, reference?: string) => {
    if (!user) return { success: false, error: "Not authenticated" };
    if (rupees <= 0) return { success: false, error: "Invalid amount" };
    if (rupees > balance) return { success: false, error: "Insufficient balance" };
    const res = await invokeWallet({ action: "spend", amount: rupees, description, reference });
    if (res.success) await fetchAll();
    return res;
  };

  const withdraw = async (rupees: number, method: string, reference?: string) => {
    if (!user) return { success: false, error: "Not authenticated" };
    if (rupees <= 0) return { success: false, error: "Enter a valid amount" };
    if (rupees > balance) return { success: false, error: "Insufficient balance" };
    const res = await invokeWallet({ action: "withdraw", amount: rupees, payment_method: method, reference });
    if (res.success) await fetchAll();
    return res;
  };

  return { balance, transactions, loading, addMoney, spend, withdraw, refetch: fetchAll };
};
