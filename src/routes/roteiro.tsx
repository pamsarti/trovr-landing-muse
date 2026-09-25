import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Roteiro de viagem personalizado | Trovr";
const DESCRIPTION =
  "Receba ajuda para pesquisar destinos, melhores épocas, experiências, deslocamentos e hospedagens em um roteiro de viagem feito para o seu perfil.";

export const Route = createFileRoute("/roteiro")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/roteiro` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/roteiro` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Roteiro de viagem personalizado Trovr",
          description: DESCRIPTION,
          provider: { "@type": "Organization", name: "Trovr", url: SITE_URL },
          areaServed: "BR",
          serviceType: "Curadoria e planejamento de roteiro de viagem",
          url: `${SITE_URL}/roteiro`,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
            {
              "@type": "ListItem",
              position: 2,
              name: "Roteiro personalizado",
              item: `${SITE_URL}/roteiro`,
            },
          ],
        }),
      },
    ],
  }),
  component: ItineraryPage,
});

function ItineraryPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(event.currentTarget);
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
      trackEvent("submit_itinerary", {
        sport: String(data.get("sport") || "não informado"),
        travel_style: String(data.get("travel_style") || "não informado"),
      });
      setDone(true);
    } catch {
      setError("Não foi possível enviar agora. Tente novamente em alguns minutos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-paper text-ink">
      <SiteHeader />
      <section className="px-6 pb-16 pt-16 sm:pb-24 sm:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-xs uppercase tracking-[0.24em] text-coffee">
            Roteiros de viagem personalizados
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl leading-[1.04] sm:text-6xl">
            Um roteiro feito para a sua forma de viajar.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-coffee sm:text-lg">
            Você conta o que quer viver, quanto tempo tem e como gosta de viajar. A Trovr pesquisa
            destinos, épocas, experiências, deslocamentos e hospedagens para organizar um roteiro
            coerente e fora do óbvio.
          </p>
        </div>
      </section>

      <section className="bg-sand px-6 py-16 sm:py-20" aria-labelledby="como-funciona">
        <div className="mx-auto max-w-6xl">
          <h2 id="como-funciona" className="font-serif text-4xl sm:text-5xl">
            Como funciona
          </h2>
          <ol className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Você conta o que procura",
                "Interesses, período, orçamento, ritmo e o tipo de experiência que quer viver.",
              ],
              [
                "02",
                "A Trovr pesquisa",
                "Destinos, temporadas, atividades, deslocamentos e opções de hospedagem adequadas ao seu perfil.",
              ],
              [
                "03",
                "Você recebe o roteiro",
                "Uma proposta organizada para orientar suas escolhas e facilitar o planejamento da viagem.",
              ],
            ].map(([number, title, body]) => (
              <li key={number} className="border-t border-coffee/30 pt-5">
                <span className="text-xs tracking-[0.18em] text-coffee">{number}</span>
                <h3 className="mt-4 font-serif text-2xl">{title}</h3>
                <p className="mt-3 text-base leading-7 text-coffee">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 flex items-start gap-3 text-sm leading-6 text-coffee">
            <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden />A Trovr faz a curadoria e o
            planejamento. As reservas, pagamentos e a operação da viagem continuam sob sua escolha.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28" aria-labelledby="form-title">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-coffee">
              Conte sobre a sua viagem
            </p>
            <h2 id="form-title" className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl">
              Por onde a gente começa?
            </h2>
            <p className="mt-6 text-base leading-7 text-coffee">
              Não precisa ter tudo decidido. Quanto mais contexto você compartilhar, melhor será a
              primeira conversa.
            </p>
          </div>

          {done ? (
            <div role="status" className="self-start rounded-sm bg-sage p-8 text-paper">
              <h3 className="font-serif text-3xl">Recebemos seu pedido.</h3>
              <p className="mt-4 text-base leading-7 text-paper/90">
                Obrigada por compartilhar sua ideia de viagem. A Trovr entra em contato para
                entender os próximos passos.
              </p>
            </div>
          ) : (
            <form
              name="roteiro-personalizado"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              className="grid gap-6"
            >
              <input type="hidden" name="form-name" value="roteiro-personalizado" />
              <input type="hidden" name="source_page" value="/roteiro" />
              <p className="hidden">
                <label>
                  Não preencha: <input name="bot-field" />
                </label>
              </p>

              <Field label="Nome" id="name">
                <input id="name" name="name" required autoComplete="name" className="form-field" />
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

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Quando você quer viajar?" id="when">
                  <input
                    id="when"
                    name="when"
                    placeholder="Ex.: agosto de 2027 ou flexível"
                    className="form-field"
                  />
                </Field>
                <Field label="Por quanto tempo?" id="duration">
                  <input
                    id="duration"
                    name="duration"
                    placeholder="Ex.: 10 dias"
                    className="form-field"
                  />
                </Field>
              </div>

              <Field label="O que você quer viver nessa viagem?" id="interests">
                <textarea
                  id="interests"
                  name="interests"
                  required
                  rows={4}
                  placeholder="Esporte, natureza, cultura, descanso, desafio…"
                  className="form-field resize-y"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Esporte ou atividade" id="sport">
                  <input
                    id="sport"
                    name="sport"
                    placeholder="Ex.: kitesurf, trilha, trem"
                    className="form-field"
                  />
                </Field>
                <Field label="Faixa de orçamento" id="budget">
                  <input
                    id="budget"
                    name="budget"
                    placeholder="Pode ser aproximada"
                    className="form-field"
                  />
                </Field>
              </div>

              <Field label="Como você gosta de viajar?" id="travel_style">
                <select id="travel_style" name="travel_style" className="form-field">
                  <option value="">Selecione</option>
                  <option>Sozinho</option>
                  <option>Em casal</option>
                  <option>Com amigos</option>
                  <option>Em família</option>
                  <option>Ainda não sei</option>
                </select>
              </Field>

              <Field label="Mais alguma coisa que a Trovr deveria saber?" id="notes">
                <textarea id="notes" name="notes" rows={4} className="form-field resize-y" />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="min-h-12 w-fit rounded-full bg-sage px-8 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink disabled:opacity-60"
              >
                {submitting ? "Enviando…" : "Enviar meu pedido"}
              </button>
              {error && (
                <p role="alert" className="text-sm text-terracotta">
                  {error}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-coffee">
        {label}
      </label>
      {children}
    </div>
  );
}
