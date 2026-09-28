import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Pause, Play } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { useT } from "@/i18n/useT";
import { seoT } from "@/i18n/seoT";

export const Route = createFileRoute("/about")({
  loader: ({ context }) => ({ locale: (context as { locale?: import("@/i18n").Locale }).locale }),
  head: ({ loaderData }) => {
    const t = seoT(loaderData?.locale);
    return {
      meta: [
        { title: t.seo.aboutTitle },
        {
          name: "description",
          content: t.seo.aboutDescription,
        },
        { property: "og:title", content: t.seo.aboutTitle },
        {
          property: "og:description",
          content: t.seo.aboutDescription,
        },
        { property: "og:url", content: `${SITE_URL}/about` },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: t.seo.aboutTitle },
        {
          name: "twitter:description",
          content: t.seo.aboutDescription,
        },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.about.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  return (
    <main className="bg-paper text-ink font-sans antialiased">
      <SiteHeader transparent />
      <Hero />
      <WhyExists />
      <HowWeCurate />
      <Newsletter />
      <Faq />
      <SiteFooter />
    </main>
  );
}

const HERO_SLIDES = [
  {
    src: "/images/providencia-hero.jpg",
    alt: "Mar azul e natureza em Providencia, Colômbia",
  },
  {
    src: "/images/thailand-hero.jpg",
    alt: "Mar e formações naturais na Tailândia",
  },
  {
    src: "/images/alula-horseback-1.jpg",
    alt: "Cavalgada entre as formações rochosas de AlUla",
  },
];

function Hero() {
  const t = useT();
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (paused || reducedMotion) return;
    const timer = setInterval(() => setI((n) => (n + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, [paused]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="relative isolate h-[100svh] w-full overflow-hidden bg-ink">
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.src}
          aria-hidden={idx !== i}
          className="absolute inset-0 z-0 transition-opacity duration-[1400ms] ease-in-out motion-reduce:transition-none"
          style={{
            opacity: idx === i ? 1 : 0,
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
      ))}
      <div className="brand-photo-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div
        className={`relative z-10 flex h-full items-center justify-center px-6 transition-all duration-[1400ms] ease-out motion-reduce:transition-none ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="mx-auto max-w-3xl text-center text-paper">
          <h1 className="whitespace-pre-line font-serif text-4xl leading-[1.15] sm:text-5xl md:text-6xl">
            {t.about.heroHeadline}
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-[1.6] text-paper/80 sm:mt-10 sm:text-lg">
            {t.about.heroSubtext}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? t.home.playGallery : t.home.pauseGallery}
        className="absolute right-6 bottom-6 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-paper/60 bg-ink/20 text-paper backdrop-blur-sm transition-colors hover:bg-ink/50"
      >
        {paused ? (
          <Play className="h-4 w-4" aria-hidden />
        ) : (
          <Pause className="h-4 w-4" aria-hidden />
        )}
      </button>
    </section>
  );
}

function WhyExists() {
  const t = useT();
  const paragraphs = [t.about.whyP1, t.about.whyP2, t.about.whyP3];
  return (
    <section className="relative bg-paper px-6 py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-[720px] space-y-8">
        {paragraphs.map((p, i) => (
          <p
            key={i}
            className="font-serif text-lg leading-[1.6] text-ink sm:text-xl md:text-[22px]"
          >
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}

function HowWeCurate() {
  const t = useT();
  const principles = [
    { title: t.about.principle1Title, body: t.about.principle1Body },
    { title: t.about.principle2Title, body: t.about.principle2Body },
    { title: t.about.principle3Title, body: t.about.principle3Body },
  ];

  return (
    <section className="relative border-t border-stone/15 bg-sand/30 px-6 py-10 sm:py-14 md:py-16">
      <div className="mx-auto max-w-[720px]">
        <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
          {t.about.curateHeading}
        </h2>
        <p className="mt-8 text-base leading-[1.75] text-ink/90 sm:text-[17px]">
          {t.about.curateIntro()}
        </p>
        <p className="mt-4 text-base leading-[1.75] text-ink/90 sm:text-[17px]">
          {t.about.curateIntro2}
        </p>
        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
          {principles.map((p) => (
            <div key={p.title}>
              <p className="font-serif text-xl italic leading-[1.35] text-ink sm:text-2xl md:text-[26px]">
                {p.title}
              </p>
              <p className="mt-4 text-base leading-[1.75] text-ink/90 sm:text-[17px]">{p.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-base leading-[1.75] text-ink/90 sm:mt-16 sm:text-[17px]">
          {t.about.curateClosing}
        </p>
      </div>
    </section>
  );
}

function Newsletter() {
  const t = useT();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bgIndex, setBgIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setBgIndex((n) => (n + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = document.getElementById("about-newsletter");
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setRevealed(true);
        });
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Netlify Forms: POST form-encoded to the STATIC "/__forms.html" path (not
    // "/", which the SSR function owns and would swallow). Submits as the same
    // registered "newsletter" form as the homepage. Only show the thank-you
    // state on a genuinely OK response.
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      // Proof of a real capture: Netlify's form pipeline answers with its
      // "Your form submission has been received" success page (and/or a 303
      // redirect to it). A plain 200 that echoes our own static __forms.html —
      // what `vite dev` returns locally, since it has no form backend, and what
      // the SSR function would return if it intercepted the POST — is NOT a
      // capture, so we must not show the thank-you state.
      const body = await res.text();
      const captured =
        res.ok && (res.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Not captured by Netlify Forms");
      setDone(true);
    } catch {
      setError(t.newsletter.error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="about-newsletter"
      className="relative isolate overflow-hidden text-paper"
      style={{ minHeight: "100svh" }}
    >
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={s.src}
          aria-hidden
          className="absolute inset-0 z-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{
            opacity: idx === bgIndex ? 1 : 0,
            backgroundImage: `url(${s.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
      ))}
      <div aria-hidden className="brand-photo-overlay pointer-events-none absolute inset-0 z-[1]" />
      <div
        className={`relative z-10 mx-auto flex min-h-[100svh] max-w-[520px] flex-col items-center justify-center px-6 py-24 text-center transition-all duration-[1400ms] ease-out ${
          revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="font-serif text-3xl leading-tight text-paper sm:text-4xl md:text-5xl">
          {t.about.newsletterHeadline}
        </h2>
        <p className="mt-5 text-base leading-[1.6] text-paper/75 sm:text-lg">
          {t.about.newsletterSubtext}
        </p>
        {done ? (
          <p className="mt-10 font-serif text-xl italic text-paper">{t.about.newsletterSuccess}</p>
        ) : (
          <form
            name="newsletter"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={onSubmit}
            className="mt-10 flex w-full flex-col gap-3 sm:flex-row"
          >
            <input type="hidden" name="form-name" value="newsletter" />
            <p className="hidden">
              <label>
                Não preencha este campo: <input name="bot-field" />
              </label>
            </p>
            <label htmlFor="about-newsletter-email" className="sr-only">
              Endereço de email
            </label>
            <input
              id="about-newsletter-email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletter.emailPlaceholder}
              className="flex-1 border border-paper/40 bg-paper/10 px-4 py-3 text-base text-paper placeholder:text-paper/60 backdrop-blur focus:border-paper focus:outline-none"
              style={{ borderRadius: 2 }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="border border-paper bg-paper/10 px-6 py-3 text-sm font-medium tracking-wide text-paper backdrop-blur transition-colors hover:bg-paper hover:text-ink disabled:opacity-60"
              style={{ borderRadius: 2 }}
            >
              {submitting ? t.newsletter.subscribing : t.newsletter.subscribe}
            </button>
          </form>
        )}
        {error && !done && (
          <p role="alert" className="mt-4 text-sm text-paper/80">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}

function Faq() {
  const t = useT();
  return (
    <section
      id="common-questions"
      className="border-t border-stone/15 px-6 py-10 sm:py-14 md:py-16"
    >
      <div className="mx-auto max-w-[720px]">
        <h2 className="font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl lg:text-6xl">
          {t.about.faqHeading}
        </h2>
        <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
          {t.about.faq.map((item) => (
            <div key={item.question}>
              <h3 className="font-serif text-xl italic leading-[1.35] text-ink sm:text-2xl md:text-[26px]">
                {item.question}
              </h3>
              <p className="mt-4 text-base leading-[1.75] text-ink/90 sm:text-[17px]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
