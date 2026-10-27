import { VIAGEM_PLANS, type ViagemPlan } from "../viagem-plans";

export type PaymentOrder = {
  id: string;
  plan: ViagemPlan;
  createdAt: number;
  checkoutUrl?: string;
  paid?: boolean;
};
export type PaymentReference = { order_nsu: string; transaction_nsu: string; slug: string };
export type VerifiedPayment = {
  status: "paid";
  plan: ViagemPlan;
  value: number;
  currency: "BRL";
  transactionId: string;
};
const API = "https://api.checkout.infinitepay.io";
export const ORDER_TTL = 24 * 60 * 60 * 1000;

export function validOrder(order: PaymentOrder | undefined, now = Date.now()) {
  return !!order && ["essencial", "premium"].includes(order.plan) &&
    /^[a-zA-Z0-9-]{16,80}$/.test(order.id) && Number.isFinite(order.createdAt) &&
    now >= order.createdAt && now - order.createdAt < ORDER_TTL;
}

export function validCheckoutUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.infinitepay.io" &&
      !url.username && !url.password && !url.port && url.pathname.startsWith("/pamela-sarti/");
  } catch { return false; }
}

// Never trust a callback's status, price, plan, receipt URL, or webhook payload.
// The order comes from the encrypted first-party session; refs are verified by the provider.
export async function verifyPayment(
  order: PaymentOrder | undefined,
  refs: PaymentReference,
  request: typeof fetch = fetch,
  apiKey?: string,
): Promise<VerifiedPayment | { status: "pending" | "unavailable" | "invalid" }> {
  if (!validOrder(order) || !order || refs.order_nsu !== order.id ||
      !/^[a-zA-Z0-9-]{8,100}$/.test(refs.transaction_nsu) ||
      !/^[a-zA-Z0-9_-]{3,100}$/.test(refs.slug)) return { status: "invalid" };
  try {
    const response = await request(`${API}/payment_check`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey ? { "X-Api-Key": apiKey } : {}) },
      body: JSON.stringify({ handle: "pamela-sarti", ...refs }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) return { status: "unavailable" };
    const result = await response.json();
    if (result.success !== true) return { status: "unavailable" };
    if (result.paid !== true) return { status: "pending" };
    const cents = VIAGEM_PLANS[order.plan].price * 100;
    const maximum = VIAGEM_PLANS[order.plan].maxInstallments;
    if (result.amount !== cents || !Number.isInteger(result.paid_amount) ||
        result.paid_amount < cents || !Number.isInteger(result.installments) ||
        result.installments < 1 || result.installments > maximum ||
        !["pix", "credit_card"].includes(result.capture_method) ||
        (result.capture_method === "pix" && result.installments !== 1) ||
        (result.installments <= VIAGEM_PLANS[order.plan].interestFreeInstallments && result.paid_amount !== cents)) {
      return { status: "invalid" };
    }
    return { status: "paid", plan: order.plan, value: cents / 100, currency: "BRL",
      transactionId: refs.transaction_nsu };
  } catch { return { status: "unavailable" }; }
}

export async function createCheckout(order: PaymentOrder, apiKey: string, origin: string, request: typeof fetch = fetch) {
  const item = VIAGEM_PLANS[order.plan];
  const response = await request(`${API}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({
      order_nsu: order.id,
      items: [{ quantity: 1, price: item.price * 100, description: item.name }],
      redirect_url: `${origin}/pagamento`,
      options: { assured_installments: item.interestFreeInstallments,
        require_delivery_address: false, single_payment: true },
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error("checkout_unavailable");
  const result = await response.json();
  if (!validCheckoutUrl(result.url)) throw new Error("checkout_unavailable");
  return result.url as string;
}
