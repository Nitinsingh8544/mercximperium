DROP POLICY IF EXISTS "Users can insert their own bids" ON public.auction_bids;
DROP POLICY IF EXISTS "Users can create their own bids" ON public.auction_bids;
DROP POLICY IF EXISTS "Authenticated users can insert bids" ON public.auction_bids;
DROP POLICY IF EXISTS "auction_bids_insert" ON public.auction_bids;
DROP POLICY IF EXISTS "Users can insert own bids" ON public.auction_bids;

DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can insert own wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "wallet_transactions_insert" ON public.wallet_transactions;

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='auction_bids' AND cmd='INSERT' LOOP
    EXECUTE format('DROP POLICY %I ON public.auction_bids', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='wallet_transactions' AND cmd='INSERT' LOOP
    EXECUTE format('DROP POLICY %I ON public.wallet_transactions', r.policyname);
  END LOOP;
END $$;