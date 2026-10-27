import { describe, expect, it, vi } from "vitest";
import { ORDER_TTL, createCheckout, validCheckoutUrl, verifyPayment, type PaymentOrder } from "./infinitepay.server";

const order: PaymentOrder = { id: "21b0c66a-a16b-4800-a617-e13ebf3901fe", plan: "essencial", createdAt: Date.now() };
const refs = { order_nsu: order.id, transaction_nsu: "transaction-123456", slug: "invoice123" };
const approved = { success: true, paid: true, amount: 49900, paid_amount: 49900, installments: 1, capture_method: "credit_card" };
const responding = (result: unknown, status = 200) => vi.fn(async () => Response.json(result, { status })) as unknown as typeof fetch;

describe("InfinitePay verification boundary", () => {
  it("confirms only a provider-approved payment matching the signed order", async () => {
    const request = responding(approved);
    expect(await verifyPayment(order, refs, request, "test-server-key")).toEqual({ status: "paid", plan: "essencial", value: 499, currency: "BRL", transactionId: refs.transaction_nsu });
    expect(request).toHaveBeenCalledWith("https://api.checkout.infinitepay.io/payment_check", expect.objectContaining({ method: "POST", cache: "no-store" }));
    expect(vi.mocked(request).mock.calls[0][1]?.headers).toMatchObject({ "X-Api-Key": "test-server-key" });
  });
  it.each([undefined, { ...order, createdAt: Date.now() - ORDER_TTL - 1000 }])("rejects missing or expired order before provider access", async (saved) => {
    const request = responding(approved);
    expect(await verifyPayment(saved, refs, request)).toEqual({ status: "invalid" });
    expect(request).not.toHaveBeenCalled();
  });
  it("rejects an unrelated order reference", async () => {
    const request = responding(approved);
    expect(await verifyPayment(order, { ...refs, order_nsu: "another-order" }, request)).toEqual({ status: "invalid" });
    expect(request).not.toHaveBeenCalled();
  });
  it.each([
    { ...approved, amount: 149900 },
    { ...approved, paid_amount: 0 },
    { ...approved, paid_amount: 50000 },
    { ...approved, installments: 13 },
    { ...approved, installments: 1.5 },
    { ...approved, capture_method: "unknown" },
  ])("does not acknowledge incompatible amount or payment conditions", async (result) => {
    expect(await verifyPayment(order, refs, responding(result))).toEqual({ status: "invalid" });
  });
  it("keeps pending and failed provider requests distinct from paid", async () => {
    expect(await verifyPayment(order, refs, responding({ ...approved, paid: false }))).toEqual({ status: "pending" });
    expect(await verifyPayment(order, refs, responding(approved, 503))).toEqual({ status: "unavailable" });
    expect(await verifyPayment(order, refs, vi.fn().mockRejectedValue(new Error("timeout")))).toEqual({ status: "unavailable" });
  });
  it("accepts Premium only in 1–2 interest-free installments", async () => {
    const premium = { ...order, plan: "premium" as const };
    const result = { ...approved, amount: 149900, paid_amount: 149900 };
    for (const installments of [1, 2]) {
      expect((await verifyPayment(premium, refs, responding({ ...result, installments }))).status).toBe("paid");
    }
    for (const installments of [3, 8, 12]) {
      expect((await verifyPayment(premium, refs, responding({ ...result, installments }))).status).toBe("invalid");
    }
    expect((await verifyPayment(premium, refs, responding({ ...result, installments: 2, paid_amount: 159452 }))).status).toBe("invalid");
  });
  it("accepts Essencial only in 1 interest-free installment", async () => {
    for (const installments of [2, 8, 12]) {
      expect((await verifyPayment(order, refs, responding({ ...approved, installments }))).status).toBe("invalid");
    }
    expect((await verifyPayment(order, refs, responding({ ...approved, paid_amount: 55000 }))).status).toBe("invalid");
  });
  it("accepts Pix only at the exact one-time price", async () => {
    expect((await verifyPayment(order, refs, responding({ ...approved, capture_method: "pix" }))).status).toBe("paid");
    expect((await verifyPayment(order, refs, responding({ ...approved, capture_method: "pix", installments: 2 }))).status).toBe("invalid");
  });
  it("does not accept an attacker checkout URL", async () => {
    for (const url of ["https://evil.example/pay", "https://checkout.infinitepay.io.evil.example/pay", "http://checkout.infinitepay.io/pamela-sarti/test", "https://checkout.infinitepay.io/other/test"]) {
      expect(validCheckoutUrl(url)).toBe(false);
      await expect(createCheckout(order, "test-key", "https://trovr.com.br", responding({ url }))).rejects.toThrow("checkout_unavailable");
    }
  });
  it.each([["essencial", 49900, 1], ["premium", 149900, 2]] as const)("creates the %s checkout with the approved fee threshold and no lead PII", async (plan, price, interestFreeInstallments) => {
    const request = responding({ url: "https://checkout.infinitepay.io/pamela-sarti/test" });
    await createCheckout({ ...order, plan }, "test-key", "https://trovr.com.br", request);
    const [, options] = vi.mocked(request).mock.calls[0];
    const body = JSON.parse(String(options?.body));
    expect(body).toMatchObject({ order_nsu: order.id, redirect_url: "https://trovr.com.br/pagamento", items: [{ price, quantity: 1 }], options: { single_payment: true, assured_installments: interestFreeInstallments } });
    expect(body.customer).toBeUndefined();
    expect(body.address).toBeUndefined();
  });
});
