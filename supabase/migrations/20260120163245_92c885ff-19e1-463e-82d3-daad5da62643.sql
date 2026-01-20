-- Drop the existing SELECT policy and create one that works for both anon and authenticated users
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;

CREATE POLICY "Anyone can view projects"
ON public.projects
FOR SELECT
TO anon, authenticated
USING (true);