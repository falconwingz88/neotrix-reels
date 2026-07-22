BEGIN;

-- Public buckets serve individual object URLs without a SELECT policy. Removing
-- this policy prevents anonymous callers from enumerating the entire bucket.
DROP POLICY IF EXISTS "Public can read project thumbnails" ON storage.objects;

-- This platform helper is owned by postgres and must never be exposed through
-- the public Data API roles.
REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

-- Cache auth.uid() once per statement and avoid overlapping SELECT policies.
DROP POLICY IF EXISTS "Public can view unrestricted projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;
CREATE POLICY "Anonymous can view unrestricted projects"
ON public.projects FOR SELECT TO anon
USING (is_restricted IS NOT TRUE);
CREATE POLICY "Authenticated users can view allowed projects"
ON public.projects FOR SELECT TO authenticated
USING (
  is_restricted IS NOT TRUE
  OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);

DROP POLICY IF EXISTS "Admins can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can update projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can delete projects" ON public.projects;
CREATE POLICY "Admins can insert projects"
ON public.projects FOR INSERT TO authenticated
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can view active client logos" ON public.client_logos;
DROP POLICY IF EXISTS "Admins can manage client logos" ON public.client_logos;
CREATE POLICY "Anonymous can view active client logos"
ON public.client_logos FOR SELECT TO anon
USING (is_active IS TRUE);
CREATE POLICY "Authenticated users can view allowed client logos"
ON public.client_logos FOR SELECT TO authenticated
USING (
  is_active IS TRUE
  OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
CREATE POLICY "Admins can insert client logos"
ON public.client_logos FOR INSERT TO authenticated
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can update client logos"
ON public.client_logos FOR UPDATE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can delete client logos"
ON public.client_logos FOR DELETE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Anyone can view active job openings" ON public.job_openings;
DROP POLICY IF EXISTS "Admins can manage job openings" ON public.job_openings;
CREATE POLICY "Anonymous can view active job openings"
ON public.job_openings FOR SELECT TO anon
USING (is_active IS TRUE);
CREATE POLICY "Authenticated users can view allowed job openings"
ON public.job_openings FOR SELECT TO authenticated
USING (
  is_active IS TRUE
  OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
CREATE POLICY "Admins can insert job openings"
ON public.job_openings FOR INSERT TO authenticated
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can update job openings"
ON public.job_openings FOR UPDATE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can delete job openings"
ON public.job_openings FOR DELETE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can modify site settings" ON public.site_settings;
CREATE POLICY "Site settings are publicly readable"
ON public.site_settings FOR SELECT TO anon, authenticated
USING (true);
CREATE POLICY "Admins can insert site settings"
ON public.site_settings FOR INSERT TO authenticated
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can update site settings"
ON public.site_settings FOR UPDATE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can delete site settings"
ON public.site_settings FOR DELETE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Users can view permitted roles"
ON public.user_roles FOR SELECT TO authenticated
USING (
  user_id = (SELECT auth.uid())
  OR public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
CREATE POLICY "Admins can view contacts"
ON public.contacts FOR SELECT TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));
CREATE POLICY "Admins can manage contacts"
ON public.contacts FOR DELETE TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage project file links" ON public.project_file_links;
CREATE POLICY "Admins can manage project file links"
ON public.project_file_links FOR ALL TO authenticated
USING (public.has_role((SELECT auth.uid()), 'admin'::public.app_role))
WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can view their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can create their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.calendar_events;
CREATE POLICY "Users can view their own events"
ON public.calendar_events FOR SELECT TO authenticated
USING ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can create their own events"
ON public.calendar_events FOR INSERT TO authenticated
WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can update their own events"
ON public.calendar_events FOR UPDATE TO authenticated
USING ((SELECT auth.uid()) = user_id)
WITH CHECK ((SELECT auth.uid()) = user_id);
CREATE POLICY "Users can delete their own events"
ON public.calendar_events FOR DELETE TO authenticated
USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Admins can upload project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project thumbnails" ON storage.objects;
CREATE POLICY "Admins can upload project thumbnails"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-thumbnails'
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
CREATE POLICY "Admins can update project thumbnails"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'project-thumbnails'
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
CREATE POLICY "Admins can delete project thumbnails"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);

CREATE INDEX IF NOT EXISTS calendar_events_user_id_idx
  ON public.calendar_events (user_id);
DROP INDEX IF EXISTS public.site_settings_key_unique;

COMMIT;
