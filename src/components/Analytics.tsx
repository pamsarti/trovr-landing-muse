import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  initializeAnalytics,
  setAnalyticsConsent,
  trackEvent,
  trackPageView,
  type AnalyticsConsent,
  type AnalyticsEventName,
} from "@/lib/analytics";

const hasAnalyticsProviders = Boolean(
  import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || import.meta.env.VITE_CLARITY_PROJECT_ID?.trim(),
);

export function AnalyticsManager() {
  const location = useRouterState({
    select: (state) => `${state.location.pathname}${state.location.searchStr || ""}`,
  });
  const [consent, setConsent] = useState<AnalyticsConsent>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    if (!hasAnalyticsProviders) return;
    const updateConsent = () => setConsent(getAnalyticsConsent());
    updateConsent();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, updateConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, updateConsent);
  }, []);

  useEffect(() => {
    if (consent !== "accepted") return;
    initializeAnalytics();
    const timer = window.setTimeout(() => trackPageView(location), 0);
    return () => window.clearTimeout(timer);
  }, [consent, location]);

  useEffect(() => {
    if (consent !== "accepted") return;
    const onClick = (event: MouseEvent) => {
      const target =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-analytics-event]")
          : null;
      if (!target) return;
      const name = target.dataset.analyticsEvent as AnalyticsEventName | undefined;
      if (!name) return;
      trackEvent(name, {
        item_name: target.dataset.analyticsName,
        item_category: target.dataset.analyticsCategory,
        link_url: target instanceof HTMLAnchorElement ? target.href : undefined,
      });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [consent]);

  if (!hasAnalyticsProviders) return null;

  const choose = (value: Exclude<AnalyticsConsent, null>) => {
    const previousConsent = getAnalyticsConsent();
    setAnalyticsConsent(value);
    setConsent(value);
    setShowPreferences(false);

    if (previousConsent === "accepted" && value === "rejected") {
      window.location.reload();
    }
  };

  if (consent && !showPreferences) {
    return (
      <button
        type="button"
        onClick={() => setShowPreferences(true)}
        className="fixed bottom-3 left-3 z-[70] rounded-full border border-coffee/20 bg-paper/90 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-coffee shadow-sm backdrop-blur hover:text-ink"
      >
        Privacidade
      </button>
    );
  }

  return (
    <aside
      className="fixed inset-x-4 bottom-4 z-[80] mx-auto max-w-3xl rounded-sm border border-paper/20 bg-ink p-5 text-paper shadow-2xl sm:p-6"
      aria-label="Preferências de privacidade"
      role="dialog"
      aria-modal="false"
    >
      <p className="font-serif text-2xl">Sua privacidade importa.</p>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/80">
        Usamos métricas opcionais para entender visitas, cliques e como melhorar a Trovr. Elas só
        são ativadas com sua autorização. Você pode mudar sua escolha a qualquer momento.
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => choose("accepted")}
          className="rounded-full bg-sage px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-paper hover:bg-terracotta"
        >
          Aceitar métricas
        </button>
        <button
          type="button"
          onClick={() => choose("rejected")}
          className="rounded-full border border-paper/50 px-5 py-2.5 text-xs uppercase tracking-[0.14em] text-paper hover:bg-paper hover:text-ink"
        >
          Recusar
        </button>
        <a href="/privacidade" className="text-xs underline underline-offset-4 text-paper/80">
          Ler política de privacidade
        </a>
      </div>
    </aside>
  );
}
