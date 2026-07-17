import { useRouter } from "@tanstack/react-router";
import { LOCALE_COOKIE, type Locale } from "@/i18n";
import { useLocale } from "@/i18n/useT";

/**
 * EN/PT switch. Writes the choice to a cookie (which outranks geo detection)
 * and calls router.invalidate() so the root beforeLoad re-runs and the whole
 * tree re-renders in the new language instantly — no navigation, no flash.
 */
export function LocaleToggle({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  const router = useRouter();
  const locale = useLocale();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.invalidate();
  };

  const base = "text-[10.5px] uppercase tracking-[0.22em] transition-colors";
  const activeCls = tone === "light" ? "text-white" : "text-ink";
  const idleCls = tone === "light" ? "text-white/60 hover:text-white" : "text-mid hover:text-ink";
  const sepCls = tone === "light" ? "text-white/40" : "text-mid/50";

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={`${base} ${locale === "en" ? activeCls : idleCls}`}
      >
        EN
      </button>
      <span aria-hidden className={sepCls}>
        /
      </span>
      <button
        type="button"
        onClick={() => setLocale("pt")}
        aria-pressed={locale === "pt"}
        className={`${base} ${locale === "pt" ? activeCls : idleCls}`}
      >
        PT
      </button>
    </div>
  );
}

export default LocaleToggle;
