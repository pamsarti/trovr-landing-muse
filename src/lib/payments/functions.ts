import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

async function paymentSession() {
  const { useSession } = await import("@tanstack/react-start/server");
  const secret = process.env.PAYMENT_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("payment_not_configured");
  return useSession<{ orders?: import("./infinitepay.server").PaymentOrder[] }>({
    name: "trovr_payment", password: secret, maxAge: 24 * 60 * 60,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" },
  });
}

export const beginPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ plan: z.enum(["essencial", "premium"]) }))
  .handler(async ({ data }) => {
    // Enable only after verifying the approved Sem Antecipação conditions:
    // Essencial in 1 installment, Premium in up to 2, both without buyer interest.
    if (process.env.INFINITEPAY_CHECKOUT_ENABLED !== "true" ||
        process.env.INFINITEPAY_INSTALLMENT_LIMITS_VERIFIED !== "true") {
      return { status: "unavailable" as const };
    }
    const apiKey = process.env.INFINITEPAY_API_KEY?.trim();
    const origin = process.env.APP_URL?.replace(/\/$/, "");
    if (!apiKey || origin !== "https://trovr.com.br") return { status: "unavailable" as const };
    try {
      const { validOrder, validCheckoutUrl, createCheckout } = await import("./infinitepay.server");
      const session = await paymentSession();
      const orders = (session.data.orders || []).filter((order) => validOrder(order));
      const previous = orders.find((order) => order.plan === data.plan && !order.paid);
      if (previous && validCheckoutUrl(previous.checkoutUrl)) {
        return { status: "ready" as const, url: previous.checkoutUrl };
      }
      const order = { id: crypto.randomUUID(), plan: data.plan, createdAt: Date.now() };
      // Persist the order before requesting a link. An ambiguous timeout must not be retried
      // automatically because that could create a duplicate checkout.
      if (previous || orders.length >= 4) return { status: "unavailable" as const };
      await session.update({ orders: [...orders, order] });
      const url = await createCheckout(order, apiKey, origin);
      await session.update({ orders: [...orders, { ...order, checkoutUrl: url }] });
      return { status: "ready" as const, url };
    } catch { return { status: "unavailable" as const }; }
  });

export const verifyPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({ order_nsu: z.string().max(80), transaction_nsu: z.string().max(100), slug: z.string().max(100) }))
  .handler(async ({ data }) => {
    try {
      const session = await paymentSession();
      const { verifyPayment } = await import("./infinitepay.server");
      const orders = session.data.orders || [];
      const order = orders.find((item) => item.id === data.order_nsu);
      const result = await verifyPayment(order, data, fetch, process.env.INFINITEPAY_API_KEY?.trim());
      if (result.status === "paid") await session.update({ orders: orders.map((item) =>
        item.id === data.order_nsu ? { ...item, paid: true } : item) });
      return result;
    } catch { return { status: "unavailable" as const }; }
  });
