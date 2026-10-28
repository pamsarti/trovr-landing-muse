import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { getAttribution, isTrackingTest, prepareViagemSubmission } from "./tracking-context";
import { initializeAnalytics, trackEvent, trackPageView, trackViagemCheckout, trackViagemLead, trackViagemOffer } from "./analytics";

afterEach(() => vi.unstubAllGlobals());

describe("QA isolation", () => {
  it.each(["?trovr_qa=1&utm_source=ig", "?utm_source=qa_ga_corrigido", "?utm_source=qa_e2e", "?utm_source=teste_formulario"])("never loads or calls commercial providers for %s", search => {
    vi.stubGlobal("window", { location: { search }, localStorage: { getItem: () => "accepted" }, gtag: vi.fn(), fbq: vi.fn(), clarity: vi.fn() });
    vi.stubGlobal("document", { createElement: vi.fn() });
    initializeAnalytics();
    trackPageView("/viagem" , "Viagem");
    trackViagemOffer("ViewContent", "essencial");
    trackViagemLead("essencial");
    trackEvent("submit_viagem_application");
    trackViagemCheckout("essencial");
    expect(document.createElement).not.toHaveBeenCalled();
    expect(window.gtag).not.toHaveBeenCalled();
    expect(window.fbq).not.toHaveBeenCalled();
    expect(window.clarity).not.toHaveBeenCalled();
  });

  it("keeps paid traffic real, including a campaign named teste", () => {
    expect(isTrackingTest("?utm_source=ig&utm_campaign=trovr_curadorias_teste_01")).toBe(false);
  });

  it.each([true, false])("routes submissions to the proper registered form (QA=%s)", test => {
    const data = new FormData();
    data.set("form-name", "viagem-trovr");
    prepareViagemSubmission(data, `?utm_source=ig&utm_id=120249466799260302&utm_content=120249467085120302${test ? "&trovr_qa=1" : ""}`, "opaque-submission-id");
    const formName = test ? "viagem-trovr-qa" : "viagem-trovr";
    expect(data.get("form-name")).toBe(formName);
    expect(data.get("is_test")).toBe(String(test));
    expect(data.get("submission_id")).toBe("opaque-submission-id");
    expect(data.get("utm_id")).toBe("120249466799260302");
    expect(data.get("utm_content")).toBe("120249467085120302");
    const forms = readFileSync(new URL("../../public/__forms.html", import.meta.url), "utf8");
    const declared = forms.split(`<form name="${formName}"`)[1]?.split("</form>")[0];
    expect(declared).toBeTruthy();
    for (const key of Array.from(data.keys()).filter(key => key !== "form-name")) expect(declared).toContain(`name="${key}"`);
  });

  it("keeps arbitrary personal data out of attribution", () => {
    expect(getAttribution("?utm_source=person%40example.com&utm_campaign=valid-id")).toMatchObject({ utm_source: "", utm_campaign: "valid-id" });
  });
});
