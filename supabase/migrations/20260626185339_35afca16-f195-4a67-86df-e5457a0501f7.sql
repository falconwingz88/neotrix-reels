
CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF LOWER(NEW.email) IN ('neotrix.ai@gmail.com', 'fernaldy.wiranata@gmail.com') THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  IF LOWER(NEW.email) = 'ap.neotrix@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'account_executive')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$function$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS assign_admin_on_signup_trigger ON auth.users;
CREATE TRIGGER assign_admin_on_signup_trigger
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.assign_admin_on_signup();

-- Backfill: if these users already exist, grant admin now
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE LOWER(email) IN ('neotrix.ai@gmail.com', 'fernaldy.wiranata@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;
