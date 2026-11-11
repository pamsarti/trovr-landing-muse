import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";
import { VIAGEM_PLANS, formatPlanPrice } from "@/lib/viagem-plans";

type Phase = "quiz" | "capture" | "result" | "plans";
type Intent = "challenge" | "slow" | "learn" | "reconnect";
type Energy = "light" | "active" | "physical" | "unsure";

const STORAGE_KEY = "trovr-welcome-wall-v3";
const DISMISSAL_WINDOW = 30 * 24 * 60 * 60 * 1000;
const HERO_BACKGROUND = "/images/hero/providencia-licensed.webp";

const intents: Array<{ value: Intent; label: string }> = [
  { value: "challenge", label: "Me desafiar a ir além" },
  { value: "slow", label: "Desacelerar e respirar" },
  { value: "learn", label: "Aprender algo que me transforme" },
  { value: "reconnect", label: "Voltar a me escutar" },
];

const energies: Array<{ value: Energy; label: string }> = [
  { value: "light", label: "Leve, com tempo para observar" },
  { value: "active", label: "Ativo, com espaço para pausas" },
  { value: "physical", label: "Intenso, quero desafiar o corpo" },
  { value: "unsure", label: "Quero que a Trovr me surpreenda" },
];

const profiles: Record<
  Intent,
  { title: string; body: string; experience: string; example: string; score: number }
> = {
  challenge: {
    title: "Perfil Travessia",
    body: "Você se sente mais viva quando o caminho exige presença, preparo e coragem. Para você, o desafio só vale quando revela uma força nova e deixa uma história maior que o esforço.",
    experience: "Trilha + travessia",
    example: "4–7 dias · preparo progressivo · natureza em primeiro plano",
    score: 91,
  },
  slow: {
    title: "Perfil Presença",
    body: "Sua melhor viagem não preenche cada hora: ela devolve espaço. Você procura paisagens que diminuam o ruído, encontros locais e tempo para perceber onde realmente chegou.",
    experience: "Vela + vida entre ilhas",
    example: "5–8 dias · ritmo leve · movimento sem pressa",
    score: 87,
  },
  learn: {
    title: "Perfil Descoberta",
    body: "Você escolhe viagens que ampliam repertório. Quer voltar sabendo fazer, enxergar ou compreender algo que ainda não fazia parte do seu mundo.",
    experience: "Mergulho + vida a bordo",
    example: "5–8 dias · preparação básica · aprendizado e convivência",
    score: 89,
  },
  reconnect: {
    title: "Perfil Profundidade",
    body: "Você não viaja para fugir nem busca adrenalina pela adrenalina. Precisa de natureza, movimento e silêncio suficiente para voltar com uma perspectiva diferente.",
    experience: "Trilha + refúgio na natureza",
    example: "4–6 dias · pausas reais · tempo para recuperar perspectiva",
    score: 88,
  },
};

const energySignals: Record<Energy, { rhythm: string; group: string; complexity: string }> = {
  light: { rhythm: "Observador", group: "1–4 pessoas", complexity: "Baixa" },
  active: { rhythm: "Ativo + pausas", group: "2–6 pessoas", complexity: "Média" },
  physical: { rhythm: "Intenso", group: "2–5 pessoas", complexity: "Alta" },
  unsure: { rhythm: "A descobrir", group: "Flexível", complexity: "Gradual" },
};

function formBody(data: FormData) {
  const params = new URLSearchParams();
  data.forEach((value, key) => params.append(key, String(value)));
  return params.toString();
}

async function submitNetlifyForm(data: FormData) {
  const response = await fetch("/__forms.html", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody(data),
  });
  const body = await response.text();
  const captured =
    response.ok && (response.redirected || /form submission has been received/i.test(body));
  if (!captured) throw new Error("Formulário não capturado");
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-14 items-center justify-center rounded-xl border px-3 py-3 text-center text-sm sm:px-5 leading-[1.35] transition-colors motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${
        selected
          ? "border-sage bg-sage text-paper"
          : "border-coffee/30 bg-paper text-ink hover:border-sage hover:bg-sand/40"
      }`}
    >
      {children}
    </button>
  );
}

export function TrovrWelcomeWall() {
  const [open, setOpen] = useState(false);
  const [canShowWall, setCanShowWall] = useState(false);
  const [phase, setPhase] = useState<Phase>("quiz");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [phase]);
  const [intent, setIntent] = useState<Intent | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCanShowWall(true);

    let shouldOpen = true;
    try {
      const dismissedAt = Number(window.localStorage.getItem(STORAGE_KEY));
      shouldOpen = !dismissedAt || Date.now() - dismissedAt > DISMISSAL_WINDOW;
    } catch {
      // The experience still works when storage is unavailable.
    }
    if (!shouldOpen) return;

    const timer = window.setTimeout(() => {
      setOpen(true);
      trackEvent("open_welcome_wall", { source: "home_auto" });
    }, 2000);
    return () => window.clearTimeout(timer);
  }, []);

  const profile = useMemo(() => (intent ? profiles[intent] : null), [intent]);
  const signals = energy ? energySignals[energy] : null;
  const canContinue = Boolean(intent && energy);

  const rememberDismissal = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // Closing must never depend on storage.
    }
  };

  const close = (source: string) => {
    rememberDismissal();
    setOpen(false);
    trackEvent("close_welcome_wall", { source, phase });
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setOpen(true);
      trackEvent("open_welcome_wall", { source: "home_reopen" });
      return;
    }
    close("dialog");
  };

  const goToCapture = () => {
    if (!intent || !energy) return;
    trackEvent("complete_compass_quiz", { intent, energy });
    setPhase("capture");
    setError(null);
  };

  const captureLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!intent || !energy) return;
    setSubmitting(true);
    setError(null);
    try {
      await submitNetlifyForm(new FormData(event.currentTarget));
      trackEvent("compass_lead_capture", { intent, energy });
      rememberDismissal();
      setPhase("result");
    } catch {
      setError("Não conseguimos salvar seu perfil agora. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  };

  const step = phase === "quiz" ? 1 : phase === "capture" ? 2 : phase === "result" ? 3 : 4;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/65 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] h-[min(90dvh,700px)] w-[calc(100%-1.5rem)] max-w-[640px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[1.75rem] border border-coffee/15 bg-paper text-ink shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none">
          <Dialog.Title className="sr-only">
            Bússola Trovr: descubra seu perfil de viagem
          </Dialog.Title>
          <Dialog.Description className="sr-only">
            Responda duas perguntas para descobrir seu perfil de viagem e uma experiência
            recomendada pela curadoria Trovr.
          </Dialog.Description>

          <img
            src={HERO_BACKGROUND}
            alt=""
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
          <div aria-hidden className="absolute inset-0 bg-paper/95 backdrop-blur-[6px]" />

          <button
            type="button"
            aria-label="Fechar a Bússola e continuar no site"
            title="Fechar"
            onClick={() => close("close_button")}
            className="absolute right-3 top-3 z-20 inline-flex size-11 items-center justify-center rounded-full border border-coffee/20 bg-paper text-ink transition-colors hover:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage sm:right-5 sm:top-5"
          >
            <X className="size-5" aria-hidden />
          </button>

          <p className="sr-only">Etapa {step} de 4</p>

          <div ref={contentRef} className="relative z-10 flex h-full overscroll-contain overflow-y-auto px-5 pb-6 pt-16 sm:px-10 sm:pb-8 sm:pt-20">
            <div className="my-auto mx-auto w-full max-w-[560px]">
              {phase === "quiz" && (
                <section aria-labelledby="compass-question">
                  <h2
                    id="compass-question"
                    className="text-balance text-center font-serif text-2xl leading-tight sm:text-[1.7rem]"
                  >
                    Qual viagem combina com o seu momento?
                  </h2>
                  <p className="mt-2 text-pretty text-center text-sm leading-6 text-coffee">
                    Duas escolhas revelam seu perfil e uma experiência para começar.
                  </p>

                  <fieldset className="mt-5">
                    <legend className="font-serif text-lg">
                      O que faria esta viagem valer a pena agora?
                    </legend>
                    <div className="mt-2.5 grid gap-2.5 min-[360px]:grid-cols-2">
                      {intents.map((item) => (
                        <ChoiceButton
                          key={item.value}
                          selected={intent === item.value}
                          onClick={() => setIntent(item.value)}
                        >
                          {item.label}
                        </ChoiceButton>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="mt-5">
                    <legend className="font-serif text-lg">
                      Qual ritmo combina com este momento?
                    </legend>
                    <div className="mt-2.5 grid gap-2.5 min-[360px]:grid-cols-2">
                      {energies.map((item) => (
                        <ChoiceButton
                          key={item.value}
                          selected={energy === item.value}
                          onClick={() => setEnergy(item.value)}
                        >
                          {item.label}
                        </ChoiceButton>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={goToCapture}
                    className="ml-auto mt-5 flex min-h-11 w-fit items-center gap-3 rounded-full bg-sage px-6 text-sm text-paper transition-colors enabled:hover:bg-ink disabled:cursor-not-allowed disabled:bg-sand disabled:text-coffee focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                  >
                    Revelar minha direção <ArrowRight className="h-4 w-4" aria-hidden />
                  </button>
                </section>
              )}

              {phase === "capture" && intent && energy && (
                <section aria-labelledby="capture-title">
                  <button
                    type="button"
                    onClick={() => setPhase("quiz")}
                    className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-coffee hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar às respostas
                  </button>
                  <p className="text-xs uppercase tracking-[0.22em] text-sage">
                    Seu destino te espera...
                  </p>
                  <h2
                    id="capture-title"
                    className="mt-3 font-serif text-3xl leading-[1.04] sm:text-4xl"
                  >
                    Falta só um passo para você descobrir a viagem que mais combina com você.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-coffee sm:text-base">
                    Como podemos te enviar as informações de seu destino ideal?
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2" aria-label="Respostas selecionadas">
                    <span className="rounded-full bg-sand/45 px-4 py-2 text-sm">
                      {intents.find((item) => item.value === intent)?.label}
                    </span>
                    <span className="rounded-full bg-sand/45 px-4 py-2 text-sm">
                      {energies.find((item) => item.value === energy)?.label}
                    </span>
                  </div>

                  <form
                    name="bussola-trovr"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onSubmit={captureLead}
                    className="mt-6 grid gap-4 sm:grid-cols-2"
                  >
                    <input type="hidden" name="form-name" value="bussola-trovr" />
                    <input type="hidden" name="intent" value={intent ?? ""} />
                    <input type="hidden" name="energy" value={energy ?? ""} />
                    <input type="hidden" name="source_page" value="/" />
                    <p className="hidden">
                      <label>
                        Não preencha: <input name="bot-field" />
                      </label>
                    </p>
                    <div>
                      <label htmlFor="compass-name" className="mb-2 block text-sm text-coffee">
                        Como podemos chamar você?
                      </label>
                      <input
                        id="compass-name"
                        name="name"
                        autoComplete="name"
                        required
                        className="form-field"
                      />
                    </div>
                    <div>
                      <label htmlFor="compass-email" className="mb-2 block text-sm text-coffee">
                        Onde enviamos suas próximas descobertas?
                      </label>
                      <input
                        id="compass-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="form-field"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex min-h-12 items-center justify-center justify-self-end gap-3 rounded-full bg-sage px-7 text-sm text-paper transition-colors hover:bg-terracotta disabled:opacity-50 sm:col-span-2"
                    >
                      {submitting
                        ? "Preparando seu resultado..."
                        : "Ver meu perfil e minha experiência"}
                      {!submitting && <ArrowRight className="h-4 w-4" aria-hidden />}
                    </button>
                    <p className="text-xs leading-5 text-coffee sm:col-span-2">
                      Você também receberá as Cartas da Trovr, com destinos, temporadas e histórias
                      fora do óbvio. Pode sair quando quiser. Consulte nossa{" "}
                      <Link to="/privacidade" className="underline underline-offset-4">
                        política de privacidade
                      </Link>
                      .
                    </p>
                    {error && (
                      <p role="alert" className="text-sm text-terracotta sm:col-span-2">
                        {error}
                      </p>
                    )}
                  </form>
                </section>
              )}

              {phase === "result" && profile && signals && (
                <section aria-labelledby="profile-title" aria-live="polite">
                  <p className="text-xs uppercase tracking-[0.22em] text-sage">
                    Seu ponto de partida
                  </p>
                  <h2
                    id="profile-title"
                    className="mt-3 font-serif text-3xl leading-[1.04] sm:text-4xl"
                  >
                    {profile.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-coffee sm:text-base">
                    {profile.body}
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {[
                      ["Ritmo ideal", signals.rhythm],
                      ["Grupo ideal", signals.group],
                      ["Complexidade", signals.complexity],
                    ].map(([label, value]) => (
                      <div key={label} className="border-t-4 border-sand bg-sand/20 p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-coffee">{label}</p>
                        <p className="mt-2 font-serif text-lg">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-4 rounded-2xl bg-sage p-5 text-paper sm:grid-cols-[1fr_auto]">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-sand">
                        Sua primeira combinação
                      </p>
                      <h3 className="mt-2 font-serif text-2xl">{profile.experience}</h3>
                      <p className="mt-3 leading-6 text-paper/85">{profile.example}</p>
                    </div>
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-paper/40 font-serif text-2xl tabular-nums">
                      {profile.score}%<span className="sr-only"> de compatibilidade</span>
                    </div>
                  </div>

                  <p className="mt-5 text-sm leading-6 text-coffee">
                    Quer ajuda para escolher um destino ou planejar seu roteiro? Conheça as duas
                    modalidades de curadoria personalizada da Viagem Trovr.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setPhase("plans")}
                      className="inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-7 text-sm text-paper transition-colors hover:bg-terracotta"
                    >
                      Ver as curadorias da Viagem Trovr <ArrowRight className="h-4 w-4" aria-hidden />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPhase("quiz")}
                      className="min-h-12 rounded-full border border-coffee/30 px-6 text-sm hover:bg-sand/35"
                    >
                      Mudar minhas respostas
                    </button>
                  </div>
                </section>
              )}

              {phase === "plans" && (
                <section aria-labelledby="plans-title" aria-live="polite">
                  <button
                    type="button"
                    onClick={() => setPhase("result")}
                    className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm text-coffee hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao resultado
                  </button>
                  <p className="text-xs uppercase tracking-[0.22em] text-sage">
                    Viagem Trovr
                  </p>
                  <h2
                    id="plans-title"
                    className="mt-3 font-serif text-3xl leading-[1.04] sm:text-4xl"
                  >
                    Escolha sua curadoria personalizada.
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-coffee sm:text-base">
                    Aqui você encontra as mesmas curadorias da página Viagem Trovr. Escolha uma
                    modalidade para continuar no formulário da Viagem Trovr.
                  </p>

                  <div className="mt-6 grid gap-4">
                    {(["essencial", "premium"] as const).map((id) => {
                      const item = VIAGEM_PLANS[id];
                      return (
                        <article key={id} className="rounded-2xl border border-coffee/25 bg-paper p-5">
                          <p className="text-xs uppercase tracking-[0.18em] text-sage">{item.name}</p>
                          <h3 className="mt-3 text-balance font-serif text-2xl">{item.title}</h3>
                          <p className="mt-3 text-2xl tabular-nums">
                            {formatPlanPrice(item.price)} <span className="text-sm">· Valor total</span>
                          </p>
                          <p className="mt-2 text-sm text-coffee">{item.paymentTerms}</p>
                          <p className="mt-4 text-pretty text-sm leading-6 text-coffee">
                            {item.description}
                          </p>
                          <ul className="mt-4 space-y-2 text-sm leading-6 text-coffee">
                            {item.items.map((detail) => (
                              <li key={detail} className="flex gap-2">
                                <Check className="mt-1 size-4 shrink-0 text-sage" aria-hidden />
                                {detail}
                              </li>
                            ))}
                          </ul>
                          <p className="mt-4 text-sm leading-6 text-coffee">{item.exclusions}</p>
                          <Link
                            to="/viagem"
                            search={{ plan: id }}
                            hash="candidatura"
                            onClick={() =>
                              trackEvent("select_compass_plan", {
                                plan: id,
                                intent: intent ?? undefined,
                                energy: energy ?? undefined,
                              })
                            }
                            className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-sage px-5 py-2 text-center text-sm text-paper transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
                          >
                            {item.cta}
                          </Link>
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {!open && canShowWall && (
        <button
          type="button"
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-5 text-sm text-paper shadow-lg transition-colors hover:bg-ink motion-safe:active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-sage"
        >
          Bússola Trovr <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </Dialog.Root>
  );
}
