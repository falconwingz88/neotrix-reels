-- First, ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-thumbnails', 'project-thumbnails', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update project thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete project thumbnails" ON storage.objects;

-- Create policies for project-thumbnails bucket
-- Allow public read access
CREATE POLICY "Anyone can view project thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-thumbnails');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload project thumbnails" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'project-thumbnails' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update project thumbnails" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'project-thumbnails' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete project thumbnails" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'project-thumbnails' AND auth.role() = 'authenticated');