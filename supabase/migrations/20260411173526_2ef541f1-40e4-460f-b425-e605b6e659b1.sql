
CREATE TABLE public.seller_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  seller_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  username TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.seller_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view reviews"
ON public.seller_reviews FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own reviews"
ON public.seller_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
ON public.seller_reviews FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_seller_reviews_seller ON public.seller_reviews(seller_name);
