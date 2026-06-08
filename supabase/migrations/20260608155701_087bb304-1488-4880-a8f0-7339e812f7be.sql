
-- 1. Extend leads
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS internal_notes text,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

DROP TRIGGER IF EXISTS set_leads_updated_at ON public.leads;
CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  source_page text,
  status text NOT NULL DEFAULT 'active',
  notes text,
  unsubscribed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS subscribers_created_at_idx ON public.subscribers (created_at DESC);
CREATE INDEX IF NOT EXISTS subscribers_status_idx ON public.subscribers (status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read subscribers" ON public.subscribers;
CREATE POLICY "Admins read subscribers" ON public.subscribers
  FOR SELECT TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Admins insert subscribers" ON public.subscribers;
CREATE POLICY "Admins insert subscribers" ON public.subscribers
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins update subscribers" ON public.subscribers;
CREATE POLICY "Admins update subscribers" ON public.subscribers
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins delete subscribers" ON public.subscribers;
CREATE POLICY "Admins delete subscribers" ON public.subscribers
  FOR DELETE TO authenticated USING (public.is_admin());

DROP TRIGGER IF EXISTS set_subscribers_updated_at ON public.subscribers;
CREATE TRIGGER set_subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
