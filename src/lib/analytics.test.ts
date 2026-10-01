import { afterEach, describe, expect, it, vi } from "vitest";
import { META_PIXEL_ID, initializeAnalytics, trackPageView, trackViagemLead } from "./analytics";

afterEach(() => vi.unstubAllGlobals());

function browser(consent: string | null) {
  const gtag = vi.fn();
  vi.stubGlobal("window", {
    localStorage: { getItem: () => consent },
    location: { origin: "https://trovr.com.br" },
    gtag,
    fbq: vi.fn(),
  });
  return gtag;
}

describe("commercial measurement", () => {
  it.each([null, "rejected"])("does not send leads without consent: %s", (consent) => {
    expect(browser(consent)).not.toHaveBeenCalled();
    trackViagemLead();
    expect(window.gtag).not.toHaveBeenCalled();
    expect(window.fbq).not.toHaveBeenCalled();
  });

  it("sends a lead without personal data or invented revenue", () => {
    const gtag = browser("accepted");
    trackViagemLead();
    expect(gtag).toHaveBeenCalledExactlyOnceWith("event", "generate_lead", {
      form_name: "viagem_trovr", lead_source: "website",
    });
    expect(window.fbq).toHaveBeenCalledExactlyOnceWith("trackSingle", META_PIXEL_ID, "Lead", {
      content_name: "Viagem Trovr",
    });
  });

  it("does not send arbitrary URL parameters or fragments", () => {
    const gtag = browser("accepted");
    trackPageView("/viagem?email=private@example.com#candidatura", "Viagem Trovr");
    expect(gtag).toHaveBeenCalledWith("event", "page_view", {
      page_location: "https://trovr.com.br/viagem", page_path: "/viagem", page_title: "Viagem Trovr",
    });
  });

  it("does not load providers before consent", () => {
    browser(null);
    vi.stubGlobal("document", { createElement: vi.fn() });
    initializeAnalytics();
    expect(document.createElement).not.toHaveBeenCalled();
  });

  it("sends a Meta page view after consent only", () => {
    browser("accepted");
    trackPageView("/viagem", "Viagem Trovr");
    expect(window.fbq).toHaveBeenCalledExactlyOnceWith("trackSingle", META_PIXEL_ID, "PageView");
  });
});
