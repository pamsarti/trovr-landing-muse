import { useEffect, useRef, useState } from "react";

/**
 * Click-to-edit text element. Renders as the public site styling (className)
 * until clicked, becomes contentEditable, commits on blur or Enter (single-line)
 * via the provided `onCommit`. Esc cancels.
 *
 * Pass `multiline` for paragraph-style fields (Enter inserts newline; Cmd/Ctrl+Enter commits).
 * The element type is configurable (h1, p, span, etc.) via `as`.
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
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      // place cursor at end
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      range.collapse(false);
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editing]);

  function commit() {
    const text = (ref.current?.innerText ?? "").trim();
    setEditing(false);
    if (text !== value) onCommit(text);
    else setDraft(value);
  }

  return (
    <Tag
      ref={ref as any}
      contentEditable={editing}
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      onClick={() => !editing && setEditing(true)}
      onFocus={() => !editing && setEditing(true)}
      onBlur={commit}
      onKeyDown={(e: any) => {
        if (e.key === "Escape") {
          e.preventDefault();
          if (ref.current) ref.current.innerText = value;
          setEditing(false);
        } else if (e.key === "Enter" && (!multiline || e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
      }}
      className={`${className} cursor-text outline-none rounded-[2px] transition-colors ${
        editing
          ? "ring-1 ring-[#3b82f6] bg-[#eff6ff]/40"
          : "hover:bg-[#fef3c7]/40 hover:outline hover:outline-1 hover:outline-dashed hover:outline-[#d4d4d4]"
      }`}
      data-placeholder={placeholder}
    >
      {draft || (!editing && (
        <span className="text-[#a3a3a3] italic">{placeholder}</span>
      )) as any}
    </Tag>
  );
}
