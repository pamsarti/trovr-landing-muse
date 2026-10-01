export type AnalyticsConsent = "accepted" | "rejected" | null;

export type AnalyticsEventName =
  | "select_sport"
  | "open_map"
  | "view_place"
  | "open_itinerary"
  | "open_contact"
  | "submit_itinerary"
  | "submit_contact"
  | "newsletter_signup"
  | "read_story"
  | "read_article"
  | "open_welcome_wall"
  | "close_welcome_wall"
  | "complete_compass_quiz"
  | "compass_lead_capture"
  | "select_compass_plan"
  | "open_viagem_offer"
  | "start_viagem_application"
  | "advance_viagem_application"
  | "submit_viagem_application";

type AnalyticsParameters = Record<string, string | number | boolean | undefined>;
type MetaPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[][];
  push?: MetaPixel;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
    fbq?: MetaPixel;
    _fbq?: MetaPixel;
  }
}

// Ask again because optional advertising measurement is newly included.
export const ANALYTICS_CONSENT_KEY = "trovr-analytics-consent-v2";
export const ANALYTICS_CONSENT_EVENT = "trovr:analytics-consent";
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-NZGWZJ5NZC";
export const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim() || "yo0000fhi9";
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID?.trim() || "1532952792196130";

let initialized = false;

function loadMetaPixel(pixelId: string) {
  if (document.querySelector(`script[data-trovr-meta="${pixelId}"]`)) return;
  const fbq: MetaPixel = window.fbq ?? Object.assign((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  }, { queue: [] as unknown[][], loaded: true, version: "2.0" });
  fbq.push = fbq;
  window.fbq = fbq;
  window._fbq = fbq;
  // Explicit events only: no automatic button/form capture or advanced matching.
  fbq("set", "autoConfig", false, pixelId);
  fbq("consent", "grant");
  fbq("init", pixelId);
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset.trovrMeta = pixelId;
  document.head.appendChild(script);
}

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  if (value === "rejected") window.fbq?.("consent", "revoke");
  window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
}

function loadGoogleAnalytics(measurementId: string) {
  if (document.querySelector(`script[data-trovr-ga="${measurementId}"]`)) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
    send_page_view: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.trovrGa = measurementId;
  document.head.appendChild(script);
}

function loadClarity(projectId: string) {
  if (document.querySelector(`script[data-trovr-clarity="${projectId}"]`)) return;

  const clarity = (...args: unknown[]) => {
    const queue = (clarity as typeof clarity & { q?: unknown[] }).q ?? [];
    queue.push(args);
    (clarity as typeof clarity & { q?: unknown[] }).q = queue;
  };
  window.clarity = clarity;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${encodeURIComponent(projectId)}`;
  script.dataset.trovrClarity = projectId;
  document.head.appendChild(script);
}

export function initializeAnalytics() {
  if (initialized || typeof window === "undefined" || getAnalyticsConsent() !== "accepted") return;

  const measurementId = GA_MEASUREMENT_ID;
  const clarityProjectId = CLARITY_PROJECT_ID;

  if (measurementId) loadGoogleAnalytics(measurementId);
  if (clarityProjectId) loadClarity(clarityProjectId);
  if (META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
  initialized = Boolean(measurementId || clarityProjectId || META_PIXEL_ID);
}

export function trackPageView(path: string, title = document.title) {
  if (getAnalyticsConsent() !== "accepted") return;
  window.fbq?.("trackSingle", META_PIXEL_ID, "PageView");
  const measurementId = GA_MEASUREMENT_ID;
  if (measurementId) {
    const query = new URLSearchParams(path.split("?")[1]?.split("#")[0] || "");
    const campaign: Record<string, string> = {};
    for (const key of ["source", "medium", "campaign", "content", "term"] as const) {
      const value = query.get(`utm_${key}`);
      // Campaign identifiers are deliberately constrained; arbitrary query data
      // and email addresses must not be forwarded to analytics.
      if (value && /^[a-zA-Z0-9_-]{1,100}$/.test(value)) {
        campaign[key === "campaign" ? "campaign_name" : `campaign_${key}`] = value;
      }
    }
    window.gtag?.("event", "page_view", {
      ...campaign,
      page_location: `${window.location.origin}${path.split(/[?#]/)[0]}`,
      page_path: path.split(/[?#]/)[0],
      page_title: title,
    });
  }
}

// A request is a lead, not a purchase. Never send the travel budget as revenue,
// or pass names, email addresses or free-text briefing to analytics.
export function trackViagemLead() {
  if (getAnalyticsConsent() !== "accepted") return;
  window.fbq?.("trackSingle", META_PIXEL_ID, "Lead", { content_name: "Viagem Trovr" });
  window.gtag?.("event", "generate_lead", {
    form_name: "viagem_trovr",
    lead_source: "website",
  });
}

export function trackEvent(name: AnalyticsEventName, parameters: AnalyticsParameters = {}) {
  if (getAnalyticsConsent() !== "accepted") return;
  window.gtag?.("event", name, parameters);
  window.clarity?.("event", name);
}
