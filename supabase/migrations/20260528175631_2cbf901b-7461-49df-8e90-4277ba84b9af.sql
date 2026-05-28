
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'email') IN ('pamela.ssarti@gmail.com'),
    false
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
