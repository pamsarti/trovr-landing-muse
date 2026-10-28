// QA is explicit in the URL and never persists into a later customer session.
export function isTrackingTest(search = typeof window === "undefined" ? "" : window.location?.search || "") {
  const query = new URLSearchParams(search);
  return query.get("trovr_qa") === "1" || /^(qa(?:_|$)|test(?:e)?(?:_|$))/i.test(query.get("utm_source") || "");
}

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_content", "utm_term"] as const;
export function getAttribution(search: string) {
  const query = new URLSearchParams(search);
  return Object.fromEntries(ATTRIBUTION_KEYS.map(key => {
    const value = query.get(key) || "";
    return [key, /^[a-zA-Z0-9_-]{1,100}$/.test(value) ? value : ""];
  }));
}

export function prepareViagemSubmission(data: FormData, search: string, submissionId: string) {
  const isTest = isTrackingTest(search);
  data.set("form-name", isTest ? "viagem-trovr-qa" : "viagem-trovr");
  data.set("is_test", String(isTest));
  data.set("submission_id", submissionId);
  for (const [key, value] of Object.entries(getAttribution(search))) data.set(key, value);
  return isTest;
}
