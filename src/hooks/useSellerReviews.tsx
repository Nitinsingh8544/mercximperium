import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

export interface SellerReview {
  id: string;
  user_id: string;
  seller_name: string;
  rating: number;
  review_text: string;
  username: string | null;
  created_at: string;
}

export const useSellerReviews = (sellerName: string) => {
  const [reviews, setReviews] = useState<SellerReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("seller_reviews")
      .select("*")
      .eq("seller_name", sellerName)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setReviews(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (sellerName) fetchReviews();
  }, [sellerName]);

  const submitReview = async (rating: number, reviewText: string) => {
    if (!user) {
      toast.error("Please sign in to leave a review");
      return false;
    }
    if (!reviewText.trim()) {
      toast.error("Please enter a review message");
      return false;
    }
    if (rating < 1) {
      toast.error("Please select a rating");
      return false;
    }

    setSubmitting(true);
    const { error } = await supabase.from("seller_reviews").insert({
      user_id: user.id,
      seller_name: sellerName,
      rating,
      review_text: reviewText.trim(),
      username: profile?.username || profile?.name || user.email?.split("@")[0] || "User",
    });

    setSubmitting(false);
    if (error) {
      toast.error("Failed to post review");
      return false;
    }

    toast.success("Review posted!");
    await fetchReviews();
    return true;
  };

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return { stars, pct: reviews.length ? Math.round((count / reviews.length) * 100) : 0 };
  });

  return { reviews, loading, submitting, submitReview, avgRating: parseFloat(avgRating), ratingDistribution, totalReviews: reviews.length };
};
