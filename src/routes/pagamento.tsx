import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { verifyPaymentFn } from "@/lib/payments/functions";
import type { VerifiedPayment } from "@/lib/payments/infinitepay.server";
import { VIAGEM_PLANS, formatPlanPrice } from "@/lib/viagem-plans";
import { ANALYTICS_CONSENT_EVENT, initializeAnalytics, trackVerifiedPurchase } from "@/lib/analytics";

export const Route = createFileRoute("/pagamento")({
  head: () => ({ meta: [{ title: "Confirmação de pagamento | Trovr" },
    { name: "robots", content: "noindex, nofollow" }, { name: "referrer", content: "no-referrer" }] }),
  component: PaymentConfirmation,
});

function PaymentConfirmation() {
  const [status, setStatus] = useState("checking");
  const [payment, setPayment] = useState<VerifiedPayment | null>(null);
  const refs = useRef<{ order_nsu: string; transaction_nsu: string; slug: string } | null>(null);
  const started = useRef(false);
  const [checking, setChecking] = useState(false);
  async function check() {
    if (!refs.current) { setStatus("invalid"); return; }
    setChecking(true);
    try {
      const result = await verifyPaymentFn({ data: refs.current });
      setStatus(result.status);
      if (result.status === "paid") setPayment(result);
    } catch { setStatus("unavailable"); }
    finally { setChecking(false); }
  }
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const params = new URLSearchParams(window.location.search);
    refs.current = { order_nsu: params.get("order_nsu") || "",
      transaction_nsu: params.get("transaction_nsu") || "", slug: params.get("slug") || "" };
    // References remain in component memory only; never forward a receipt_url.
    window.history.replaceState(null, "", "/pagamento");
    void check();
  }, []);
  useEffect(() => {
    if (!payment) return;
    const measure = () => { initializeAnalytics(); trackVerifiedPurchase(payment); };
    measure();
    window.addEventListener(ANALYTICS_CONSENT_EVENT, measure);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, measure);
  }, [payment]);
  return <><SiteHeader /><main className="min-h-[70vh] bg-paper px-6 py-32 text-ink">
    <section className="mx-auto max-w-2xl" aria-live="polite">
      <p className="text-xs uppercase tracking-[0.2em]">Viagem Trovr</p>
      <h1 className="mt-5 font-serif text-4xl">{payment ? "Pagamento confirmado." :
        status === "checking" ? "Conferindo seu pagamento." : "Ainda não confirmamos seu pagamento."}</h1>
      {payment ? <>
        <p className="mt-6">{VIAGEM_PLANS[payment.plan].name} · {formatPlanPrice(payment.value)}.</p>
        <p className="mt-4">Seu pagamento foi aprovado. A produção começa com o pagamento confirmado e o briefing completo.</p>
        <p className="mt-4">{payment.plan === "premium" ?
          "O próximo passo é combinar a reunião de briefing de até 45 minutos. A entrega acontece em até 10 dias úteis após briefing completo e reunião." :
          "A entrega acontece em até 5 dias úteis após o recebimento do briefing completo e do pagamento."}</p>
      </> : status === "checking" ? <p className="mt-6">Estamos consultando a confirmação do pagamento. Aguarde um momento.</p> : <>
        <p className="mt-6">{status === "pending" ? "A InfinitePay ainda não confirmou a aprovação." :
          "Não foi possível vincular e verificar esta transação agora. Isso não significa que seu pagamento falhou."}</p>
        <p className="mt-4">Não pague novamente. Guarde seu comprovante e fale com a Trovr para conferir a transação.</p>
        <button className="mt-6 min-h-12 rounded-full bg-sage px-6 py-3 text-paper" disabled={checking} onClick={() => void check()}>
          {checking ? "Conferindo…" : "Conferir novamente"}</button>
      </>}
      <a href="/roteiro" className="mt-8 block underline">Falar com a Trovr</a>
    </section></main><SiteFooter /></>;
}
