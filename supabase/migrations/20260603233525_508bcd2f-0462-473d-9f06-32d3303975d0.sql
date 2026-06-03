
-- CMS content tables
CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id text UNIQUE NOT NULL,
  activity text NOT NULL,
  destination text NOT NULL,
  country text NOT NULL,
  continent text NOT NULL,
  operator text,
  operator_url text,
  duration_days text,
  season text,
  price_range text,
  level text,
  summary text,
  editorial_paragraph text,
  source_url text,
  status text NOT NULL DEFAULT 'active',
  hero_image_url text,
  photo_urls text[] DEFAULT '{}',
  sort_order int DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.trips TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read trips" ON public.trips FOR SELECT USING (true);
CREATE POLICY "Admins manage trips" ON public.trips FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.spots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id text UNIQUE NOT NULL,
  activity text NOT NULL,
  name text NOT NULL,
  country text NOT NULL,
  region text,
  city text,
  lat double precision,
  lng double precision,
  conditions jsonb DEFAULT '{}'::jsonb,
  description text,
  description_raw text,
  source_url text,
  status text NOT NULL DEFAULT 'active',
  hero_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.spots TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.spots TO authenticated;
GRANT ALL ON public.spots TO service_role;
ALTER TABLE public.spots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read spots" ON public.spots FOR SELECT USING (true);
CREATE POLICY "Admins manage spots" ON public.spots FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.journal_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  dek text,
  author text,
  published_date timestamptz,
  read_time_minutes int,
  hero_image_url text,
  body text,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journal_articles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.journal_articles TO authenticated;
GRANT ALL ON public.journal_articles TO service_role;
ALTER TABLE public.journal_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read articles" ON public.journal_articles FOR SELECT USING (true);
CREATE POLICY "Admins manage articles" ON public.journal_articles FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.site_config (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_config TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_config TO authenticated;
GRANT ALL ON public.site_config TO service_role;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read site_config" ON public.site_config FOR SELECT USING (true);
CREATE POLICY "Admins manage site_config" ON public.site_config FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_email text,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read activity" ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_admin());
CREATE POLICY "Admins insert activity" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trips_updated_at BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER spots_updated_at BEFORE UPDATE ON public.spots
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER journal_updated_at BEFORE UPDATE ON public.journal_articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER site_config_updated_at BEFORE UPDATE ON public.site_config
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Indexes
CREATE INDEX trips_activity_idx ON public.trips(activity);
CREATE INDEX trips_continent_idx ON public.trips(continent);
CREATE INDEX spots_activity_idx ON public.spots(activity);
CREATE INDEX spots_region_idx ON public.spots(region);
CREATE INDEX spots_country_idx ON public.spots(country);
CREATE INDEX articles_status_idx ON public.journal_articles(status);
