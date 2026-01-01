-- Add sort_order column to projects table
ALTER TABLE public.projects 
ADD COLUMN sort_order integer DEFAULT 0;

-- Update existing projects with sort_order based on created_at (newest first)
WITH ranked_projects AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY delivery_date DESC NULLS LAST, created_at DESC) as rn
  FROM public.projects
)
UPDATE public.projects p
SET sort_order = rp.rn
FROM ranked_projects rp
WHERE p.id = rp.id;

-- Create index for faster sorting
CREATE INDEX idx_projects_sort_order ON public.projects(sort_order);