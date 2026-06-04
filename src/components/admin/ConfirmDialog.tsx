import type { ReactNode } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onCancel,
  onConfirm,
  busy,
}: {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  busy?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white shadow-lg border border-[#e5e5e5]">
        <div className="p-5">
          <h3 className="text-sm font-semibold text-[#1a1a1a]">{title}</h3>
          <div className="mt-2 text-sm text-[#525252]">{description}</div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-3 border-t border-[#e5e5e5] bg-[#fafafa] rounded-b-lg">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-3 py-1.5 text-sm text-[#525252] hover:bg-[#f1f1f1] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="px-3 py-1.5 text-sm text-white bg-[#dc2626] hover:bg-[#b91c1c] rounded-md disabled:opacity-50"
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}