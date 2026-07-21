-- Keep project ordering atomic so a partial network failure cannot scramble the archive.
CREATE OR REPLACE FUNCTION public.reorder_projects(_ordered_ids uuid[])
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = '42501';
  END IF;

  IF _ordered_ids IS NULL OR cardinality(_ordered_ids) = 0 THEN
    RETURN;
  END IF;

  IF cardinality(_ordered_ids) <> (
    SELECT count(DISTINCT project_id)
    FROM unnest(_ordered_ids) AS project_id
  ) THEN
    RAISE EXCEPTION 'Project ordering contains duplicate ids' USING ERRCODE = '22023';
  END IF;

  UPDATE public.projects AS project
  SET
    sort_order = ordered.position,
    updated_at = now()
  FROM unnest(_ordered_ids) WITH ORDINALITY AS ordered(id, position)
  WHERE project.id = ordered.id;
END;
$$;

REVOKE ALL ON FUNCTION public.reorder_projects(uuid[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reorder_projects(uuid[]) TO authenticated;

-- Settings are keyed values; make saves a single atomic upsert shared by admin and public UI.
CREATE UNIQUE INDEX IF NOT EXISTS site_settings_key_unique
  ON public.site_settings (key);
