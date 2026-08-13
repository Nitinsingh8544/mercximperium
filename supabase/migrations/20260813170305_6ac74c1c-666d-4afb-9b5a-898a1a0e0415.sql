CREATE OR REPLACE FUNCTION public.guard_admin_fields()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() = 'service_role' THEN
    RETURN NEW;
  END IF;
  NEW.status := OLD.status;
  NEW.admin_response := OLD.admin_response;
  NEW.user_id := OLD.user_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS guard_contact_messages_admin_fields ON public.contact_messages;
CREATE TRIGGER guard_contact_messages_admin_fields
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW EXECUTE FUNCTION public.guard_admin_fields();

DROP TRIGGER IF EXISTS guard_user_reports_admin_fields ON public.user_reports;
CREATE TRIGGER guard_user_reports_admin_fields
BEFORE UPDATE ON public.user_reports
FOR EACH ROW EXECUTE FUNCTION public.guard_admin_fields();