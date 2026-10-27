import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Compass,
  MessageCircle,
  Route as RouteIcon,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  ANALYTICS_CONSENT_EVENT,
  getAnalyticsConsent,
  trackViagemOffer,
  trackEvent,
  trackViagemLead,
  trackViagemCheckout,
} from "@/lib/analytics";
import { VIAGEM_PLANS, formatPlanPrice, type ViagemPlan } from "@/lib/viagem-plans";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Roteiro de viagem personalizado e fora do óbvio | Trovr";
const DESCRIPTION =
  "Curadoria personalizada para sua viagem: Essencial por R$ 499 ou Premium por R$ 1.499. Descubra destinos ou planeje seu roteiro fora do óbvio.";

const FAQ = [
  {
    question: "Como faço o pagamento da curadoria?",
    answer:
      "Após enviar o formulário, você acessa o checkout seguro da InfinitePay para pagar com Pix ou cartão. Essencial: R$ 499, em 1x sem juros ou de 2 a 12x com juros. Premium: R$ 1.499, em até 2x sem juros ou de 3 a 12x com juros. O total com juros é informado no checkout antes de você pagar. A produção começa após a confirmação do pagamento e o recebimento das informações necessárias; na Premium, também há reunião de briefing.",
  },
  {
    question: "Como funcionam os ajustes e o suporte?",
    answer:
      "A Essencial inclui uma rodada de esclarecimentos. A Premium inclui até 2 rodadas de ajustes e suporte para dúvidas por 15 dias após entrega. Nenhuma modalidade inclui concierge durante a viagem ou alterações ilimitadas.",
  },
  {
    question: "O que é a Viagem Trovr?",
    answer:
      "É um serviço de curadoria e roteiro de viagem personalizado. A Trovr transforma seu momento, preferências, datas e orçamento em uma viagem possível, com experiências fora do óbvio, hospedagens, restaurantes, deslocamentos e caminhos para reservar.",
  },
  {
    question: "Preciso saber para onde quero viajar?",
    answer:
      "Não. Você pode chegar com um destino definido, algumas possibilidades ou apenas com o que deseja viver. A curadoria também serve para encontrar uma direção de viagem coerente com você.",
  },
  {
    question: "A Trovr faz as reservas?",
    answer:
      "Nesta fase, não. A Trovr recomenda opções e mostra caminhos para reservar, mas passagens, hospedagens, experiências, pagamentos e disponibilidade ficam sob responsabilidade do viajante e dos fornecedores escolhidos.",
  },
  {
    question: "Quanto custa um roteiro personalizado?",
    answer:
      "A Curadoria Essencial custa R$ 499 e a Premium R$ 1.499, em pagamento único. Ambas contemplam inicialmente até dois viajantes com o mesmo roteiro. Escopos mais complexos são avaliados separadamente, antes da contratação.",
  },
  {
    question: "Em quanto tempo recebo minha viagem?",
    answer:
      "Essencial: documento digital em até 5 dias úteis após briefing e pagamento. Premium: página privada e PDF em até 10 dias úteis após briefing completo e reunião de até 45 minutos.",
  },
];

export const Route = createFileRoute("/viagem")({
  // Keep the default out of the URL so /viagem remains a 200 canonical page.
  // Explicit visual variants still work; the component supplies the default.
  validateSearch: (search: Record<string, unknown>): { visual?: "alula" | "mar" } =>
    search.visual === undefined ? {} : { visual: search.visual === "mar" ? "mar" : "alula" },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/viagem` },
      { property: "og:image", content: `${SITE_URL}/images/seychelles-island-5039305.webp` },
      {
        property: "og:image:alt",
        content: "Ilha rochosa cercada por mar turquesa em Seychelles — Trovr",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/images/seychelles-island-5039305.webp` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/viagem` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Viagem Trovr — roteiro de viagem personalizado",
            serviceType: "Curadoria e planejamento personalizado de viagem",
            description: DESCRIPTION,
            provider: {
              "@type": "Organization",
              "@id": `${SITE_URL}/#organization`,
              name: "Trovr",
              url: SITE_URL,
            },
            areaServed: "BR",
            offers: Object.entries(VIAGEM_PLANS).map(([id, plan]) => ({
              "@type": "Offer",
              name: plan.name,
              price: plan.price,
              priceCurrency: "BRL",
              url: `${SITE_URL}/viagem#${id}`,
              description: `${plan.description} ${plan.items.join(" ")} ${plan.exclusions}`,
            })),
            url: `${SITE_URL}/viagem`,
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Trovr", item: SITE_URL },
              {
                "@type": "ListItem",
                position: 2,
                name: "Viagem Trovr",
                item: `${SITE_URL}/viagem`,
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          },
        ]),
      },
    ],
  }),
  component: ViagemPage,
});

const INCLUDED = [
  "Essencial: sugestões de destinos, atividades e hospedagens, operadores e estimativa geral de orçamento em documento digital.",
  "Premium: roteiro dia a dia de até 10 dias, experiências, hospedagens comparadas, logística e orçamento detalhado em página privada e PDF.",
  "Essencial: uma rodada de esclarecimentos. Premium: até 2 rodadas de ajustes e suporte para dúvidas por 15 dias após entrega.",
];

const STEPS = [
  [
    "01",
    "Você conta o que quer viver",
    "O formulário organiza momento, companhia, datas, orçamento e desejos — mesmo que o destino ainda não esteja definido.",
  ],
  [
    "02",
    "Você escolhe como começar",
    "Na Essencial, o briefing é por formulário. Na Premium, aprofundamos o briefing em uma reunião de até 45 minutos. Após enviar o formulário, você acessa o pagamento seguro. A produção começa com pagamento confirmado e informações completas.",
  ],
  [
    "03",
    "A Trovr constrói a viagem",
    "Essencial: entrega em até 5 dias úteis após briefing e pagamento. Premium: até 10 dias úteis após briefing completo e reunião, em página privada e PDF.",
  ],
  [
    "04",
    "A viagem continua com você",
    "Você faz as reservas diretamente e conta com a Trovr para dúvidas e ajustes dentro do suporte contratado.",
  ],
];

function ViagemPage() {
  const { visual = "alula" } = Route.useSearch();
  const [plan, setPlan] = useState<ViagemPlan | "">("");
  const selected = plan ? VIAGEM_PLANS[plan] : null;
  const viewed = useRef(false);
  const inFlight = useRef(false);
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.sessionStorage.getItem("trovr-viagem-plan");
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
    if (saved === "essencial" || saved === "premium") setPlan(saved);
    const observeOffer = () => {
      if (!viewed.current && getAnalyticsConsent() === "accepted") {
        viewed.current = true;
        trackViagemOffer("ViewContent");
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) observeOffer();
    });
    const element = document.getElementById("modalidades");
    if (element) observer.observe(element);
    const onConsent = () => {
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) observeOffer();
      }
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    return () => {
      observer.disconnect();
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    };
  }, []);
  const choosePlan = (value: ViagemPlan) => {
    setPlan(value);
    try {
      window.sessionStorage.setItem("trovr-viagem-plan", value);
    } catch {
      /* The in-memory selection still works. */
    }
    trackViagemOffer("SelectPlan", value);
  };
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [submittedPlan, setSubmittedPlan] = useState<ViagemPlan | null>(null);
  const completedPlan = submittedPlan ? VIAGEM_PLANS[submittedPlan] : null;
  const confirmationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!done) return;
    confirmationRef.current?.focus({ preventScroll: true });
    confirmationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [done]);
  const [error, setError] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const focusNextStep = useRef(false);

  useEffect(() => {
    if (!focusNextStep.current) return;
    focusNextStep.current = false;
    const step = formRef.current?.querySelector<HTMLFieldSetElement>(
      `[data-form-step="${formStep}"]`,
    );
    step?.querySelector<HTMLElement>("legend")?.focus({ preventScroll: true });
    step?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [formStep]);

  const goToFormStep = (step: number) => {
    focusNextStep.current = true;
    setFormStep(step);
  };

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("start_viagem_application", { offer: "viagem_trovr", visual_variant: visual });
  };

  const advanceForm = (form: HTMLFormElement) => {
    if (!plan) {
      document.getElementById("plan")?.focus();
      (document.getElementById("plan") as HTMLSelectElement)?.reportValidity();
      return;
    }
    const currentFields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[data-form-step="${formStep}"] input, [data-form-step="${formStep}"] select, [data-form-step="${formStep}"] textarea`,
      ),
    ).filter((field) => field.type !== "hidden");
    const firstInvalid = currentFields.find((field) => !field.checkValidity());
    if (firstInvalid) {
      firstInvalid.focus({ preventScroll: true });
      firstInvalid.scrollIntoView({ block: "center", behavior: "instant" });
      firstInvalid.reportValidity();
      return;
    }
    const nextStep = Math.min(formStep + 1, 3);
    goToFormStep(nextStep);
    trackEvent("advance_viagem_application", {
      offer: "viagem_trovr",
      step: nextStep,
      visual_variant: visual,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inFlight.current || !plan) return;
    const invalid = Array.from(event.currentTarget.elements).find((field) =>
      field instanceof HTMLInputElement ||
      field instanceof HTMLSelectElement ||
      field instanceof HTMLTextAreaElement
        ? !field.checkValidity()
        : false,
    ) as HTMLInputElement | undefined;
    if (invalid) {
      setFormStep(Number(invalid.closest("[data-form-step]")?.getAttribute("data-form-step") || 1));
      requestAnimationFrame(() => {
        invalid.focus({ preventScroll: true });
        invalid.scrollIntoView({ block: "center", behavior: "instant" });
        invalid.reportValidity();
      });
      return;
    }
    inFlight.current = true;
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const search = new URLSearchParams(window.location.search);
    data.set("plan", plan);
    data.set("price", String(VIAGEM_PLANS[plan].price));
    data.set("currency", "BRL");
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const value = search.get(key) || "";
      data.set(key, /^[a-zA-Z0-9_-]{1,100}$/.test(value) ? value : "");
    }
    data.set("referrer", document.referrer ? new URL(document.referrer).origin : "direto");

    try {
      const response = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      const body = await response.text();
      const captured =
        response.ok && (response.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Formulário não capturado");

      trackViagemLead(plan);
      trackEvent("submit_viagem_application", {
        offer: "viagem_trovr",
        visual_variant: visual,
        budget: String(data.get("trip_budget") || "não informado"),
        readiness: String(data.get("readiness") || "não informado"),
      });
      setSubmittedPlan(plan);
      setDone(true);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente em alguns minutos.");
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  };

  return (
    <main
      className={`viagem-immersive viagem-visual-${visual} bg-ink text-paper`}
      data-visual-variant={visual}
    >
      <SiteHeader transparent />

      <div className="viagem-story-stage">
        <div className="viagem-story-backdrop" aria-hidden />
        <section className="viagem-scene viagem-hero">
          <img
            src="/images/seychelles-island-5039305.webp"
            alt="Ilha rochosa com vegetação cercada por mar turquesa em Seychelles"
            className="sr-only"
          />
          <div className="viagem-hero-veil" aria-hidden />
          <div className="viagem-hero-content relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
            <div className="max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/75">
                Roteiro personalizado · curadoria fora do óbvio
              </p>
              <h1 className="mt-6 max-w-[14ch] text-[3rem] leading-[0.98] sm:text-6xl md:text-[5.7rem]">
                Sua próxima viagem não começa no mapa. <em>Começa em você.</em>
              </h1>
              <p className="viagem-lead-copy mt-7 max-w-xl">
                A Trovr transforma o que você quer viver em um roteiro de viagem personalizado,
                possível e fora do óbvio, mesmo quando você ainda não sabe para onde ir.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href="#modalidades"
                  data-analytics-event="open_viagem_offer"
                  data-analytics-name="viagem_hero"
                  data-analytics-variant={visual}
                  className="inline-flex items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-paper transition-colors hover:bg-terracotta"
                >
                  Descobrir minha viagem <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="viagem-scene viagem-blend-top viagem-kite">
          <img
            src="/images/seychelles-island-5039305.webp"
            alt="A fotografia da viagem permanece enquanto a narrativa avança"
            loading="lazy"
            className="sr-only"
          />
          <div className="viagem-kite-veil" aria-hidden />
          <div className="viagem-narrative-content relative z-10 mx-auto grid max-w-7xl px-6 sm:px-12">
            <div className="ml-auto max-w-xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/70">
                O desejo é simples
              </p>
              <h2 className="mt-5 text-4xl leading-[1.02] sm:text-6xl">
                Você quer viajar. Só não quer transformar as férias em outro trabalho.
              </h2>
              <p className="viagem-readable-copy mt-6 text-base leading-7 text-paper/90">
                Cada aba traz uma resposta diferente: vinte hotéis, cinquenta lugares, a próxima
                tendência. Quanto mais opções aparecem, mais difícil fica saber o que realmente
                combina com você.
              </p>
            </div>
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/70">
                A pergunta muda tudo
              </p>
              <h2 className="mt-5 text-4xl leading-[1.02] sm:text-6xl">
                Não é “para onde você quer ir?”. É “o que você <em>precisa encontrar?</em>”
              </h2>
              <p className="viagem-readable-copy mt-6 max-w-xl text-base leading-7 text-paper/90 sm:text-lg">
                Talvez seja desafio. Silêncio. Reencontro. Celebração. Ou só a sensação de voltar
                pensando: caraca, olha tudo que eu vivi. O destino vem depois.
              </p>
            </div>
          </div>
        </section>

        <section
          className="viagem-scene viagem-blend-top viagem-horizon"
          aria-labelledby="included-title"
        >
          <img
            src="/images/seychelles-island-5039305.webp"
            alt="A fotografia da viagem permanece enquanto a narrativa avança"
            loading="lazy"
            className="sr-only"
          />
          <div className="viagem-horizon-veil" aria-hidden />
          <div className="viagem-included-content relative z-10 mx-auto max-w-7xl px-6 sm:px-12">
            <div className="ml-auto max-w-3xl text-right">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/70">
                O que você recebe
              </p>
              <h2 id="included-title" className="mt-5 text-4xl leading-[1.02] sm:text-6xl">
                Uma viagem construída para ser vivida, não arquivada.
              </h2>
            </div>
            <ul className="mt-10 border-t border-paper/30">
              {INCLUDED.map((item, index) => (
                <li
                  key={item}
                  className="grid gap-3 border-b border-paper/25 py-5 sm:grid-cols-[minmax(12rem,0.8fr)_1.4fr]"
                >
                  <span className="text-xs tracking-[0.18em] text-paper/55">0{index + 1}</span>
                  <span className="text-base leading-7 text-paper/90 sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-7 ml-auto max-w-3xl text-sm leading-6 text-paper/65">
              A Trovr recomenda e mostra caminhos para reservar. A operação e os pagamentos aos
              fornecedores continuam sob responsabilidade do viajante.
            </p>

            <figure className="viagem-origin mx-auto max-w-4xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/75">A origem</p>
              <blockquote>
                <h2 className="mt-6 text-4xl leading-[1.08] sm:text-5xl md:text-6xl">
                  “A vida é irada demais para não ser vivida.”
                </h2>
                <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-paper sm:text-xl">
                  Viajar, pra mim, nunca foi fugir da vida. É voltar com mais energia,
                  repertório e vontade.
                </p>
              </blockquote>
              <figcaption className="mt-6 text-sm tracking-wide text-paper/80">
                Pamela · fundadora da Trovr
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="viagem-method relative z-10 px-6 text-paper">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/70">Como funciona</p>
              <h2 className="mt-5 text-4xl leading-[1.04] sm:text-5xl">
                Da vontade a um caminho claro.
              </h2>
            </div>
            <div>
              <ol className="border-t border-paper/35">
                {STEPS.map(([number, title, body]) => (
                  <li
                    key={number}
                    className="grid gap-3 border-b border-paper/30 py-6 sm:grid-cols-[3rem_1fr]"
                  >
                    <span className="text-xs tracking-[0.18em] text-paper/60">{number}</span>
                    <div>
                      <h3 className="text-2xl">{title}</h3>
                      <p className="viagem-readable-copy mt-2 max-w-xl text-sm leading-6 text-paper/85 sm:text-base">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-serif text-2xl sm:text-3xl">
                  Essencial · R$ 499. Premium · R$ 1.499.
                </p>
                <a
                  href="#modalidades"
                  data-analytics-event="open_viagem_offer"
                  data-analytics-name="viagem_method"
                  data-analytics-variant={visual}
                  className="inline-flex shrink-0 items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-paper transition-colors hover:bg-terracotta"
                >
                  Escolher minha curadoria <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="modalidades"
          aria-labelledby="plans-title"
          className="viagem-plans-section relative z-10 scroll-mt-24 px-6 text-paper sm:px-12"
        >
          <div className="mx-auto max-w-6xl">
            <h2 id="plans-title" className="max-w-3xl text-4xl leading-tight sm:text-5xl">
              Sua próxima viagem começa com a escolha certa.
            </h2>
            <p className="mt-6 max-w-3xl leading-7">
              Da descoberta de novas possibilidades ao planejamento completo da sua viagem. Escolha
              como a Trovr pode ajudar você a viver algo fora do óbvio.
            </p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {Object.entries(VIAGEM_PLANS).map(([id, item]) => (
                <article
                  id={id}
                  key={id}
                  className="viagem-plan-card flex flex-col rounded-sm border border-coffee/25 p-6 text-ink sm:p-8"
                >
                  <p className="text-sm uppercase tracking-widest">{item.name}</p>
                  <p className="mt-4 text-2xl">
                    {formatPlanPrice(item.price)} <span className="text-sm">· Valor total</span>
                  </p>
                  <p className="mt-3 text-sm leading-6">{item.paymentTerms}</p>
                  <h3 className="mt-6 text-3xl">{item.title}</h3>
                  <p className="mt-4 leading-7">{item.description}</p>
                  <ul className="my-6 list-disc space-y-3 pl-5 text-sm leading-6">
                    {item.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="viagem-plan-exclusions mb-8 text-sm leading-6 text-ink">
                    {item.exclusions}
                  </p>
                  <a
                    href="#candidatura"
                    onClick={() => choosePlan(id as ViagemPlan)}
                    className="mt-auto inline-flex min-h-12 items-center justify-center rounded-full bg-sage px-6 py-4 text-center text-sm text-paper hover:bg-terracotta"
                  >
                    {item.cta}
                  </a>
                </article>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6">
              Ambas as modalidades contemplam inicialmente até dois viajantes com o mesmo roteiro.
              Escopos mais complexos devem ser avaliados separadamente.
            </p>
          </div>
        </section>

        <div className="viagem-final-stage">
          <div className="viagem-final-surface relative z-10 mx-auto max-w-6xl text-ink">
            <section
              className="px-6 py-8 sm:px-8 sm:py-10"
              aria-labelledby="faq-title"
            >
              <div className="mx-auto max-w-4xl">
                <div className="mx-auto max-w-2xl text-center">
                  <p className="text-xs uppercase tracking-[0.24em] text-coffee">
                    Antes de começar
                  </p>
                  <h2
                    id="faq-title"
                    className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl"
                  >
                    O que você precisa saber sobre a Viagem Trovr.
                  </h2>
                </div>
                <div className="mt-12 border-t border-coffee/25">
                  {FAQ.map((item) => (
                    <details key={item.question} className="group border-b border-coffee/25 py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-serif text-xl marker:hidden">
                        {item.question}
                        <span
                          aria-hidden
                          className="text-2xl font-light text-sage transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="max-w-2xl pt-4 text-sm leading-6 text-coffee sm:text-base sm:leading-7">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </section>

            <section
              id="candidatura"
              className="scroll-mt-20 border-t border-coffee/20 px-6 pt-12 pb-20 sm:px-12 sm:pt-16 sm:pb-24"
              aria-labelledby="application-title"
            >
              <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-coffee">
                    Sua próxima viagem começa aqui
                  </p>
                  <h2
                    id="application-title"
                    className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl"
                  >
                    Dê o primeiro passo. A direção aparece na conversa.
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-6 text-coffee/75">
                    São três etapas curtas. Você pode começar mesmo sem destino definido.
                  </p>
                  <div className="mt-8 grid gap-5 text-sm leading-6 text-coffee">
                    <p className="flex gap-3">
                      <Compass className="mt-0.5 h-5 w-5 shrink-0 text-sage" /> Você pode chegar sem
                      destino definido.
                    </p>
                    <p className="flex gap-3">
                      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-sage" /> A Essencial
                      começa pelo formulário. A Premium inclui reunião de até 45 minutos.
                    </p>
                    <p className="flex gap-3">
                      <RouteIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage" /> O envio não gera
                      cobrança nem contratação automática.
                    </p>
                  </div>
                </div>

                {done ? (
                  <div
                    ref={confirmationRef}
                    tabIndex={-1}
                    role="status"
                    className="scroll-mt-28 self-start rounded-sm bg-sage p-8 text-paper sm:p-10"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-paper/75">
                      Candidatura recebida
                    </p>
                    <h3 className="mt-5 font-serif text-3xl sm:text-4xl">
                      Seu próximo passo: confirmar a curadoria.
                    </h3>
                    <p className="mt-5 text-base leading-7 text-paper/90">
                      {completedPlan?.name} ·{" "}
                      {completedPlan && formatPlanPrice(completedPlan.price)}. Seu formulário foi
                      recebido. Para começar, conclua o pagamento na InfinitePay. A produção começa
                      após a confirmação do pagamento e o recebimento das informações necessárias.
                      {submittedPlan === "premium"
                        ? " A Premium inclui reunião de até 45 minutos e entrega em até 10 dias úteis após briefing completo e reunião."
                        : " A Essencial tem entrega em até 5 dias úteis após briefing e pagamento."}
                    </p>
                    {completedPlan && submittedPlan && (
                      <>
                        <p className="mt-4 text-sm leading-6 text-paper">
                          {completedPlan.paymentTerms} Confira o total no checkout e use o mesmo
                          e-mail informado no formulário.
                        </p>
                        <a
                          href={completedPlan.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackViagemCheckout(submittedPlan)}
                          className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-paper px-6 py-4 text-center text-sm font-medium text-ink hover:bg-sand"
                        >
                          Quero começar minha viagem <ArrowRight className="h-4 w-4" />
                        </a>
                        <p className="mt-4 text-xs leading-5 text-paper">
                          O checkout abre em outra aba. Enviar o formulário ou abrir o checkout não
                          realiza cobrança automática. Você recebe o comprovante na InfinitePay após
                          a aprovação do pagamento.
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <form
                    noValidate
                    ref={formRef}
                    name="viagem-trovr"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onFocus={markStarted}
                    onSubmit={onSubmit}
                    className="grid gap-6"
                  >
                    <Field label="Escolha sua modalidade" id="plan">
                      <select
                        id="plan"
                        name="plan"
                        required
                        value={plan}
                        onChange={(event) => choosePlan(event.target.value as ViagemPlan)}
                        className="form-field"
                      >
                        <option value="" disabled>
                          Selecione sua curadoria
                        </option>
                        <option value="essencial">Curadoria Essencial · R$ 499</option>
                        <option value="premium">Curadoria Premium · R$ 1.499</option>
                      </select>
                    </Field>
                    {selected && (
                      <p className="text-sm leading-6 text-coffee" role="status">
                        {selected.items.at(-1)} {selected.exclusions} Até dois viajantes com o mesmo
                        roteiro; escopos mais complexos são avaliados separadamente.
                      </p>
                    )}
                    <input type="hidden" name="price" value={selected?.price ?? ""} />
                    <input type="hidden" name="currency" value="BRL" />
                    <input type="hidden" name="form-name" value="viagem-trovr" />
                    <input type="hidden" name="source_page" value="/viagem" />
                    <input type="hidden" name="offer" value="viagem_trovr" />
                    <input type="hidden" name="visual_variant" value={visual} />
                    <input type="hidden" name="utm_source" />
                    <input type="hidden" name="utm_medium" />
                    <input type="hidden" name="utm_campaign" />
                    <input type="hidden" name="utm_content" />
                    <input type="hidden" name="referrer" />
                    <p className="hidden">
                      <label>
                        Não preencha: <input name="bot-field" />
                      </label>
                    </p>

                    <fieldset data-form-step="1" hidden={formStep !== 1} className="grid gap-6">
                      <legend tabIndex={-1} className="mb-6 font-serif text-2xl">
                        Vamos desenhar o contorno.
                      </legend>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Quando você quer viajar?" id="travel_period">
                          <input
                            id="travel_period"
                            name="travel_period"
                            required
                            placeholder="Ex.: março de 2027 ou ainda flexível"
                            className="form-field"
                          />
                        </Field>
                        <Field label="De onde você sai?" id="departure_city">
                          <input
                            id="departure_city"
                            name="departure_city"
                            required
                            placeholder="Cidade e país"
                            className="form-field"
                          />
                        </Field>
                        <Field label="Quantas pessoas vão viajar?" id="travelers">
                          <input
                            id="travelers"
                            name="travelers"
                            required
                            placeholder="Conte também quem viaja com você"
                            className="form-field"
                          />
                        </Field>
                        <Field label="Quanto tempo a viagem deve durar?" id="trip_length">
                          <select
                            id="trip_length"
                            name="trip_length"
                            required
                            className="form-field"
                          >
                            <option value="">Selecione</option>
                            <option value="ate-7">Até 7 dias</option>
                            <option value="8-10">De 8 a 10 dias</option>
                            <option value="11-14">De 11 a 14 dias — avaliação de escopo</option>
                            <option value="15-mais">15 dias ou mais</option>
                            <option value="nao-sei">Ainda não sei</option>
                          </select>
                        </Field>
                        <Field label="Você já escolheu o destino?" id="destination_status">
                          <select
                            id="destination_status"
                            name="destination_status"
                            required
                            className="form-field"
                          >
                            <option value="">Selecione</option>
                            <option value="defined">Sim, já está definido</option>
                            <option value="options">Tenho algumas opções</option>
                            <option value="open">Estou aberto a descobrir</option>
                          </select>
                        </Field>
                        <Field
                          label="Qual ideia está na sua cabeça?"
                          id="destination_idea"
                          optional
                        >
                          <input
                            id="destination_idea"
                            name="destination_idea"
                            placeholder="Lugar, clima, esporte ou sensação"
                            className="form-field"
                          />
                        </Field>
                      </div>
                    </fieldset>

                    <fieldset data-form-step="2" hidden={formStep !== 2} className="grid gap-6">
                      <legend tabIndex={-1} className="mb-6 font-serif text-2xl">
                        Agora, o que precisa fazer sentido.
                      </legend>
                      <Field
                        label="Qual é o orçamento total estimado para a viagem?"
                        id="trip_budget"
                      >
                        <select id="trip_budget" name="trip_budget" required className="form-field">
                          <option value="">Selecione uma faixa, sem incluir a curadoria</option>
                          <option value="ate-15k">Até R$ 15 mil</option>
                          <option value="15k-30k">De R$ 15 mil a R$ 30 mil</option>
                          <option value="30k-60k">De R$ 30 mil a R$ 60 mil</option>
                          <option value="60k-mais">Acima de R$ 60 mil</option>
                          <option value="nao-sei">Ainda não sei estimar</option>
                        </select>
                      </Field>
                      <Field
                        label="O que você quer viver — e por que essa viagem importa agora?"
                        id="desired_experience"
                      >
                        <textarea
                          id="desired_experience"
                          name="desired_experience"
                          required
                          rows={5}
                          placeholder="Não procure a resposta perfeita. Conte o que está acontecendo e o que você espera encontrar."
                          className="form-field resize-y"
                        />
                      </Field>
                      <Field label="Em que momento você está?" id="readiness">
                        <select id="readiness" name="readiness" required className="form-field">
                          <option value="">Selecione</option>
                          <option value="ready">Quero começar agora</option>
                          <option value="30-days">Quero decidir nos próximos 30 dias</option>
                          <option value="researching">Ainda estou pesquisando</option>
                        </select>
                      </Field>
                    </fieldset>

                    <fieldset data-form-step="3" hidden={formStep !== 3} className="grid gap-6">
                      <legend tabIndex={-1} className="mb-6 font-serif text-2xl">
                        Para a Trovr continuar a conversa.
                      </legend>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Como podemos chamar você?" id="name">
                          <input
                            id="name"
                            name="name"
                            required
                            autoComplete="name"
                            className="form-field"
                          />
                        </Field>
                        <Field label="Email" id="email">
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="form-field"
                          />
                        </Field>
                        <Field label="WhatsApp" id="phone">
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            autoComplete="tel"
                            placeholder="Com DDD"
                            aria-describedby="phone-help"
                            className="form-field"
                          />
                          <p id="phone-help" className="mt-2 text-xs leading-5 text-coffee/65">
                            Usaremos para responder sua solicitação e combinar os próximos passos.
                          </p>
                        </Field>
                        <Field label="Como você conheceu a Trovr?" id="discovery_source" optional>
                          <select
                            id="discovery_source"
                            name="discovery_source"
                            className="form-field"
                          >
                            <option value="">Selecione</option>
                            <option value="instagram">Instagram da Trovr</option>
                            <option value="founder">Perfil da Pamela</option>
                            <option value="tiktok">TikTok</option>
                            <option value="search">Busca</option>
                            <option value="recommendation">Indicação</option>
                            <option value="other">Outro</option>
                          </select>
                        </Field>
                      </div>
                      <p className="text-xs leading-5 text-coffee/75">
                        Ao enviar, você autoriza a Trovr a usar estes dados para avaliar e responder
                        sua solicitação. Consulte nossa{" "}
                        <a
                          href="/privacidade"
                          className="underline underline-offset-2 hover:text-ink"
                        >
                          política de privacidade
                        </a>
                        .
                      </p>
                    </fieldset>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      {formStep > 1 ? (
                        <button
                          type="button"
                          onClick={() => goToFormStep(Math.max(1, formStep - 1))}
                          className="inline-flex min-h-12 items-center gap-2 px-2 text-xs uppercase tracking-[0.14em] text-coffee hover:text-ink"
                        >
                          <ArrowLeft className="h-4 w-4" /> Voltar
                        </button>
                      ) : (
                        <span />
                      )}
                      {formStep < 3 ? (
                        <button
                          key="continue-application"
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            if (formRef.current) advanceForm(formRef.current);
                          }}
                          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-8 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink"
                        >
                          Continuar <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          key="submit-application"
                          type="submit"
                          disabled={submitting}
                          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-8 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink disabled:opacity-60"
                        >
                          {submitting ? "Enviando…" : "Enviar minha viagem"}
                          {!submitting && <ArrowRight className="h-4 w-4" />}
                        </button>
                      )}
                    </div>
                    {error && (
                      <p role="alert" className="text-sm text-terracotta">
                        {error}
                      </p>
                    )}
                  </form>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}

function Field({
  label,
  id,
  children,
  optional = false,
}: {
  label: string;
  id: string;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-coffee">
        {label}
        {optional && <span className="text-coffee/60"> (opcional)</span>}
      </label>
      {children}
    </div>
  );
}
