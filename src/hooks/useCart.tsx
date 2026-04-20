import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface CartItem {
  id: string;
  user_id: string;
  product_title: string;
  product_image: string | null;
  product_price: number;
  product_original_price: number | null;
  product_currency: string;
  quantity: number;
  seller_name: string | null;
  created_at: string;
}

export const useCart = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCartItems((data as CartItem[]) || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (item: {
    product_title: string;
    product_image?: string;
    product_price: number;
    product_original_price?: number;
    product_currency?: string;
    quantity?: number;
    seller_name?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_title: item.product_title,
          product_image: item.product_image || null,
          product_price: item.product_price,
          product_original_price: item.product_original_price || null,
          product_currency: item.product_currency || "₹",
          quantity: item.quantity || 1,
          seller_name: item.seller_name || null,
        })
        .select()
        .single();

      if (error) throw error;
      setCartItems((prev) => [data as CartItem, ...prev]);
      return { error: null, data };
    } catch (error) {
      console.error("Error adding to cart:", error);
      return { error };
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;
    if (quantity < 1) return;

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) {
      setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return { cartItems, loading, addToCart, removeFromCart, updateQuantity, refetch: fetchCart };
};
