import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: "Política de privacidade | Trovr" },
      {
        name: "description",
        content: "Saiba como a Trovr trata dados, formulários e métricas de navegação.",
      },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacidade` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="bg-paper text-ink">
      <SiteHeader />
      <article className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-[0.24em] text-coffee">Privacidade</p>
        <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl">
          Política de privacidade
        </h1>
        <p className="mt-5 text-sm text-coffee">Última atualização: 25 de setembro de 2026.</p>

        <div className="mt-12 space-y-10 text-base leading-7 text-coffee">
          <section>
            <h2 className="font-serif text-3xl text-ink">O que coletamos</h2>
            <p className="mt-4">
              Quando você autoriza métricas opcionais, podemos registrar páginas visitadas, cliques,
              origem aproximada da visita, dispositivo e interações com conteúdos. Não usamos essas
              ferramentas para coletar deliberadamente dados sensíveis.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-ink">Formulários</h2>
            <p className="mt-4">
              Ao enviar a newsletter ou um pedido de contato ou serviço, tratamos os dados
              informados para responder à solicitação e prestar o serviço pedido. Não vendemos esses
              dados.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-ink">Ferramentas de métricas</h2>
            <p className="mt-4">
              Podemos utilizar Netlify Web Analytics, Google Analytics e Microsoft Clarity para
              entender o desempenho e melhorar a experiência. Google Analytics e Clarity só são
              carregados depois do seu consentimento no site.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-ink">Suas escolhas</h2>
            <p className="mt-4">
              Você pode recusar as métricas opcionais ou mudar sua decisão no botão “Privacidade”.
              Também pode solicitar informações, correção ou exclusão dos dados enviados pelos
              canais oficiais da Trovr.
            </p>
          </section>
          <section>
            <h2 className="font-serif text-3xl text-ink">Atualizações</h2>
            <p className="mt-4">
              Esta política poderá ser atualizada para refletir mudanças no site ou nas ferramentas
              utilizadas. A data acima sempre indica a versão mais recente.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
