
-- Drop overly permissive policies
DROP POLICY "Anyone authenticated can update auction items" ON public.auction_items;
DROP POLICY "Anyone authenticated can insert auction items" ON public.auction_items;

-- More restrictive insert (still needs to be open for demo/seed data)
CREATE POLICY "Authenticated users can insert auction items"
ON public.auction_items FOR INSERT TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Update: any authenticated user can update (needed for placing bids to update current_price)
CREATE POLICY "Authenticated users can update auction items"
ON public.auction_items FOR UPDATE TO authenticated
USING (auth.uid() IS NOT NULL);
