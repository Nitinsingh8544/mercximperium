
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_title TEXT NOT NULL,
  product_image TEXT,
  product_price NUMERIC NOT NULL,
  product_currency TEXT NOT NULL DEFAULT '₹',
  quantity INTEGER NOT NULL DEFAULT 1,
  seller_name TEXT,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT,
  shipping_address TEXT,
  status TEXT NOT NULL DEFAULT 'ordered',
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_orders_user_created ON public.orders(user_id, created_at DESC);
