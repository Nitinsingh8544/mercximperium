
ALTER TABLE public.direct_messages
  ADD COLUMN IF NOT EXISTS media_url text,
  ADD COLUMN IF NOT EXISTS media_type text;

ALTER TABLE public.direct_messages
  ALTER COLUMN content DROP NOT NULL;

ALTER TABLE public.direct_messages
  ALTER COLUMN content SET DEFAULT '';
