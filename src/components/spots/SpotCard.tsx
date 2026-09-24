import { Link } from "@tanstack/react-router";
import {
  ACTIVITIES,
  type Activity,
  type Spot,
  type Continent,
  type RegionGroup,
  placeLabel,
} from "@/lib/spots-data";
import { findTrip, tripImage, durationLabel } from "@/lib/trips-data";
import { findArticle, CATEGORY_LABEL } from "@/lib/journal-data";
import { useT } from "@/i18n/useT";

/** Placeholder for a future seasonal chart driven by bestMonths. */
function SeasonalChart() {
  return (
    <div
      role="img"
      aria-label="Gráfico sazonal em desenvolvimento"
      className="flex h-24 items-center justify-center border border-dashed border-stone/30 bg-stone/[0.03] text-[10px] uppercase tracking-[0.2em] text-stone/60"
    >
      Gráfico sazonal · em breve
    </div>
  );
}

const KEY_LABELS: Record<string, string> = {
  break_type: "Tipo de onda",
  bottom_type: "Tipo de fundo",
  recommended_level: "Nível recomendado",
  ideal_swell: "Swell ideal",
  ideal_wind: "Vento ideal",
  ideal_tide: "Maré ideal",
  hazards: "Perigos",
  crowds: "Lotação",
  distance: "Distância",
  elevation: "Elevação",
  profile: "Perfil",
  difficulty: "Dificuldade",
  estimated_time: "Tempo estimado",
  route_type: "Tipo de rota",
  terrain_water: "Terreno e água",
  elevation_profile: "Elevação e perfil",
  terrain_surface: "Terreno e piso",
  technical_grade: "Grau técnico",
  route_shape: "Formato da rota",
  support_water: "Apoio e água",
  distance_shape: "Distância e formato",
  surface: "Superfície",
  trail_type: "Tipo de trilha",
  technical_difficulty: "Dificuldade técnica",
  physical_demand: "Exigência física",
  status_condition: "Estado e condição",
  bike_access: "Bicicleta e acesso",
  depth: "Profundidade",
  certification_level: "Nível de certificação",
  access_type: "Acesso",
  dive_type: "Tipo de mergulho",
  visibility: "Visibilidade",
  current: "Correnteza",
  marine_life: "Vida marinha",
  season_water_temp: "Temporada e temperatura da água",
  wind_by_month: "Vento por mês",
  best_season: "Melhor temporada",
  wind_direction: "Direção do vento",
  water_type: "Tipo de água",
  bottom_water: "Fundo e água",
  tide_current: "Maré e correnteza",
  level_discipline: "Nível e modalidade",
  hazards_launch: "Perigos e entrada na água",
  kite_wing: "Kite / Wing",
  holding: "Fundeadouro",
  protection: "Proteção",
  mooring: "Amarração",
  services: "Serviços",
  hazards_price: "Perigos e preço",
  km_by_difficulty: "Quilômetros por dificuldade",
  altitude_vertical: "Altitude e desnível",
  lifts: "Meios de elevação",
  season: "Temporada",
  snowpark: "Snowpark",
  snow_history: "Histórico de neve",
  pass_price: "Preço do passe",
  discipline: "Modalidade",
  number_of_routes: "Número de vias",
  grade_distribution: "Distribuição de graus",
  rock_type: "Tipo de rocha",
  aspect: "Orientação",
  approach: "Aproximação",
  height_protection: "Altura e proteção",
  riding_level: "Nível de equitação",
  pace: "Ritmo",
  terrain: "Terreno",
  horse_breed: "Raça do cavalo",
  riding_style: "Estilo de equitação",
  duration: "Duração",
  whats_included: "O que está incluído",
};

function humanizeKey(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  const spaced = key.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const STATUS_LABEL: Record<string, string> = {
  source_claims: "Informado pela fonte",
  estimate: "Estimativa",
};

export function SpotCard({
  spot,
  continent,
  region,
  activity,
}: {
  spot: Spot;
  continent: Continent;
  region: RegionGroup;
  activity?: Activity;
}) {
  const t = useT();
  const activityMeta = ACTIVITIES.find((a) => a.id === spot.activity);
  const activityLabel = activityMeta?.label ?? spot.activity;
  const bestMonths = spot.conditions.bestMonths ?? [];
  const specific = spot.conditions.activitySpecific ?? {};
  const fieldStatus = spot.conditions.fieldStatus ?? {};
  const specificEntries = Object.entries(specific).filter(
    ([, v]) => typeof v === "string" && v.trim().length > 0,
  );
  const sources = (
    spot.sources && spot.sources.length > 0 ? spot.sources : spot.sourceUrl ? [spot.sourceUrl] : []
  ) as string[];
  const relatedTrip = spot.relatedTripId ? findTrip(spot.relatedTripId) : null;
  const relatedArticle = spot.relatedArticleSlug ? findArticle(spot.relatedArticleSlug) : null;

  return (
    <article className="px-6 pb-24 pt-4">
      <div className="mx-auto max-w-3xl">
        {/* Header: image or placeholder */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone/10">
          {"hero_image_url" in spot &&
          (spot as unknown as { hero_image_url?: string }).hero_image_url ? (
            <img
              src={(spot as unknown as { hero_image_url: string }).hero_image_url}
              alt={spot.name}
              className="h-full w-full object-cover"
              style={{ filter: "saturate(0.5) brightness(0.9)" }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-6xl italic text-stone/40 sm:text-7xl">
                {spot.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-ink/20" />
        </div>

        {/* Name + location + activity badge */}
        <header className="mt-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              {[placeLabel(spot.city), placeLabel(spot.country)].filter(Boolean).join(", ")}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
              {spot.name}
            </h1>
          </div>
          <span
            className="mt-1 inline-flex items-center gap-2 border border-stone/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink"
            style={{ borderRadius: 2 }}
          >
            {activityMeta?.color && (
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: activityMeta.color }}
              />
            )}
            {activityLabel}
          </span>
        </header>

        {/* Best season */}
        {bestMonths.length > 0 && (
          <section className="mt-12 border-t border-stone/15 pt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Melhor época</p>
            <ul className="mt-3 space-y-1 font-serif text-xl text-ink sm:text-2xl">
              {bestMonths.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <div className="mt-6">
              <SeasonalChart />
            </div>
          </section>
        )}

        {/* Activity-specific rich fields */}
        {specificEntries.length > 0 && (
          <section className="mt-12 border-t border-stone/15 pt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Condições</p>
            <dl className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {specificEntries.map(([key, value]) => {
                const status = fieldStatus[key];
                const isUnverified = status && status !== "verified";
                const statusLabel = isUnverified
                  ? ((t.spotStatus as Record<string, string>)[status] ??
                    STATUS_LABEL[status] ??
                    status)
                  : null;
                return (
                  <div key={key} className="break-inside-avoid">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
                      {(t.spotFields as Record<string, string>)[key] ?? humanizeKey(key)}
                    </dt>
                    <dd className="mt-1.5 text-sm leading-[1.55] text-ink sm:text-base">
                      {value}
                      {statusLabel && (
                        <span
                          className="ml-1.5 inline-block cursor-help align-middle text-stone/70"
                          title={statusLabel}
                          aria-label={statusLabel}
                        >
                          *
                        </span>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </section>
        )}

        {/* Editorial description */}
        {spot.description && (
          <section className="mt-12 border-t border-stone/15 pt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Nota editorial</p>
            <p className="mt-4 font-serif text-xl leading-[1.55] text-ink sm:text-2xl">
              {spot.description}
            </p>
          </section>
        )}

        {/* Related trip CTA — visually distinct card, not a spot data section */}
        {relatedTrip && (
          <section aria-label="Viagem relacionada" className="mt-14">
            <Link
              to="/trips/$id"
              params={{ id: relatedTrip.id }}
              className="group relative block overflow-hidden border border-ink bg-ink text-paper shadow-[8px_8px_0_0_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-[45%_1fr]">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone/20 sm:aspect-auto">
                  <img
                    src={tripImage(relatedTrip, 900, 700)}
                    alt={relatedTrip.destination}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span
                    className="absolute left-3 top-3 inline-flex items-center gap-1.5 bg-paper px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink"
                    style={{ borderRadius: 2 }}
                  >
                    <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-ink" />
                    Viagem
                  </span>
                </div>
                <div className="flex flex-col justify-between gap-6 p-6 sm:p-8">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-paper/60">
                      Viaje com uma operadora
                    </p>
                    <h3 className="mt-3 font-serif text-2xl leading-tight text-paper sm:text-3xl">
                      {relatedTrip.destination}
                    </h3>
                    <p className="mt-3 text-sm leading-[1.55] text-paper/80">
                      {relatedTrip.summary}
                    </p>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-paper/15 pt-5 text-paper">
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-paper/50">
                        Operador
                      </dt>
                      <dd className="mt-1 font-serif text-sm">{relatedTrip.operator}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-paper/50">
                        Duração
                      </dt>
                      <dd className="mt-1 font-serif text-sm">{durationLabel(relatedTrip)}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-paper/50">
                        Temporada
                      </dt>
                      <dd className="mt-1 font-serif text-sm">{relatedTrip.season}</dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase tracking-[0.2em] text-paper/50">
                        Preço
                      </dt>
                      <dd className="mt-1 font-serif text-sm">{relatedTrip.price_range}</dd>
                    </div>
                  </dl>
                  <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-paper">
                    Ver viagem
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* Related journal article CTA — distinct from the Trip CTA above */}
        {relatedArticle && (
          <section aria-label="História relacionada" className="mt-10">
            <Link
              to="/journal/$slug"
              params={{ slug: relatedArticle.slug }}
              className="group block overflow-hidden border-2 border-stone/40 bg-paper transition-colors hover:border-ink"
              style={{ borderRadius: 2 }}
            >
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-stone/10">
                {relatedArticle.heroImage && (
                  <img
                    src={relatedArticle.heroImage}
                    alt={relatedArticle.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    style={{ filter: "saturate(0.7)" }}
                  />
                )}
                <span
                  className="absolute left-3 top-3 inline-flex items-center gap-1.5 border border-ink bg-paper px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-ink"
                  style={{ borderRadius: 2 }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" aria-hidden className="text-ink">
                    <path
                      d="M2 1.5h6a1 1 0 0 1 1 1v8L6 9 3 10.5v-8a1 1 0 0 1 1-1z"
                      fill="currentColor"
                    />
                  </svg>
                  Histórias · {CATEGORY_LABEL[relatedArticle.category]}
                </span>
              </div>
              <div className="px-6 py-6 sm:px-8 sm:py-7">
                <p className="text-[10px] uppercase tracking-[0.24em] text-stone">
                  Leia a história
                </p>
                <h3 className="mt-3 font-serif text-2xl italic leading-tight text-ink sm:text-3xl">
                  {relatedArticle.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.55] text-ink/75">{relatedArticle.dek}</p>
                <p className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-ink underline decoration-stone/40 underline-offset-4 group-hover:decoration-ink">
                  {relatedArticle.readTime} min de leitura
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </p>
              </div>
            </Link>
          </section>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <footer className="mt-12 border-t border-stone/15 pt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">Fontes</p>
            <ul className="mt-2 space-y-1 text-xs text-stone">
              {sources.map((url) => {
                let hostname = url;
                try {
                  hostname = new URL(url).hostname.replace(/^www\./, "");
                } catch {
                  /* keep as-is */
                }
                return (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-stone/30 underline-offset-2 hover:text-ink hover:decoration-ink"
                    >
                      {hostname}
                    </a>
                  </li>
                );
              })}
            </ul>
          </footer>
        )}

        <div className="mt-12">
          <Link
            to="/spots/$continent/$region"
            params={{ continent: continent.slug, region: region.slug }}
            search={{ activity }}
            className="text-[11px] uppercase tracking-[0.2em] text-stone hover:text-ink"
          >
            ← Voltar para {region.name}
          </Link>
        </div>
      </div>
    </article>
  );
}
