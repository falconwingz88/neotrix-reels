
-- 1. Remove overly permissive storage policies on project-thumbnails
DROP POLICY IF EXISTS "Authenticated users can update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project thumbnails" ON storage.objects;

-- 2. Restrict calendar_events SELECT to the owner
DROP POLICY IF EXISTS "Anyone can view events" ON public.calendar_events;
CREATE POLICY "Users can view their own events"
ON public.calendar_events
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 3. Lock down SECURITY DEFINER function execution; RLS still uses has_role via the policy executor
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.assign_admin_on_signup() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
