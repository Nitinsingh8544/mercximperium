
-- Add DELETE policy for profiles so users can delete their own data
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);

-- Make auction bids immutable: drop any UPDATE policies
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'auction_bids' AND cmd = 'UPDATE'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.auction_bids', pol.policyname);
  END LOOP;
END $$;

-- Revoke EXECUTE on SECURITY DEFINER helpers from anon/authenticated.
-- These run only via triggers, so revoking direct execution is safe.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_credits() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
