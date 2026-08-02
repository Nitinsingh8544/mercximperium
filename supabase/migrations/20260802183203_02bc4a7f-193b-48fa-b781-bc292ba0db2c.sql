-- 1. Chat media: exact object-path match instead of LIKE partial match
DROP POLICY IF EXISTS "Chat media readable by participants" ON storage.objects;

CREATE POLICY "Chat media readable by participants"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'chat-media'
  AND (
    (auth.uid())::text = (storage.foldername(name))[1]
    OR EXISTS (
      SELECT 1
      FROM public.direct_messages dm
      WHERE (dm.sender_id = auth.uid() OR dm.recipient_id = auth.uid())
        AND dm.media_url IS NOT NULL
        AND split_part(split_part(dm.media_url, '?', 1), '/chat-media/', 2) = objects.name
    )
  )
);

-- 2. Profiles: restrict reads to authenticated users only
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

REVOKE ALL ON public.profiles FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;