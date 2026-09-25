export type AnalyticsConsent = "accepted" | "rejected" | null;

export type AnalyticsEventName =
  | "select_sport"
  | "open_map"
  | "view_place"
  | "open_itinerary"
  | "submit_itinerary"
  | "newsletter_signup"
  | "read_story";

type AnalyticsParameters = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export const ANALYTICS_CONSENT_KEY = "trovr-analytics-consent-v1";
export const ANALYTICS_CONSENT_EVENT = "trovr:analytics-consent";
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() || "G-NZGWZJ5NZC";
export const CLARITY_PROJECT_ID = import.meta.env.VITE_CLARITY_PROJECT_ID?.trim() || "";

let initialized = false;

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
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
  initialized = Boolean(measurementId || clarityProjectId);
}

export function trackPageView(path: string, title = document.title) {
  if (getAnalyticsConsent() !== "accepted") return;
  const measurementId = GA_MEASUREMENT_ID;
  if (measurementId) {
    window.gtag?.("event", "page_view", {
      page_location: window.location.href,
      page_path: path,
      page_title: title,
    });
  }
}

export function trackEvent(name: AnalyticsEventName, parameters: AnalyticsParameters = {}) {
  if (getAnalyticsConsent() !== "accepted") return;
  window.gtag?.("event", name, parameters);
  window.clarity?.("event", name);
}
