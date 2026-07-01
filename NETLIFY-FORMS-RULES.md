# Netlify Forms — Mandatory Rules for Lovable AI

**RULE: Every form in this project must use Netlify Forms, following this exact
pattern. Never deviate. If you create a new form, it must follow the same rules.**

Paste this file (or its "Rule" section) into Lovable's project instructions /
knowledge base so it applies to every generation, not just one prompt.

---

## Context (why the rules are strict)

This is a **TanStack Start (React SSR)** app deployed on **Netlify** with the
Nitro `netlify` preset. Because an SSR function owns the catch-all route,
Netlify Forms only works if forms follow the precise rules below.

Do **not** change the deployment, and do **not** invent alternative submission
methods (no Formspree, Resend, custom API endpoints, `action="/"`, `mailto:`,
etc.) unless a human explicitly instructs it.

---

## The Rules

Every form — existing or newly created — **must** follow all of these:

1. **Register the form in `public/__forms.html`.**
   This static file is how Netlify detects forms at deploy time. For every form,
   add a hidden `<form>` there with `name`, `data-netlify="true"`,
   `netlify-honeypot="bot-field"`, and **one input per field** the real form
   submits (including `bot-field`). If a form gains a new field, add it here too.
   A field that isn't declared here will **not** be captured.

2. **Form markup** in the React component must include:
   - `name="<form-name>"` — must exactly match the name in `__forms.html`
   - `method="POST"`, `data-netlify="true"`, `netlify-honeypot="bot-field"`
   - a hidden input: `<input type="hidden" name="form-name" value="<form-name>" />`
   - a hidden honeypot field named `bot-field`
   - a `name` attribute on **every** user input

3. **Submit via `fetch` to the STATIC `/__forms.html` path — never `/`.**
   Posting to `/` hits the SSR function, which swallows the request and Netlify
   never captures it. Body must be `application/x-www-form-urlencoded`.

4. **Only show the success/thank-you state on a PROVEN capture.**
   Netlify returns its "Your form submission has been received" page (sometimes
   as a direct `200`, not a redirect). Gate success on that proof. Never call the
   success setter unconditionally, and never gate on `res.ok` alone or
   `res.redirected` alone.

5. **Always implement pending (`submitting`) and `error` states.**
   On a non-capture, show an error — never a thank-you.

---

## Canonical Template

Copy this shape for every form.

```tsx
import { useState, type FormEvent } from "react";

function MyForm() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const data = new FormData(e.currentTarget);
    try {
      // POST to the STATIC "/__forms.html" path, never "/" (SSR would swallow it).
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      // Proof of a real Netlify capture: its "form submission has been received"
      // success page (and/or a 303 redirect to it). A plain 200 echoing our own
      // static __forms.html (local dev) or the SSR app page is NOT a capture.
      const body = await res.text();
      const captured =
        res.ok && (res.redirected || /form submission has been received/i.test(body));
      if (!captured) throw new Error("Not captured by Netlify Forms");
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return <p>Thank you. We'll be in touch soon.</p>;

  return (
    <form
      name="my-form"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="form-name" value="my-form" />
      <p className="hidden">
        <label>
          Don&apos;t fill this out if you&apos;re human: <input name="bot-field" />
        </label>
      </p>

      {/* real fields, each with a name */}
      <input type="email" name="email" required />

      <button type="submit" disabled={submitting}>
        {submitting ? "Sending…" : "Submit"}
      </button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

Add the matching declaration to `public/__forms.html`:

```html
<form name="my-form" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input type="email" name="email" />
  <input type="text" name="bot-field" />
</form>
```

---

## Definition of Done (checklist for every form)

- [ ] Declared in `public/__forms.html` with **all** fields
- [ ] `name` matches between the component, the hidden `form-name` input, and `__forms.html`
- [ ] Submits via `fetch("/__forms.html", …)`, form-encoded — **not** `/`
- [ ] Success shown **only** when `captured` is `true`; error otherwise
- [ ] Has `submitting` + `error` states, honeypot present
- [ ] No alternative backend, no `setDone(true)` (or equivalent) without the capture check

---

## Reference: forms already implemented this way

- **Homepage newsletter** — `src/routes/index.tsx` (form-name `newsletter`)
- **About newsletter** — `src/routes/about.tsx` (form-name `newsletter`)
- **Trip inquiry** — `src/routes/trips.$id.tsx` (form-name `inquiry`)
- **Declarations** — `public/__forms.html`

---

## Maintenance note

The capture check keys on Netlify's success-page wording
(`"Your form submission has been received"`) plus the `res.redirected` fallback.
That string is stable, but if Netlify ever changes it and a genuine submission
starts showing the error, that regex is the line to revisit. Quick debug:
`console.log(res.status, res.redirected, body.slice(0, 200))` to see what Netlify
actually returned.
