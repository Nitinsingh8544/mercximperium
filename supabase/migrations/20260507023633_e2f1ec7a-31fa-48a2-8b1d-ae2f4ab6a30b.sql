
CREATE TABLE public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  related_user TEXT,
  related_order_id TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own reports" ON public.user_reports FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own reports" ON public.user_reports FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own reports" ON public.user_reports FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  admin_response TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "view own messages" ON public.contact_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert own messages" ON public.contact_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update own messages" ON public.contact_messages FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER update_user_reports_updated_at BEFORE UPDATE ON public.user_reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON public.contact_messages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
