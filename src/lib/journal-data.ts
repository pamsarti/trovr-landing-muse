import articlesJson from "@/data/journal-articles.json";

export type JournalCategory = "crossing" | "finding" | "preparing" | "manifesto";

export type JournalArticle = {
  id: string;
  slug: string;
  category: JournalCategory;
  title: string;
  dek: string;
  author: string;
  date: string;
  readTime: number;
  heroImage: string;
  body: string;
  status: "published" | "draft";
};

export const CATEGORY_LABEL: Record<JournalCategory, string> = {
  crossing: "Crossing",
  finding: "Finding",
  preparing: "Preparing",
  manifesto: "Manifesto",
};

const ALL = articlesJson as unknown as JournalArticle[];

export function getPublishedArticles(): JournalArticle[] {
  return ALL.filter((a) => a.status === "published").sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function findArticle(slug: string): JournalArticle | undefined {
  return ALL.find((a) => a.slug === slug && a.status === "published");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Minimal, safe markdown renderer for editorial body content.
 * Supports: ## h2, ### h3, > blockquote (single line), paragraphs, line breaks.
 * Escapes HTML to avoid injection from JSON content.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderBody(md: string): string {
  const blocks = md.split(/\n\s*\n/);
  return blocks
    .map((raw) => {
      const block = raw.trim();
      if (!block) return "";
      if (block.startsWith("### ")) {
        return `<h3 class="mt-12 mb-4 font-serif text-xl text-ink">${escapeHtml(
          block.slice(4),
        )}</h3>`;
      }
      if (block.startsWith("## ")) {
        return `<h2 class="mt-16 mb-5 font-serif text-2xl sm:text-3xl text-ink">${escapeHtml(
          block.slice(3),
        )}</h2>`;
      }
      if (block.startsWith("> ")) {
        const text = block
          .split("\n")
          .map((l) => l.replace(/^>\s?/, ""))
          .join(" ");
        return `<blockquote class="my-10 border-l-2 border-stone/50 pl-6 font-serif text-2xl italic leading-[1.5] text-ink sm:text-3xl">${escapeHtml(
          text,
        )}</blockquote>`;
      }
      return `<p class="my-6 font-serif text-lg leading-[1.75] text-ink sm:text-[19px]">${escapeHtml(
        block,
      ).replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");
}