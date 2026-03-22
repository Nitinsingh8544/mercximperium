
-- Add follow_source column to follows table
ALTER TABLE public.follows ADD COLUMN follow_source text NOT NULL DEFAULT 'auction';

-- Create cart_items table
CREATE TABLE public.cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_title text NOT NULL,
  product_image text,
  product_price numeric NOT NULL,
  product_original_price numeric,
  product_currency text NOT NULL DEFAULT '₹',
  quantity integer NOT NULL DEFAULT 1,
  seller_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- RLS policies for cart_items
CREATE POLICY "Users can view their own cart items" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cart items" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cart items" ON public.cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cart items" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);
