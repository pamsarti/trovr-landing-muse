import { Link } from "@tanstack/react-router";
import {
  ACTIVITIES,
  type Activity,
  type Spot,
  type Continent,
  type RegionGroup,
} from "@/lib/spots-data";

/** Placeholder for a future seasonal chart driven by bestMonths. */
function SeasonalChart() {
  return (
    <div
      role="img"
      aria-label="Seasonal chart placeholder"
      className="flex h-24 items-center justify-center border border-dashed border-stone/30 bg-stone/[0.03] text-[10px] uppercase tracking-[0.2em] text-stone/60"
    >
      Seasonal chart · coming soon
    </div>
  );
}

const KEY_LABELS: Record<string, string> = {
  tipo_break: "Tipo de break",
  tipo_fundo: "Tipo de fundo",
  nivel_recomendado: "Nível recomendado",
  swell_ideal: "Swell ideal",
  vento_ideal: "Vento ideal",
  mare_ideal: "Maré ideal",
  perigos: "Perigos",
  lotacao: "Lotação",
  temporada: "Temporada",
  temperatura_agua: "Temperatura da água",
  temperatura_ar: "Temperatura do ar",
  acesso: "Acesso",
  vento_forca: "Força do vento",
  vento_direcao: "Direção do vento",
};

function humanizeKey(key: string): string {
  if (KEY_LABELS[key]) return KEY_LABELS[key];
  const spaced = key.replace(/_/g, " ").trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

const STATUS_LABEL: Record<string, string> = {
  fonte_afirma: "fonte afirma",
  estimativa: "estimativa",
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
  const activityMeta = ACTIVITIES.find((a) => a.id === spot.activity);
  const activityLabel = activityMeta?.label ?? spot.activity;
  const bestMonths = spot.conditions.bestMonths ?? [];
  const specific = spot.conditions.activitySpecific ?? {};
  const fieldStatus = spot.conditions.fieldStatus ?? {};
  const specificEntries = Object.entries(specific).filter(
    ([, v]) => typeof v === "string" && v.trim().length > 0,
  );
  const sources = (spot.sources && spot.sources.length > 0
    ? spot.sources
    : spot.sourceUrl
      ? [spot.sourceUrl]
      : []) as string[];

  return (
    <article className="px-6 pb-24 pt-4">
      <div className="mx-auto max-w-3xl">
        {/* Header: image or placeholder */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-stone/10">
          {"hero_image_url" in spot && (spot as unknown as { hero_image_url?: string }).hero_image_url ? (
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
              {[spot.city, spot.country].filter(Boolean).join(", ")}
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              Melhor época
            </p>
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              Condições
            </p>
            <dl className="mt-4 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              {specificEntries.map(([key, value]) => {
                const status = fieldStatus[key];
                const isUnverified = status && status !== "verificado";
                const statusLabel = isUnverified
                  ? STATUS_LABEL[status] ?? status
                  : null;
                return (
                  <div key={key} className="break-inside-avoid">
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-stone">
                      {humanizeKey(key)}
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
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              Nota editorial
            </p>
            <p className="mt-4 font-serif text-xl leading-[1.55] text-ink sm:text-2xl">
              {spot.description}
            </p>
          </section>
        )}

        {/* Sources */}
        {sources.length > 0 && (
          <footer className="mt-12 border-t border-stone/15 pt-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-stone">
              Fontes
            </p>
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
            ← Back to {region.name}
          </Link>
        </div>
      </div>
    </article>
  );
}