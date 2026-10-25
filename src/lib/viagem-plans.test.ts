import { describe, expect, it, vi, afterEach } from "vitest";
import { readFileSync } from "node:fs";
import { VIAGEM_PLANS } from "./viagem-plans";
import { trackViagemOffer, trackViagemLead, META_PIXEL_ID } from "./analytics";
afterEach(() => vi.unstubAllGlobals());
describe("curadoria contracts", () => {
  it("keeps both prices and Netlify fields consistent", () => {
    expect(VIAGEM_PLANS.essencial.price).toBe(499);
    expect(VIAGEM_PLANS.premium.price).toBe(1499);
    const schema = readFileSync("public/__forms.html", "utf8");
    for (const field of ["plan", "price", "currency"]) expect(schema).toContain(`name="${field}"`);
    const page = readFileSync("src/routes/viagem.tsx", "utf8");
    expect(page).not.toMatch(/1\.990|1990|quatro rodadas|10 a 15|30 minutos/);
    expect(VIAGEM_PLANS.essencial.paymentUrl).toBeNull();
    expect(VIAGEM_PLANS.premium.paymentUrl).toBeNull();
  });
  it.each(["rejected", null])("blocks offer and lead events without consent %s", (consent) => {
    vi.stubGlobal("window", {
      localStorage: { getItem: () => consent },
      fbq: vi.fn(),
      gtag: vi.fn(),
    });
    trackViagemOffer("ViewContent");
    trackViagemOffer("SelectPlan", "premium");
    trackViagemLead("premium");
    expect(window.fbq).not.toHaveBeenCalled();
    expect(window.gtag).not.toHaveBeenCalled();
  });
  it("uses a custom selection event and never starts checkout or purchase", () => {
    vi.stubGlobal("window", {
      localStorage: { getItem: () => "accepted" },
      fbq: vi.fn(),
      gtag: vi.fn(),
    });
    trackViagemOffer("SelectPlan", "premium");
    expect(window.fbq).toHaveBeenCalledExactlyOnceWith(
      "trackSingleCustom",
      META_PIXEL_ID,
      "SelectPlan",
      { content_name: "Viagem Trovr", plan: "premium", value: 1499, currency: "BRL" },
    );
    trackViagemLead("premium");
    expect(JSON.stringify((window.fbq as ReturnType<typeof vi.fn>).mock.calls)).not.toMatch(
      /Purchase|InitiateCheckout/,
    );
  });
});
