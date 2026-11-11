import { useState, type FormEvent } from "react";
import { useT } from "@/i18n/useT";
import { TRIP_PRESENTATION } from "@/lib/trip-presentation";

export function InquireForm({
  tripId,
  tripName,
  operator,
  soon = false,
}: {
  tripId?: string;
  tripName?: string;
  operator?: string;
  soon?: boolean;
}) {
  const t = useT();
  const [company, setCompany] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    // Submit to Netlify Forms: form-encoded POST to the STATIC "/__forms.html"
    // path (not "/", which the SSR function owns and would swallow, returning a
    // 200 HTML page that looks like success). Static paths are served before the
    // SSR catch-all, so Netlify's form pipeline actually captures the submission.
    const data = new FormData(e.currentTarget);
    data.set("source_page", typeof window !== "undefined" ? window.location.href : "");
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
      // capture, so we must not show the success state.
      const body = await res.text();
      const captured =
        res.ok && (res.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Not captured by Netlify Forms");
      setSent(true);
    } catch {
      setError(t.inquiry.error);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="mt-16 border border-stone/30 px-6 py-14 text-center">
        <p className="font-serif text-xl italic text-ink sm:text-2xl">{t.inquiry.success}</p>
        <p className="mt-8 font-serif text-3xl uppercase tracking-[0.04em] text-ink">TROVR</p>
      </div>
    );
  }

  return (
    <form
      name="inquiry"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      id={tripId ? "interesse" : "contato"}
      className="experience-form mt-12"
    >
      <input type="hidden" name="form-name" value="inquiry" />
      {tripId && <input type="hidden" name="trip_id" value={tripId} />}
      {tripName && <input type="hidden" name="trip_name" value={tripName} />}
      {operator && <input type="hidden" name="operator" value={operator} />}
      <p className="hidden">
        <label>
          Não preencha este campo: <input name="bot-field" />
        </label>
      </p>
      <h2>{soon ? "Receba novidades sobre o kitesurf a bordo" : tripId ? "Vamos falar sobre essa experiência?" : "Conte o que você quer viver"}</h2>
      <p className="mt-3 text-stone">{soon ? "Deixe seu e-mail para receber novidades quando a viagem ganhar forma." : "Compartilhe o que você tem em mente. A conversa começa com a experiência que você quer viver."}</p>
      <div className="mt-6 grid gap-4">
        <Field name="name" label="Nome" required />
        <Field name="email" label="E-mail" type="email" required />
        {!soon && (
          <>
            {!tripId && (
              <label>Qual experiência chamou sua atenção?
                <select name="trip_name" className="experience-field">
                  <option>Ainda estou explorando</option>
                  {Object.entries(TRIP_PRESENTATION).map(([id, trip]) =>
                    trip && <option key={id}>{trip.title}</option>
                  )}
                </select>
              </label>
            )}
            <label>Como você pensa em viajar?
              <select name="company" className="experience-field" value={company} onChange={(event) => setCompany(event.target.value)} required>
                <option value="">Escolha uma opção</option>
                <option>Vou por conta própria</option>
                <option>Já tenho um grupo</option>
                <option>Tenho interesse em viajar com outras pessoas</option>
              </select>
            </label>
            {company === "Já tenho um grupo" && (
              <label>Quantas pessoas, aproximadamente?
                <input name="group_size" type="number" min={2} className="experience-field" />
              </label>
            )}
            <Field name="when" label="Quando você pensa em ir? (opcional)" placeholder="Ex.: no segundo semestre ou tenho flexibilidade" />
            <label>O que mais quer contar? (opcional)
              <textarea name="about" rows={2} className="experience-field" />
            </label>
          </>
        )}
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{t.inquiry.error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-8 w-full border border-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-50"
      >
        {submitting ? t.inquiry.sending : soon ? "Quero receber novidades" : "Enviar meu interesse"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={"inquiry-" + name} className="text-[11px] uppercase tracking-[0.2em] text-stone">{label}</label>
      <input
        id={"inquiry-" + name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border border-stone/30 bg-transparent px-3 py-2 font-serif text-base text-ink focus:border-ink focus:outline-none"
      />
    </div>
  );
}
