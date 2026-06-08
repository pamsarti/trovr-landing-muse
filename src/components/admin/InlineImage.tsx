import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { ImagePreview } from "@/components/admin/ImageUpload";

const BUCKET = "trovr-media";
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Hover-to-replace image. Renders an `<img>` (or the public ImagePreview
 * for storage paths). Hovering reveals a "Replace" overlay. Clicking opens
 * the file picker; on successful upload `onChange` receives the new path.
 *
 * `value` can be either:
 * - a storage path (preferred — rendered via signed URL)
 * - a full https URL (legacy placeholder photos)
 */
export function InlineImage({
  value,
  onChange,
  folder,
  className = "",
  alt = "",
  fallback,
}: {
  value: string | null | undefined;
  onChange: (path: string) => void;
  folder: string;
  className?: string;
  alt?: string;
  fallback?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setErr(null);
    if (!ALLOWED.includes(file.type)) {
      setErr("JPG / PNG / WebP only.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr("Max 5MB.");
      return;
    }
    setBusy(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${folder.replace(/^\/|\/$/g, "")}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      onChange(path);
    } catch (e: any) {
      setErr(e?.message ?? "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  const display = value || fallback;
  const isHttp = display && /^https?:\/\//i.test(display);

  return (
    <div className={`group relative ${className}`}>
      {display ? (
        isHttp ? (
          <img src={display} alt={alt} className="h-full w-full object-cover" />
        ) : (
          <ImagePreview path={display} className="h-full w-full object-cover" />
        )
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[#f5f5f5] text-xs text-[#a3a3a3]">
          No image
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 text-white text-xs uppercase tracking-[0.2em] opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100 disabled:bg-black/70"
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
          </>
        ) : (
          <>
            <Upload className="h-4 w-4" /> Replace
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
          e.target.value = "";
        }}
      />
      {err && (
        <p className="absolute left-2 bottom-2 rounded bg-[#fef2f2] px-2 py-1 text-[10px] text-[#b91c1c]">
          {err}
        </p>
      )}
    </div>
  );
}
