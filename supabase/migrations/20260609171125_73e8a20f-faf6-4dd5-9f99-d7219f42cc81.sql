CREATE TABLE public.user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  blocked_username TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, blocked_username)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_blocks TO authenticated;
GRANT ALL ON public.user_blocks TO service_role;
ALTER TABLE public.user_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own blocks" ON public.user_blocks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own blocks" ON public.user_blocks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete own blocks" ON public.user_blocks FOR DELETE TO authenticated USING (auth.uid() = user_id);