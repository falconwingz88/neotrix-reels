-- Fix 1: Update storage policies to admin-only for write operations
-- First drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can upload thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update their thumbnails" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete their thumbnails" ON storage.objects;

-- Create admin-only policies for write operations
CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update thumbnails"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete thumbnails"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-thumbnails' AND has_role(auth.uid(), 'admin'::app_role));

-- Fix 2: Add database constraints for input validation on projects table
ALTER TABLE projects ADD CONSTRAINT title_length CHECK (char_length(title) <= 200);
ALTER TABLE projects ADD CONSTRAINT description_length CHECK (char_length(description) <= 5000);
ALTER TABLE projects ADD CONSTRAINT credits_length CHECK (char_length(credits) <= 2000);
ALTER TABLE projects ADD CONSTRAINT client_length CHECK (char_length(client) <= 200);
ALTER TABLE projects ADD CONSTRAINT tags_limit CHECK (array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 20);
ALTER TABLE projects ADD CONSTRAINT links_limit CHECK (array_length(links, 1) IS NULL OR array_length(links, 1) <= 20);

-- Fix 3: Create contacts table to replace localStorage storage
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  project_status text NOT NULL,
  has_deck boolean,
  deck_link text,
  video_versions text,
  video_duration text,
  delivery_date date,
  start_date date,
  location text,
  submitted_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Only admins can view contacts
CREATE POLICY "Admins can view contacts" 
ON public.contacts 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit contacts (for the public contact form)
CREATE POLICY "Anyone can submit contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (true);

-- Admins can manage contacts
CREATE POLICY "Admins can manage contacts"
ON public.contacts
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));