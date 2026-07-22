-- Storage deletions first resolve matching object metadata. Keep that lookup
-- private to admins while public image delivery continues through the bucket's
-- public object URLs.
DROP POLICY IF EXISTS "Admins can read project thumbnail metadata" ON storage.objects;
CREATE POLICY "Admins can read project thumbnail metadata"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'project-thumbnails'
  AND public.has_role((SELECT auth.uid()), 'admin'::public.app_role)
);
