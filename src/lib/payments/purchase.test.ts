import { afterEach, describe, expect, it, vi } from "vitest";
import { META_PIXEL_ID, trackVerifiedPurchase } from "../analytics";
afterEach(() => vi.unstubAllGlobals());
const payment = { status: "paid" as const, plan: "essencial" as const, value: 499, currency: "BRL" as const, transactionId: "verified-transaction-123456" };
function browser(consent: string | null) {
  const storage = new Map<string, string>();
  const result = { localStorage: { getItem: (key: string) => key.startsWith("trovr-analytics-consent") ? consent : storage.get(key), setItem: (key: string, value: string) => storage.set(key, value) }, fbq: vi.fn(), gtag: vi.fn() };
  vi.stubGlobal("window", result);
  return result;
}
describe("verified Purchase measurement", () => {
  it.each([null, "rejected"])("does not send a purchase without accepted consent: %s", (consent) => {
    const w = browser(consent);
    trackVerifiedPurchase(payment);
    expect(w.fbq).not.toHaveBeenCalled(); expect(w.gtag).not.toHaveBeenCalled();
  });
  it("does not measure a mismatched plan price", () => {
    const w = browser("accepted");
    trackVerifiedPurchase({ ...payment, value: 1 });
    expect(w.fbq).not.toHaveBeenCalled();
  });
  it("uses stable Meta and GA transaction identifiers and suppresses repeated callbacks", () => {
    const w = browser("accepted");
    trackVerifiedPurchase(payment); trackVerifiedPurchase(payment);
    expect(w.fbq).toHaveBeenCalledExactlyOnceWith("trackSingle", META_PIXEL_ID, "Purchase", { content_name: "Curadoria Essencial", value: 499, currency: "BRL" }, { eventID: `trovr_purchase_${payment.transactionId}` });
    expect(w.gtag).toHaveBeenCalledExactlyOnceWith("event", "purchase", expect.objectContaining({ transaction_id: payment.transactionId, value: 499 }));
  });
});
