import { Link } from "@tanstack/react-router";
import { useT } from "@/i18n/useT";

/**
 * The single site footer, replacing four near-duplicate copies. `variant`
 * selects the tagline: "default" (Travel to find…) or "spots" (A guide to the
 * places worth the journey). `email` shows the hello@trovr.agency copyright
 * line used on the About page.
 */
export function SiteFooter({
  variant = "default",
  email = false,
}: {
  variant?: "default" | "spots";
  email?: boolean;
}) {
  const t = useT();
  const tagline = variant === "spots" ? t.footer.spotsTagline : t.footer.tagline;

  return (
    <footer className="border-t border-stone/20 px-6 py-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <Link to="/" className="font-serif text-5xl lowercase text-ink sm:text-6xl">
          trovr
        </Link>
        <p className="font-serif text-base italic text-stone sm:text-lg">{tagline}</p>
        <p className="text-xs tracking-wide text-stone">
          {email ? t.footer.copyrightEmail : t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
