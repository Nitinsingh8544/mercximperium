-- Add a separate wallet_balance column to user_credits for actual rupees.
-- The existing 'balance' column continues to represent credit points (5 credits = ₹1).
ALTER TABLE public.user_credits
ADD COLUMN IF NOT EXISTS wallet_balance numeric NOT NULL DEFAULT 0;

-- Update the new-user trigger so new accounts start with 1000 credits and ₹0 in wallet.
CREATE OR REPLACE FUNCTION public.handle_new_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.user_credits (user_id, balance, wallet_balance)
  VALUES (NEW.id, 1000, 0);
  RETURN NEW;
END;
$function$;