
-- 1. Lock down user_credits: remove client INSERT/UPDATE; keep SELECT own row
DROP POLICY IF EXISTS "Users can insert their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users insert own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users update own credits" ON public.user_credits;
DROP POLICY IF EXISTS "user_credits_insert_own" ON public.user_credits;
DROP POLICY IF EXISTS "user_credits_update_own" ON public.user_credits;

-- 2. Lock down wallet_transactions: remove client INSERT; keep SELECT own rows
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users insert own wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_insert_own" ON public.wallet_transactions;

-- 3. Auction items: add seller_id, remove permissive write policies
ALTER TABLE public.auction_items ADD COLUMN IF NOT EXISTS seller_id uuid;

DROP POLICY IF EXISTS "Authenticated users can insert auction items" ON public.auction_items;
DROP POLICY IF EXISTS "Authenticated users can update auction items" ON public.auction_items;
DROP POLICY IF EXISTS "auction_items_insert_authenticated" ON public.auction_items;
DROP POLICY IF EXISTS "auction_items_update_authenticated" ON public.auction_items;
DROP POLICY IF EXISTS "Anyone authenticated can insert auction items" ON public.auction_items;
DROP POLICY IF EXISTS "Anyone authenticated can update auction items" ON public.auction_items;

-- 4. Chat media storage: restrict reads to sender or recipient of related message
DROP POLICY IF EXISTS "Authenticated can read chat media" ON storage.objects;

CREATE POLICY "Chat media readable by participants"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-media'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1 FROM public.direct_messages dm
      WHERE dm.media_url LIKE '%' || storage.objects.name
        AND (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
    )
  )
);
