
-- bid_history: remove client INSERT (server-only via edge function)
DROP POLICY IF EXISTS "Users can insert their own bids" ON public.bid_history;
DROP POLICY IF EXISTS "Authenticated users can insert bids" ON public.bid_history;
DROP POLICY IF EXISTS "Users can create bids" ON public.bid_history;
DROP POLICY IF EXISTS "Users insert own bids" ON public.bid_history;

-- wallet_transactions: remove client INSERT (server-only via edge function)
DROP POLICY IF EXISTS "Users can insert their own transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users can create wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Authenticated users can insert wallet transactions" ON public.wallet_transactions;
DROP POLICY IF EXISTS "Users insert own wallet transactions" ON public.wallet_transactions;

-- notifications: remove client INSERT and UPDATE; add narrow UPDATE policy for marking read
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;

-- Trigger to restrict notification UPDATEs to only the 'read' column
CREATE OR REPLACE FUNCTION public.restrict_notification_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS DISTINCT FROM OLD.user_id
    OR NEW.type IS DISTINCT FROM OLD.type
    OR NEW.title IS DISTINCT FROM OLD.title
    OR NEW.body IS DISTINCT FROM OLD.body
    OR NEW.link IS DISTINCT FROM OLD.link
    OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
    RAISE EXCEPTION 'Only the read flag may be updated on notifications';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS notifications_restrict_update ON public.notifications;
CREATE TRIGGER notifications_restrict_update
BEFORE UPDATE ON public.notifications
FOR EACH ROW
EXECUTE FUNCTION public.restrict_notification_update();

CREATE POLICY "Users can mark their own notifications as read"
ON public.notifications
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- orders: remove client INSERT and UPDATE (move to edge function)
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update orders" ON public.orders;
