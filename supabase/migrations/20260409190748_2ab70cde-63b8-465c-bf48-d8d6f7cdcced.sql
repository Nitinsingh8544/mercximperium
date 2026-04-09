
-- Auction items table for items being auctioned in streams
CREATE TABLE public.auction_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stream_id INTEGER NOT NULL,
  item_name TEXT NOT NULL,
  item_image TEXT,
  item_description TEXT,
  starting_price NUMERIC NOT NULL DEFAULT 0,
  current_price NUMERIC NOT NULL DEFAULT 0,
  min_increment NUMERIC NOT NULL DEFAULT 10,
  auction_duration_seconds INTEGER NOT NULL DEFAULT 60,
  auction_started_at TIMESTAMP WITH TIME ZONE,
  auction_ends_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  winner_user_id UUID,
  seller_name TEXT,
  seller_image TEXT,
  item_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.auction_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view auction items"
ON public.auction_items FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Anyone authenticated can update auction items"
ON public.auction_items FOR UPDATE TO authenticated
USING (true);

CREATE POLICY "Anyone authenticated can insert auction items"
ON public.auction_items FOR INSERT TO authenticated
WITH CHECK (true);

-- Bid history table for tracking every bid
CREATE TABLE public.bid_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_item_id UUID NOT NULL REFERENCES public.auction_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  username TEXT,
  bid_amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.bid_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view bid history"
ON public.bid_history FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can insert their own bids"
ON public.bid_history FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for bid_history
ALTER PUBLICATION supabase_realtime ADD TABLE public.bid_history;
ALTER PUBLICATION supabase_realtime ADD TABLE public.auction_items;

-- Indexes
CREATE INDEX idx_auction_items_stream ON public.auction_items(stream_id);
CREATE INDEX idx_auction_items_status ON public.auction_items(status);
CREATE INDEX idx_bid_history_auction_item ON public.bid_history(auction_item_id);
CREATE INDEX idx_bid_history_user ON public.bid_history(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_auction_items_updated_at
BEFORE UPDATE ON public.auction_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
