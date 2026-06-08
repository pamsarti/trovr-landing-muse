import { useEffect, useRef, useState } from "react";

/**
 * Click-to-edit text element. Renders the public-site styling unchanged
 * until the user clicks, then becomes contentEditable. Commits on blur
 * via `onCommit`. Esc reverts. Enter commits on single-line; on multiline
 * Enter inserts a newline and Cmd/Ctrl+Enter commits.
 *
 * The DOM contents are controlled imperatively (React does NOT re-render
 * children while editing) so the cursor stays put. External `value`
 * updates are reflected when not editing.
 */
export function InlineText({
  value,
  onCommit,
  as: Tag = "span",
  className = "",
  multiline = false,
  placeholder = "Click to edit",
}: {
  value: string;
  onCommit: (v: string) => void;
  as?: any;
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [editing, setEditing] = useState(false);

  // Sync DOM text from `value` when not editing.
  useEffect(() => {
    if (!editing && ref.current) {
      ref.current.innerText = value || "";
    }
  }, [value, editing]);

  function startEditing() {
    if (editing) return;
    setEditing(true);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  }

  function commit() {
    setEditing(false);
    const text = (ref.current?.innerText ?? "").replace(/\u00a0/g, " ");
    const trimmed = multiline ? text.replace(/\n+$/, "") : text.trim();
    if (trimmed !== value) onCommit(trimmed);
    else if (ref.current) ref.current.innerText = value || "";
  }

  const isEmpty = !value;

  return (
    <Tag
      ref={ref as any}
      contentEditable={editing}
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      onClick={startEditing}
      onFocus={startEditing}
      onBlur={commit}
      onKeyDown={(e: any) => {
        if (e.key === "Escape") {
          e.preventDefault();
          if (ref.current) ref.current.innerText = value || "";
          setEditing(false);
        } else if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      className={`${className} cursor-text outline-none rounded-[2px] transition-colors ${
        editing
          ? "ring-1 ring-[#3b82f6] bg-[#eff6ff]/30 px-0.5"
          : "hover:bg-[#fef3c7]/40 hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#d4d4d4]"
      } ${isEmpty && !editing ? "text-[#a3a3a3] italic" : ""}`}
    >
      {/* Initial render only; updates handled imperatively in effect above */}
      {isEmpty && !editing ? placeholder : value}
    </Tag>
  );
}
