import type { SaveState } from "@/hooks/use-auto-save";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export function SaveStatus({ state, error }: { state: SaveState; error?: string | null }) {
  if (state === "idle")
    return <span className="text-xs text-[#a3a3a3]">—</span>;
  if (state === "saving")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#737373]">
        <Loader2 className="h-3 w-3 animate-spin" /> Saving…
      </span>
    );
  if (state === "saved")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-[#16a34a]">
        <Check className="h-3 w-3" /> Saved
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-[#b91c1c]" title={error ?? ""}>
      <AlertCircle className="h-3 w-3" /> Save failed
    </span>
  );
}