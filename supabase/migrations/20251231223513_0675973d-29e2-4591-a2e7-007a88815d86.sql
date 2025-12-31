-- Create storage bucket for project thumbnails
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-thumbnails', 'project-thumbnails', true);

-- Allow anyone to view thumbnails (public bucket)
CREATE POLICY "Anyone can view project thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-thumbnails');

-- Allow authenticated users to upload thumbnails
CREATE POLICY "Authenticated users can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-thumbnails');

-- Allow authenticated users to update their thumbnails
CREATE POLICY "Authenticated users can update thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-thumbnails');

-- Allow authenticated users to delete thumbnails
CREATE POLICY "Authenticated users can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-thumbnails');