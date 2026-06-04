import MDEditor from "@uiw/react-md-editor";

/**
 * Side-by-side markdown editor. Light theme to match utility admin UI.
 * Wrapping div forces the white background and Inter typography.
 */
export function MarkdownEditor({
  value,
  onChange,
  height = 400,
}: {
  value: string;
  onChange: (v: string) => void;
  height?: number;
}) {
  return (
    <div data-color-mode="light" className="rounded-md overflow-hidden border border-[#e5e5e5]">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        height={height}
        preview="live"
        visibleDragbar={false}
      />
    </div>
  );
}