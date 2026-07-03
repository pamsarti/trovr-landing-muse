export const SITE_URL = "https://trovr.com.br";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/providencia-hero.png`;

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}