
-- Follows table
CREATE TABLE public.follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, seller_name)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own follows" ON public.follows FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own follows" ON public.follows FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own follows" ON public.follows FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Live comments table with realtime
CREATE TABLE public.live_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stream_id text NOT NULL,
  message text NOT NULL,
  username text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.live_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view comments" ON public.live_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert their own comments" ON public.live_comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
ALTER PUBLICATION supabase_realtime ADD TABLE public.live_comments;

-- Auction bids table
CREATE TABLE public.auction_bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stream_id integer NOT NULL,
  item_name text NOT NULL,
  item_image text,
  item_description text,
  bid_amount numeric NOT NULL,
  is_winning boolean DEFAULT false,
  seller_name text,
  seller_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.auction_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own bids" ON public.auction_bids FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bids" ON public.auction_bids FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bids" ON public.auction_bids FOR UPDATE TO authenticated USING (auth.uid() = user_id);
