-- Extend inquiries without invalidating historical submissions.
ALTER TABLE public.contacts
  ADD COLUMN IF NOT EXISTS company text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS submission_key text;

CREATE UNIQUE INDEX IF NOT EXISTS contacts_submission_key_unique
  ON public.contacts (submission_key)
  WHERE submission_key IS NOT NULL;

ALTER TABLE public.contacts
  ADD CONSTRAINT contacts_name_length CHECK (char_length(name) BETWEEN 1 AND 120) NOT VALID,
  ADD CONSTRAINT contacts_company_length CHECK (company IS NULL OR char_length(company) <= 160) NOT VALID,
  ADD CONSTRAINT contacts_email_length CHECK (email IS NULL OR char_length(email) <= 254) NOT VALID,
  ADD CONSTRAINT contacts_phone_length CHECK (phone IS NULL OR char_length(phone) <= 40) NOT VALID,
  ADD CONSTRAINT contacts_reachable CHECK (
    (email IS NOT NULL AND length(trim(email)) > 0)
    OR (phone IS NOT NULL AND length(trim(phone)) > 0)
  ) NOT VALID;

DROP POLICY IF EXISTS "Anyone can submit contacts" ON public.contacts;
CREATE POLICY "Anyone can submit contacts"
ON public.contacts FOR INSERT TO anon, authenticated
WITH CHECK (
  length(trim(name)) > 0
  AND length(trim(role)) > 0
  AND length(trim(project_status)) > 0
  AND (
    (email IS NOT NULL AND length(trim(email)) > 0)
    OR (phone IS NOT NULL AND length(trim(phone)) > 0)
  )
);

-- The previous broad ALL policies forced anonymous reads to evaluate has_role
-- after EXECUTE had been revoked. Scope admin policies to authenticated users.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS "Admins can manage client logos" ON public.client_logos;
CREATE POLICY "Admins can manage client logos"
ON public.client_logos FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can manage job openings" ON public.job_openings;
CREATE POLICY "Admins can manage job openings"
ON public.job_openings FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));
