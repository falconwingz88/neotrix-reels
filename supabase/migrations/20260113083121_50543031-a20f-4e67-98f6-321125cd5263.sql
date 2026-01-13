-- Add is_restricted column to projects table
ALTER TABLE public.projects ADD COLUMN is_restricted boolean DEFAULT false;

-- Create index for faster filtering
CREATE INDEX idx_projects_is_restricted ON public.projects(is_restricted);