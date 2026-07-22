BEGIN;

-- Keep delivery/source links out of the publicly readable projects table.
CREATE TABLE IF NOT EXISTS public.project_file_links (
  project_id uuid PRIMARY KEY REFERENCES public.projects(id) ON DELETE CASCADE,
  file_link text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_file_links_length CHECK (char_length(file_link) BETWEEN 1 AND 2048),
  CONSTRAINT project_file_links_http CHECK (file_link ~* '^https?://')
);

ALTER TABLE public.project_file_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage project file links" ON public.project_file_links;
CREATE POLICY "Admins can manage project file links"
ON public.project_file_links FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

INSERT INTO public.project_file_links (project_id, file_link)
SELECT id, trim(file_link)
FROM public.projects
WHERE file_link IS NOT NULL AND length(trim(file_link)) > 0
ON CONFLICT (project_id) DO UPDATE
SET file_link = EXCLUDED.file_link, updated_at = now();

UPDATE public.projects SET file_link = NULL WHERE file_link IS NOT NULL;
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_file_link_must_be_null;
ALTER TABLE public.projects
  ADD CONSTRAINT projects_file_link_must_be_null CHECK (file_link IS NULL);

-- Public catalog queries may only enumerate public work. Admins retain the archive.
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Public can view unrestricted projects" ON public.projects;
DROP POLICY IF EXISTS "Admins can view all projects" ON public.projects;

CREATE POLICY "Public can view unrestricted projects"
ON public.projects FOR SELECT TO anon, authenticated
USING (is_restricted IS NOT TRUE);

CREATE POLICY "Admins can view all projects"
ON public.projects FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Restricted project URLs remain shareable by their unguessable UUID, but cannot be listed.
CREATE OR REPLACE FUNCTION public.get_shared_project(_project_id text)
RETURNS SETOF public.projects
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT project.*
  FROM public.projects AS project
  WHERE project.id::text = _project_id
    AND project.is_restricted IS TRUE
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_shared_project(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_project(text) TO anon, authenticated;

-- Role checks may only inspect the caller's own role membership.
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

-- Admin membership is now provisioned explicitly in user_roles. Do not grant
-- privileged roles merely because a newly-created account claims a known email.
DROP TRIGGER IF EXISTS assign_admin_on_signup_trigger ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_assign_admin ON auth.users;
DROP FUNCTION IF EXISTS public.assign_admin_on_signup();

-- Scope private policies to authenticated sessions instead of the implicit public role.
DROP POLICY IF EXISTS "Admins can view contacts" ON public.contacts;
DROP POLICY IF EXISTS "Admins can manage contacts" ON public.contacts;
CREATE POLICY "Admins can view contacts"
ON public.contacts FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can manage contacts"
ON public.contacts FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Only admins can modify site settings" ON public.site_settings;
CREATE POLICY "Only admins can modify site settings"
ON public.site_settings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Users can create their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.calendar_events;
DROP POLICY IF EXISTS "Users can delete their own events" ON public.calendar_events;
CREATE POLICY "Users can create their own events"
ON public.calendar_events FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own events"
ON public.calendar_events FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own events"
ON public.calendar_events FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Remove duplicate storage policies and constrain uploads to portfolio-safe images.
DROP POLICY IF EXISTS "Anyone can view project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Public can read project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete project thumbnails" ON storage.objects;

CREATE POLICY "Public can read project thumbnails"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'project-thumbnails');
CREATE POLICY "Admins can upload project thumbnails"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
CREATE POLICY "Admins can update project thumbnails"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
)
WITH CHECK (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);
CREATE POLICY "Admins can delete project thumbnails"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role(auth.uid(), 'admin'::public.app_role)
);

UPDATE storage.buckets
SET
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
WHERE id = 'project-thumbnails';

-- Bound fields accepted by the anonymous inquiry insert policy.
ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_role_length CHECK (char_length(role) BETWEEN 1 AND 120) NOT VALID,
  ADD CONSTRAINT contacts_project_status_length CHECK (char_length(project_status) BETWEEN 1 AND 80) NOT VALID,
  ADD CONSTRAINT contacts_deck_link_length CHECK (deck_link IS NULL OR char_length(deck_link) <= 2048) NOT VALID,
  ADD CONSTRAINT contacts_deck_link_http CHECK (deck_link IS NULL OR deck_link ~* '^https?://') NOT VALID,
  ADD CONSTRAINT contacts_video_versions_length CHECK (video_versions IS NULL OR char_length(video_versions) <= 40) NOT VALID,
  ADD CONSTRAINT contacts_video_duration_length CHECK (video_duration IS NULL OR char_length(video_duration) <= 40) NOT VALID,
  ADD CONSTRAINT contacts_location_length CHECK (location IS NULL OR char_length(location) <= 120) NOT VALID;

COMMIT;
