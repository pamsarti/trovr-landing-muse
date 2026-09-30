import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";

const TITLE = "Conte o que você procura | Trovr";
const DESCRIPTION =
  "Fale com a Trovr sobre roteiros, curadoria de viagens, operações, conteúdo, divulgação de experiências e parcerias.";

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
          "@type": "ContactPage",
          name: "Fale com a Trovr",
          description: DESCRIPTION,
          about: {
            "@type": "Organization",
            name: "Trovr",
            url: SITE_URL,
          },
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
              name: "Conte o que você procura",
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
      trackEvent("submit_contact", {
        profile: String(data.get("profile") || "não informado"),
        request_type: String(data.get("request_type") || "não informado"),
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
            Uma conversa com contexto
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl font-serif text-5xl leading-[1.04] sm:text-6xl">
            Conte o que você procura. A Trovr ajuda a encontrar o próximo caminho.
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-coffee sm:text-lg">
            Você pode estar planejando uma viagem, apresentando uma operação, propondo conteúdo ou
            parceria, ou apenas pesquisando possibilidades. O formulário abaixo organiza o contexto
            para que a conversa comece no lugar certo.
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
                "Você se apresenta",
                "Diga se você é viajante, operador, anfitrião, marca, projeto editorial ou alguém ainda explorando possibilidades.",
              ],
              [
                "02",
                "Você escolhe o assunto",
                "Roteiro e curadoria, divulgação de uma experiência, conteúdo, parceria ou outro tipo de conversa.",
              ],
              [
                "03",
                "A Trovr direciona",
                "A gente lê o contexto, identifica como pode ajudar e retorna com um próximo passo claro.",
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
            <Check className="mt-1 h-4 w-4 shrink-0" aria-hidden /> Enviar o formulário não gera
            contratação automática. Ele serve para entender a necessidade antes de indicar um
            serviço, parceria ou caminho possível.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28" aria-labelledby="form-title">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-coffee">
              Conte sobre você ou seu projeto
            </p>
            <h2 id="form-title" className="mt-5 font-serif text-4xl leading-[1.08] sm:text-5xl">
              O que você quer construir, descobrir ou apresentar?
            </h2>
            <p className="mt-6 text-base leading-7 text-coffee">
              Você não precisa chegar com uma proposta pronta. As escolhas do formulário ajudam a
              organizar a conversa sem limitar o que você quer contar.
            </p>
          </div>

          {done ? (
            <div role="status" className="self-start rounded-sm bg-sage p-8 text-paper">
              <h3 className="font-serif text-3xl">Recebemos sua mensagem.</h3>
              <p className="mt-4 text-base leading-7 text-paper/90">
                Obrigada por compartilhar o contexto. A Trovr entra em contato para indicar o
                próximo passo da conversa.
              </p>
            </div>
          ) : (
            <form
              name="contato-trovr"
              method="POST"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              className="grid gap-6"
            >
              <input type="hidden" name="form-name" value="contato-trovr" />
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
                <Field label="Qual é o seu perfil?" id="profile">
                  <select id="profile" name="profile" required className="form-field">
                    <option value="">Selecione</option>
                    <option value="traveler">Estou planejando uma viagem</option>
                    <option value="researcher">
                      Ainda estou pesquisando ou sou apenas curioso
                    </option>
                    <option value="operator">Sou operador, anfitrião ou destino</option>
                    <option value="brand">Represento uma marca ou projeto</option>
                    <option value="editorial">Quero propor conteúdo ou uma pauta</option>
                    <option value="other">Outro</option>
                  </select>
                </Field>
                <Field label="Como a Trovr pode ajudar?" id="request_type">
                  <select id="request_type" name="request_type" required className="form-field">
                    <option value="">Selecione</option>
                    <option value="itinerary">Roteiro ou curadoria de viagem</option>
                    <option value="listing">Apresentar uma experiência ou operação</option>
                    <option value="content">Conteúdo, notícia ou pesquisa</option>
                    <option value="partnership">Parceria editorial ou comercial</option>
                    <option value="unsure">Ainda não sei</option>
                    <option value="other">Outro assunto</option>
                  </select>
                </Field>
              </div>

              <Field label="Conte o que você procura" id="message">
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  placeholder="Descreva a viagem, experiência, pauta, parceria ou dúvida que trouxe você até aqui."
                  className="form-field resize-y"
                />
              </Field>

              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="Destino, projeto ou link (opcional)" id="reference">
                  <input
                    id="reference"
                    name="reference"
                    placeholder="Um lugar, site ou referência"
                    className="form-field"
                  />
                </Field>
                <Field label="Prazo ou período (opcional)" id="timing">
                  <input
                    id="timing"
                    name="timing"
                    placeholder="Ex.: agosto de 2027 ou sem prazo"
                    className="form-field"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="min-h-12 w-fit rounded-full bg-sage px-8 text-xs font-medium uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink disabled:opacity-60"
              >
                {submitting ? "Enviando…" : "Enviar para a Trovr"}
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
