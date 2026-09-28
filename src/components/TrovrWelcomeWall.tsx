import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, LockKeyhole, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type Phase = "quiz" | "capture" | "result" | "plans";
type Intent = "challenge" | "slow" | "learn" | "reconnect";
type Energy = "light" | "active" | "physical" | "unsure";
type Plan = "mapa-completo" | "plano-pessoal";

const STORAGE_KEY = "trovr-welcome-wall-v1";
const DISMISSAL_WINDOW = 30 * 24 * 60 * 60 * 1000;

const intents: Array<{ value: Intent; label: string }> = [
  { value: "challenge", label: "Superar um limite" },
  { value: "slow", label: "Desacelerar de verdade" },
  { value: "learn", label: "Aprender algo novo" },
  { value: "reconnect", label: "Me reconectar comigo" },
];

const energies: Array<{ value: Energy; label: string }> = [
  { value: "light", label: "Leve e contemplativo" },
  { value: "active", label: "Ativo, sem ser extremo" },
  { value: "physical", label: "Quero um desafio físico" },
  { value: "unsure", label: "Ainda não sei" },
];

const profiles: Record<
  Intent,
  { title: string; body: string; experience: string; example: string; score: number }
> = {
  challenge: {
    title: "Exploradora de travessias",
    body: "Você encontra sentido quando a viagem pede presença, preparo e um pouco de coragem. O desafio importa, mas precisa deixar uma história maior que o esforço.",
    experience: "Trilha + travessia",
    example: "4–7 dias · preparo progressivo · natureza em primeiro plano",
    score: 91,
  },
  slow: {
    title: "Exploradora de presença",
    body: "Você não quer preencher cada hora. Procura paisagens que diminuam o ruído, encontros locais e tempo suficiente para perceber onde chegou.",
    experience: "Vela + vida entre ilhas",
    example: "5–8 dias · ritmo leve · boa para desacelerar sem ficar parada",
    score: 87,
  },
  learn: {
    title: "Exploradora de descoberta",
    body: "Você viaja melhor quando volta sabendo fazer, enxergar ou compreender algo que antes não fazia parte do seu mundo.",
    experience: "Mergulho + vida a bordo",
    example: "5–8 dias · preparação básica · aprendizado e convivência",
    score: 89,
  },
  reconnect: {
    title: "Exploradora de profundidade",
    body: "Você não procura adrenalina pela adrenalina. Precisa de movimento, natureza e uma história que faça a viagem continuar depois da volta.",
    experience: "Trilha + refúgio na natureza",
    example: "4–6 dias · pausas reais · boa para recuperar perspectiva",
    score: 88,
  },
};

const energySignals: Record<Energy, { rhythm: string; group: string; complexity: string }> = {
  light: { rhythm: "Contemplativo", group: "1–4 pessoas", complexity: "Baixa" },
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
      className={`min-h-14 rounded-xl border px-4 py-3 text-left text-sm leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 ${
        selected
          ? "border-sage bg-sage text-paper"
          : "border-coffee/25 bg-paper text-ink hover:border-sage hover:bg-sand/35"
      }`}
    >
      {children}
    </button>
  );
}

export function TrovrWelcomeWall() {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [intent, setIntent] = useState<Intent | null>(null);
  const [energy, setEnergy] = useState<Energy | null>(null);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [planSubmitting, setPlanSubmitting] = useState<Plan | null>(null);
  const [planError, setPlanError] = useState<string | null>(null);

  useEffect(() => {
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
    }, 350);
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

  const registerPlanInterest = async (plan: Plan) => {
    if (!intent || !energy || !email) return;
    setPlanSubmitting(plan);
    setPlanError(null);
    const data = new FormData();
    data.set("form-name", "bussola-interesse");
    data.set("email", email);
    data.set("produto", plan);
    data.set("intent", intent);
    data.set("energy", energy);
    data.set("source_page", "/");
    try {
      await submitNetlifyForm(data);
      trackEvent("select_compass_plan", { plan, intent, energy });
      setSelectedPlan(plan);
    } catch {
      setPlanError("Não conseguimos registrar seu interesse. Tente novamente em instantes.");
    } finally {
      setPlanSubmitting(null);
    }
  };

  const step = phase === "quiz" ? 1 : phase === "capture" ? 2 : phase === "result" ? 3 : 4;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <Dialog.Content className="fixed inset-0 z-[100] overflow-y-auto bg-paper text-ink focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none lg:inset-6 lg:rounded-3xl lg:border lg:border-paper/40 lg:shadow-2xl">
          <Dialog.Title className="sr-only">Bússola Trovr</Dialog.Title>
          <Dialog.Description className="sr-only">
            Descubra seu perfil de viagem e receba uma recomendação gratuita.
          </Dialog.Description>

          <div className="grid min-h-full lg:grid-cols-[minmax(300px,0.82fr)_minmax(560px,1.18fr)]">
            <aside className="relative hidden min-h-full overflow-hidden bg-ink lg:block">
              <img
                src="/images/alula-hero.jpg"
                alt="Formações rochosas no deserto de AlUla"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div aria-hidden className="brand-photo-overlay absolute inset-0" />
              <div className="relative flex min-h-full flex-col justify-between p-10 text-paper xl:p-14">
                <p className="text-xl uppercase tracking-[0.18em]">Trovr</p>
                <blockquote className="max-w-md font-serif text-4xl leading-[1.08] xl:text-5xl">
                  O destino vem depois. Primeiro, descubra o que precisa viver.
                </blockquote>
                <p className="text-sm text-paper/80">Bússola Trovr · versão inicial</p>
              </div>
            </aside>

            <div className="flex min-h-full flex-col">
              <header className="flex items-center justify-between border-b border-coffee/15 px-5 py-3 sm:px-8">
                <div>
                  <p className="text-base uppercase tracking-[0.18em] lg:hidden">Trovr</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-coffee">
                    Bússola Trovr · {step} de 4
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => close("close_button")}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-coffee/25 px-4 text-xs uppercase tracking-[0.14em] transition-colors hover:bg-sand/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                >
                  <span className="hidden sm:inline">Continuar no site</span>
                  <X className="h-4 w-4" aria-hidden />
                  <span className="sr-only sm:hidden">Fechar e continuar no site</span>
                </button>
              </header>

              <div className="flex flex-1 items-center px-5 py-5 sm:px-10 lg:px-14 xl:px-20">
                <div className="mx-auto w-full max-w-3xl">
                  {phase === "quiz" && (
                    <section aria-labelledby="compass-question">
                      <p className="text-xs uppercase tracking-[0.22em] text-sage">
                        Seu ponto de partida
                      </p>
                      <h2
                        id="compass-question"
                        className="mt-3 max-w-2xl font-serif text-4xl leading-[1.04] sm:text-[2.5rem]"
                      >
                        Que tipo de viagem está tentando aparecer na sua vida?
                      </h2>
                      <p className="mt-4 max-w-2xl text-base leading-7 text-coffee sm:text-lg">
                        Duas respostas revelam uma primeira direção. O destino vem depois.
                      </p>

                      <fieldset className="mt-6">
                        <legend className="font-serif text-xl">O que você quer sentir?</legend>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                        <legend className="font-serif text-xl">Quanto movimento você quer?</legend>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                        className="mt-6 inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-7 text-sm text-paper transition-colors hover:bg-terracotta disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
                      >
                        Descobrir meu perfil <ArrowRight className="h-4 w-4" aria-hidden />
                      </button>
                    </section>
                  )}

                  {phase === "capture" && intent && energy && (
                    <section aria-labelledby="capture-title">
                      <button
                        type="button"
                        onClick={() => setPhase("quiz")}
                        className="mb-8 inline-flex items-center gap-2 text-sm text-coffee hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar às respostas
                      </button>
                      <p className="text-xs uppercase tracking-[0.22em] text-sage">
                        Seu perfil está pronto
                      </p>
                      <h2
                        id="capture-title"
                        className="mt-4 font-serif text-4xl leading-[1.04] sm:text-5xl"
                      >
                        Onde enviamos sua primeira direção?
                      </h2>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-coffee sm:text-lg">
                        Você verá gratuitamente seu perfil, o ritmo ideal e uma experiência
                        compatível. Também passa a receber as Cartas da Trovr.
                      </p>

                      <div
                        className="mt-7 flex flex-wrap gap-2"
                        aria-label="Respostas selecionadas"
                      >
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
                        className="mt-9 grid gap-4 sm:grid-cols-2"
                      >
                        <input type="hidden" name="form-name" value="bussola-trovr" />
                        <input type="hidden" name="intent" value={intent} />
                        <input type="hidden" name="energy" value={energy} />
                        <input type="hidden" name="source_page" value="/" />
                        <p className="hidden">
                          <label>
                            Não preencha: <input name="bot-field" />
                          </label>
                        </p>
                        <div>
                          <label htmlFor="compass-name" className="mb-2 block text-sm text-coffee">
                            Seu nome
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
                            Seu melhor email
                          </label>
                          <input
                            id="compass-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="form-field"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={submitting}
                          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-sage px-7 text-sm text-paper transition-colors hover:bg-terracotta disabled:opacity-50 sm:col-span-2 sm:justify-self-start"
                        >
                          {submitting
                            ? "Preparando seu resultado..."
                            : "Revelar meu perfil gratuito"}
                          {!submitting && <ArrowRight className="h-4 w-4" aria-hidden />}
                        </button>
                        <p className="text-xs leading-5 text-coffee sm:col-span-2">
                          Ao continuar, você concorda em receber conteúdos da Trovr. Pode sair
                          quando quiser. Consulte nossa{" "}
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
                        Seu perfil de viagem
                      </p>
                      <h2
                        id="profile-title"
                        className="mt-4 font-serif text-4xl leading-[1.04] sm:text-5xl"
                      >
                        {profile.title}
                      </h2>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-coffee sm:text-lg">
                        {profile.body}
                      </p>

                      <div className="mt-8 grid gap-3 sm:grid-cols-3">
                        {[
                          ["Ritmo ideal", signals.rhythm],
                          ["Grupo ideal", signals.group],
                          ["Complexidade", signals.complexity],
                        ].map(([label, value]) => (
                          <div key={label} className="border-t-4 border-sand bg-sand/20 p-4">
                            <p className="text-xs uppercase tracking-[0.14em] text-coffee">
                              {label}
                            </p>
                            <p className="mt-2 font-serif text-lg">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 grid gap-5 rounded-2xl bg-sage p-6 text-paper sm:grid-cols-[1fr_auto] sm:p-7">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-sand">
                            Uma direção liberada
                          </p>
                          <h3 className="mt-3 font-serif text-3xl">{profile.experience}</h3>
                          <p className="mt-3 leading-6 text-paper/85">{profile.example}</p>
                        </div>
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-paper/40 font-serif text-3xl">
                          {profile.score}%<span className="sr-only"> de compatibilidade</span>
                        </div>
                      </div>

                      <div className="mt-6 divide-y divide-coffee/15 border-y border-coffee/15">
                        {[
                          [
                            "Suas outras 4 experiências compatíveis",
                            "com o motivo de cada combinação",
                          ],
                          [
                            "12 destinos e melhores épocas",
                            "comparados por clima, custo e dificuldade",
                          ],
                          ["Faixas de investimento", "quanto muda entre as alternativas"],
                          ["Riscos e perguntas ao operador", "o que verificar antes de pagar"],
                        ].map(([title, detail]) => (
                          <div
                            key={title}
                            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-4"
                          >
                            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sand/35 text-coffee">
                              <LockKeyhole className="h-4 w-4" aria-hidden />
                            </span>
                            <div>
                              <p className="font-serif text-lg">{title}</p>
                              <p className="text-sm text-coffee">{detail}</p>
                            </div>
                            <span
                              aria-hidden
                              className="hidden h-2 w-16 rounded-full bg-coffee/15 blur-[1px] sm:block"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setPhase("plans")}
                          className="inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-7 text-sm text-paper transition-colors hover:bg-terracotta"
                        >
                          Abrir minhas opções <ArrowRight className="h-4 w-4" aria-hidden />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhase("quiz")}
                          className="min-h-12 rounded-full border border-coffee/30 px-6 text-sm hover:bg-sand/35"
                        >
                          Refazer respostas
                        </button>
                      </div>
                    </section>
                  )}

                  {phase === "plans" && (
                    <section aria-labelledby="plans-title" aria-live="polite">
                      <button
                        type="button"
                        onClick={() => setPhase("result")}
                        className="mb-8 inline-flex items-center gap-2 text-sm text-coffee hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar ao resultado
                      </button>
                      <p className="text-xs uppercase tracking-[0.22em] text-sage">
                        Escolha a profundidade
                      </p>
                      <h2
                        id="plans-title"
                        className="mt-4 font-serif text-4xl leading-[1.04] sm:text-5xl"
                      >
                        Continue explorando do seu jeito.
                      </h2>
                      <p className="mt-5 max-w-2xl text-base leading-7 text-coffee sm:text-lg">
                        O resultado gratuito explica seu perfil. As próximas camadas ajudam a tomar
                        a decisão.
                      </p>

                      <div className="mt-8 grid gap-4 md:grid-cols-2">
                        <article className="flex flex-col rounded-2xl border border-coffee/20 bg-paper p-6">
                          <p className="text-xs uppercase tracking-[0.18em] text-sage">
                            Mapa completo
                          </p>
                          <h3 className="mt-3 font-serif text-3xl">Descobrir</h3>
                          <p className="mt-3 font-serif text-3xl">R$ 79</p>
                          <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-coffee">
                            {[
                              "5 experiências compatíveis",
                              "12 destinos comparados",
                              "épocas, custo e esforço",
                              "checklist para escolher operador",
                            ].map((item) => (
                              <li key={item} className="flex gap-2">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-sage" aria-hidden />{" "}
                                {item}
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            disabled={planSubmitting !== null}
                            onClick={() => registerPlanInterest("mapa-completo")}
                            className="mt-6 min-h-12 rounded-full border border-sage px-5 text-sm text-sage transition-colors hover:bg-sage hover:text-paper disabled:opacity-50"
                          >
                            {planSubmitting === "mapa-completo"
                              ? "Registrando..."
                              : "Tenho interesse no Mapa"}
                          </button>
                        </article>

                        <article className="flex flex-col rounded-2xl border-2 border-sage bg-sand/20 p-6">
                          <p className="text-xs uppercase tracking-[0.18em] text-sage">
                            Plano pessoal
                          </p>
                          <h3 className="mt-3 font-serif text-3xl">Decidir</h3>
                          <p className="mt-3 font-serif text-3xl">R$ 249</p>
                          <ul className="mt-5 flex-1 space-y-3 text-sm leading-6 text-coffee">
                            {[
                              "tudo do Mapa completo",
                              "datas e orçamento considerados",
                              "3 rotas concretas",
                              "1 recomendação final Trovr",
                            ].map((item) => (
                              <li key={item} className="flex gap-2">
                                <Check className="mt-1 h-4 w-4 shrink-0 text-sage" aria-hidden />{" "}
                                {item}
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            disabled={planSubmitting !== null}
                            onClick={() => registerPlanInterest("plano-pessoal")}
                            className="mt-6 min-h-12 rounded-full bg-sage px-5 text-sm text-paper transition-colors hover:bg-terracotta disabled:opacity-50"
                          >
                            {planSubmitting === "plano-pessoal"
                              ? "Registrando..."
                              : "Tenho interesse no Plano pessoal"}
                          </button>
                        </article>
                      </div>

                      {selectedPlan && (
                        <div className="mt-5 rounded-xl bg-sage px-5 py-4 text-sm leading-6 text-paper">
                          Interesse registrado. A Trovr entrará em contato pelo email informado.
                          {selectedPlan === "plano-pessoal" && (
                            <>
                              {" "}
                              Se preferir, você já pode{" "}
                              <Link to="/roteiro" className="underline underline-offset-4">
                                contar mais sobre a viagem
                              </Link>
                              .
                            </>
                          )}
                        </div>
                      )}
                      {planError && (
                        <p role="alert" className="mt-5 text-sm text-terracotta">
                          {planError}
                        </p>
                      )}
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {!open && (
        <button
          type="button"
          onClick={() => handleOpenChange(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex min-h-12 items-center gap-3 rounded-full bg-sage px-5 text-sm text-paper shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-terracotta focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-sage"
        >
          Bússola Trovr <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      )}
    </Dialog.Root>
  );
}
