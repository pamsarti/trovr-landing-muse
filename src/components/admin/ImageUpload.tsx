import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Loader2 } from "lucide-react";

const BUCKET = "trovr-media";
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_BYTES = 5 * 1024 * 1024;

/**
 * Uploads to the private trovr-media bucket and stores the storage PATH
 * on the field (not a URL). Use <ImagePreview path={...} /> to render
 * a signed URL for display.
 *
 * `folder` controls the path prefix, e.g. "trips/<trip-id>".
 */
export function ImageUpload({
  value,
  onChange,
  folder,
}: {
  value: string | null | undefined;
  onChange: (path: string | null) => void;
  folder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function upload(file: File) {
    setErr(null);
    if (!ALLOWED.includes(file.type)) {
      setErr("Only JPG, PNG, or WebP files.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setErr("Max 5MB per image.");
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

  return (
    <div>
      <div className="flex items-start gap-3">
        <ImagePreview path={value} className="h-[120px] w-[120px] rounded-md border border-[#e5e5e5] bg-[#fafafa] object-cover" />
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm border border-[#e5e5e5] rounded-md hover:bg-[#f5f5f5] disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {value ? "Replace" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-[#525252] hover:bg-[#f5f5f5] rounded-md"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
          <p className="text-xs text-[#a3a3a3]">JPG / PNG / WebP · max 5MB</p>
        </div>
      </div>
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
      {err && <p className="mt-2 text-xs text-[#b91c1c]">{err}</p>}
    </div>
  );
}

/** Renders a thumbnail from a stored storage path via short-lived signed URL. */
export function ImagePreview({
  path,
  className,
}: {
  path: string | null | undefined;
  className?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (!path) {
      setUrl(null);
      return;
    }
    // If it's already a full URL (legacy data), use as-is.
    if (/^https?:\/\//i.test(path)) {
      setUrl(path);
      return;
    }
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 3600)
      .then(({ data, error }) => {
        if (cancelled) return;
        setUrl(error ? null : (data?.signedUrl ?? null));
      });
    return () => {
      cancelled = true;
    };
  }, [path]);
  if (!url)
    return (
      <div className={`${className ?? ""} flex items-center justify-center text-xs text-[#a3a3a3]`}>
        No image
      </div>
    );
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={url} alt="" className={className} />;
}