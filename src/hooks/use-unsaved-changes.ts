import { useEffect } from "react";

/**
 * Warns the user before leaving the page when `active` is true.
 *
 * Use this with auto-save: pass `state === "saving"` so the prompt
 * fires only while a debounced save is pending.
 *
 * Note: modern browsers ignore the custom message and show a
 * standardized prompt. We only need to call preventDefault and set
 * returnValue for the prompt to appear.
 */
export function useUnsavedChanges(active: boolean) {
  useEffect(() => {
    if (!active) return;
    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [active]);
}