import { useState, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Side-by-side editor + live preview wrapper.
 *
 * When `enabled` is true (via the toggle button), the layout splits 50/50
 * on lg+ screens. The preview is rendered from the same React state as the
 * form so it updates instantly — no debounce, no server round-trip.
 *
 * On smaller screens the preview drops below the form.
 */
export function PreviewPane({
  form,
  preview,
  defaultOpen = false,
  previewLabel = "Preview",
}: {
  form: ReactNode;
  preview: ReactNode;
  defaultOpen?: boolean;
  previewLabel?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5] bg-white"
          aria-pressed={open}
        >
          {open ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {open ? `Hide ${previewLabel.toLowerCase()}` : previewLabel}
        </button>
      </div>
      <div className={open ? "grid gap-6 lg:grid-cols-2" : ""}>
        <div className={open ? "min-w-0" : ""}>{form}</div>
        {open && (
          <div className="min-w-0">
            <div className="sticky top-4 max-h-[calc(100vh-2rem)] overflow-auto rounded-lg border border-[#e5e5e5] bg-white shadow-sm">
              <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#737373]">
                Live preview
              </div>
              {preview}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
