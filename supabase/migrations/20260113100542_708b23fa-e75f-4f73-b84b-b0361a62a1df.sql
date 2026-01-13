-- Storage policies for bucket: project-thumbnails
-- Allow anyone to read (public portfolio)
DO $$
BEGIN
  -- SELECT
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public can read project thumbnails'
  ) THEN
    CREATE POLICY "Public can read project thumbnails"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'project-thumbnails');
  END IF;

  -- INSERT (admin only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can upload project thumbnails'
  ) THEN
    CREATE POLICY "Admins can upload project thumbnails"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
      bucket_id = 'project-thumbnails'
      AND public.has_role(auth.uid(), 'admin')
    );
  END IF;

  -- UPDATE (admin only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can update project thumbnails'
  ) THEN
    CREATE POLICY "Admins can update project thumbnails"
    ON storage.objects
    FOR UPDATE
    USING (
      bucket_id = 'project-thumbnails'
      AND public.has_role(auth.uid(), 'admin')
    )
    WITH CHECK (
      bucket_id = 'project-thumbnails'
      AND public.has_role(auth.uid(), 'admin')
    );
  END IF;

  -- DELETE (admin only)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Admins can delete project thumbnails'
  ) THEN
    CREATE POLICY "Admins can delete project thumbnails"
    ON storage.objects
    FOR DELETE
    USING (
      bucket_id = 'project-thumbnails'
      AND public.has_role(auth.uid(), 'admin')
    );
  END IF;
END $$;