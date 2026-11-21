import { useEffect, useState } from "react";

/** Recolhe controles flutuantes perto do contato, sem cobrir os formulários. */
export function useContactInView(routeKey = "") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const targets = document.querySelectorAll(".experience-form, .contact-channels, .kite-contact");
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    }, { rootMargin: "80px 0px" });
    setInView(false);
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [routeKey]);
  return inView;
}
