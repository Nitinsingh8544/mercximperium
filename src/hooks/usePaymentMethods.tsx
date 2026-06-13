import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface PaymentMethod {
  id: string;
  user_id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  country: string;
  is_default: boolean;
  created_at: string;
}

const detectBrand = (cardNumber: string): string => {
  const n = cardNumber.replace(/\s/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return "Mastercard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6(?:011|5)/.test(n)) return "Discover";
  return "Card";
};

export const usePaymentMethods = () => {
  const { user } = useAuth();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user) {
      setMethods([]);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (!error) setMethods((data as PaymentMethod[]) || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addMethod = async (input: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    country: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };
    const cleaned = input.cardNumber.replace(/\s/g, "");
    const last4 = cleaned.slice(-4);
    const brand = detectBrand(cleaned);
    const isFirst = methods.length === 0;
    const { data, error } = await supabase
      .from("payment_methods")
      .insert({
        user_id: user.id,
        brand,
        last4,
        exp_month: input.expMonth,
        exp_year: input.expYear,
        country: input.country,
        is_default: isFirst,
      })
      .select()
      .single();
    if (!error && data) setMethods((p) => [data as PaymentMethod, ...p]);
    return { error, data };
  };

  const setDefault = async (id: string) => {
    if (!user) return;
    await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", user.id);
    await supabase.from("payment_methods").update({ is_default: true }).eq("id", id).eq("user_id", user.id);
    await fetchAll();
  };

  const removeMethod = async (id: string) => {
    if (!user) return;
    await supabase.from("payment_methods").delete().eq("id", id).eq("user_id", user.id);
    setMethods((p) => p.filter((m) => m.id !== id));
  };

  return { methods, loading, addMethod, setDefault, removeMethod, refetch: fetchAll };
};
