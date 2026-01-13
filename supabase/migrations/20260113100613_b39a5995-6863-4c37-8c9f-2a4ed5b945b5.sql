-- Tighten overly-permissive contacts INSERT policy (avoid WITH CHECK (true))
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public'
      AND tablename='contacts'
      AND policyname='Anyone can submit contacts'
  ) THEN
    DROP POLICY "Anyone can submit contacts" ON public.contacts;
  END IF;

  CREATE POLICY "Anyone can submit contacts"
  ON public.contacts
  FOR INSERT
  WITH CHECK (
    length(trim(name)) > 0
    AND length(trim(role)) > 0
    AND length(trim(project_status)) > 0
  );
END $$;