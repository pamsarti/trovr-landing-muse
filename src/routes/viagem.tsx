import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
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
import { trackEvent, trackViagemLead } from "@/lib/analytics";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Roteiro de viagem personalizado e fora do óbvio | Trovr";
const DESCRIPTION =
  "A Trovr cria seu roteiro de viagem personalizado a partir do que você quer viver, com curadoria fora do óbvio, hospedagens, restaurantes e caminhos para reservar.";

const FAQ = [
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
      "Os projetos personalizados começam em R$ 1.990. Duração, número de viajantes e destinos, complexidade e urgência definem o valor final, sempre confirmado antes da contratação.",
  },
  {
    question: "Em quanto tempo recebo minha viagem?",
    answer:
      "A primeira versão é entregue em uma página privada e navegável em até 10 a 15 dias úteis após a contratação e o briefing.",
  },
];

export const Route = createFileRoute("/viagem")({
  validateSearch: (search: Record<string, unknown>) => ({
    visual: search.visual === "mar" ? ("mar" as const) : ("alula" as const),
  }),
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/viagem` },
      { property: "og:image", content: `${SITE_URL}/images/providencia-cayo-cangrejo.jpg` },
      {
        property: "og:image:alt",
        content: "Mar de Providencia: viagens fora do óbvio com a Trovr",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: `${SITE_URL}/images/providencia-cayo-cangrejo.jpg` },
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
            offers: {
              "@type": "Offer",
              url: `${SITE_URL}/viagem`,
              priceCurrency: "BRL",
              price: "1990",
              description:
                "Projetos personalizados a partir de R$ 1.990. Valor final confirmado na proposta conforme escopo.",
            },
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
  "Uma direção de viagem coerente com o seu momento, não uma lista genérica de atrações.",
  "Roteiro dia a dia com experiências, deslocamentos e ritmo pensados em conjunto.",
  "Recomendações de hospedagem, restaurantes e caminhos para fazer cada reserva.",
  "Página privada e navegável para consultar antes e durante a viagem.",
  "Até quatro rodadas de ajustes em 15 dias e suporte para dúvidas até a sua volta.",
];

const STEPS = [
  [
    "01",
    "Você conta o que quer viver",
    "O formulário organiza momento, companhia, datas, orçamento e desejos — mesmo que o destino ainda não esteja definido.",
  ],
  [
    "02",
    "A gente conversa por 30 minutos",
    "Se houver aderência, aprofundamos o briefing e confirmamos escopo, prazo e investimento antes da contratação.",
  ],
  [
    "03",
    "A Trovr constrói a viagem",
    "Você recebe a primeira versão em até 10 a 15 dias úteis, apresentada em uma página privada e fácil de usar.",
  ],
  [
    "04",
    "A viagem continua com você",
    "Você faz as reservas diretamente e conta com a Trovr para dúvidas e ajustes dentro do suporte contratado.",
  ],
];

function ViagemPage() {
  const { visual } = Route.useSearch();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const markStarted = () => {
    if (started.current) return;
    started.current = true;
    trackEvent("start_viagem_application", { offer: "viagem_trovr", visual_variant: visual });
  };

  const advanceForm = (form: HTMLFormElement) => {
    const currentFields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[data-form-step="${formStep}"] input, [data-form-step="${formStep}"] select, [data-form-step="${formStep}"] textarea`,
      ),
    ).filter((field) => field.type !== "hidden");
    const firstInvalid = currentFields.find((field) => !field.checkValidity());
    if (firstInvalid) {
      firstInvalid.reportValidity();
      return;
    }
    const nextStep = Math.min(formStep + 1, 3);
    setFormStep(nextStep);
    trackEvent("advance_viagem_application", {
      offer: "viagem_trovr",
      step: nextStep,
      visual_variant: visual,
    });
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData(event.currentTarget);
    const search = new URLSearchParams(window.location.search);
    data.set("utm_source", search.get("utm_source") || "");
    data.set("utm_medium", search.get("utm_medium") || "");
    data.set("utm_campaign", search.get("utm_campaign") || "");
    data.set("utm_content", search.get("utm_content") || "");
    data.set("referrer", document.referrer || "direto");

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

      trackViagemLead();
      trackEvent("submit_viagem_application", {
        offer: "viagem_trovr",
        visual_variant: visual,
        budget: String(data.get("trip_budget") || "não informado"),
        readiness: String(data.get("readiness") || "não informado"),
      });
      setDone(true);
      window.scrollTo({
        top: document.getElementById("candidatura")?.offsetTop ?? 0,
        behavior: "smooth",
      });
    } catch {
      setError("Não foi possível enviar agora. Tente novamente em alguns minutos.");
    } finally {
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
            src="/images/providencia-cayo-cangrejo.jpg"
            alt="Mar azul-turquesa visto de Providencia"
            className="sr-only"
          />
          <div className="viagem-hero-veil" aria-hidden />
          <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-center px-6 pt-24 pb-10 sm:px-12 md:pt-28">
            <div className="max-w-4xl">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/75">
                Roteiro personalizado · curadoria fora do óbvio
              </p>
              <h1 className="mt-6 max-w-[14ch] text-[3rem] leading-[0.98] sm:text-6xl md:text-[5.7rem]">
                Sua próxima viagem não começa no mapa. <em>Começa em você.</em>
              </h1>
              <p className="mt-7 max-w-xl text-base leading-7 text-paper/82 sm:text-lg">
                A Trovr transforma o que você quer viver em um roteiro de viagem personalizado,
                possível e fora do óbvio, mesmo quando você ainda não sabe para onde ir.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <a
                  href="#candidatura"
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
            src="/images/providencia-cayo-cangrejo.jpg"
            alt="A fotografia da viagem permanece enquanto a narrativa avança"
            loading="lazy"
            className="sr-only"
          />
          <div className="viagem-kite-veil" aria-hidden />
          <div className="relative z-10 mx-auto grid min-h-[88svh] max-w-7xl content-between px-6 py-12 sm:px-12 md:py-14">
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
            src="/images/providencia-cayo-cangrejo.jpg"
            alt="A fotografia da viagem permanece enquanto a narrativa avança"
            loading="lazy"
            className="sr-only"
          />
          <div className="viagem-horizon-veil" aria-hidden />
          <div className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-14 sm:px-12 md:pt-20 md:pb-16">
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

            <div className="mx-auto mt-12 max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.28em] text-paper/65">A origem</p>
              <h2 className="mt-4 text-3xl leading-[1.06] sm:text-4xl">
                A vida é irada demais para não ser vivida.
              </h2>
              <p className="mt-4 text-sm leading-6 text-paper/72 sm:text-base">
                A Trovr nasceu da forma como Pamela aprendeu a viajar: não para fugir da vida, mas
                para voltar a ela com mais energia, repertório e vontade.
              </p>
            </div>
          </div>
        </section>
        <section className="viagem-method relative z-10 px-6 pb-24 pt-8 text-paper sm:pb-28 sm:pt-10">
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
                  Projetos personalizados a partir de R$ 1.990.
                </p>
                <a
                  href="#candidatura"
                  data-analytics-event="open_viagem_offer"
                  data-analytics-name="viagem_method"
                  data-analytics-variant={visual}
                  className="inline-flex shrink-0 items-center gap-3 rounded-full bg-sage px-7 py-3.5 text-xs uppercase tracking-[0.16em] text-paper transition-colors hover:bg-terracotta"
                >
                  Quero conversar <ArrowDown className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="viagem-final-stage">
          <div className="viagem-final-surface relative z-10 mx-auto max-w-6xl text-ink">
            <section
              className="px-6 pt-20 pb-12 sm:px-12 sm:pt-28 sm:pb-16"
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
                      <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-sage" /> A conversa de
                      30 minutos acontece apenas quando houver aderência.
                    </p>
                    <p className="flex gap-3">
                      <RouteIcon className="mt-0.5 h-5 w-5 shrink-0 text-sage" /> O envio não gera
                      cobrança nem contratação automática.
                    </p>
                  </div>
                </div>

                {done ? (
                  <div
                    role="status"
                    className="self-start rounded-sm bg-sage p-8 text-paper sm:p-10"
                  >
                    <p className="text-xs uppercase tracking-[0.22em] text-paper/75">
                      Candidatura recebida
                    </p>
                    <h3 className="mt-5 font-serif text-3xl sm:text-4xl">
                      Agora a Trovr vai ler a sua viagem com calma.
                    </h3>
                    <p className="mt-5 text-base leading-7 text-paper/90">
                      Se a Viagem Trovr fizer sentido para o que você procura, entraremos em contato
                      para marcar a conversa de 30 minutos e confirmar o próximo passo.
                    </p>
                  </div>
                ) : (
                  <form
                    ref={formRef}
                    name="viagem-trovr"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onFocus={markStarted}
                    onSubmit={onSubmit}
                    className="grid gap-6"
                  >
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
                      <legend className="mb-6 font-serif text-2xl">
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
                            <option value="8-14">De 8 a 14 dias</option>
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
                      <legend className="mb-6 font-serif text-2xl">
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
                      <legend className="mb-6 font-serif text-2xl">
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
                            Usaremos apenas para combinar a conversa, se houver aderência.
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
                          onClick={() => setFormStep((step) => Math.max(1, step - 1))}
                          className="inline-flex min-h-12 items-center gap-2 px-2 text-xs uppercase tracking-[0.14em] text-coffee hover:text-ink"
                        >
                          <ArrowLeft className="h-4 w-4" /> Voltar
                        </button>
                      ) : (
                        <span />
                      )}
                      {formStep < 3 ? (
                        <button
                          type="button"
                          onClick={() => formRef.current && advanceForm(formRef.current)}
                          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-8 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink"
                        >
                          Continuar <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
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
