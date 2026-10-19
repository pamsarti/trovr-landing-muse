import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getPublicSpots, findContinent, findRegion, findSpot } from "./spots-data";
import { getPublishedArticles, findArticle } from "./journal-data";
import { applySpotOverlay, isPublicSpot, PUBLIC_STATIC_PATHS, slugify } from "./public-content";
import { SITE_URL } from "./seo";

const xml = readFileSync(new URL("../../public/sitemap.xml", import.meta.url), "utf8");
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);

describe("sitemap agrees with public route loaders", () => {
  it("contains precisely the public static, journal and curated spot URLs, without duplicates", () => {
    const expected = [
      ...PUBLIC_STATIC_PATHS,
      ...getPublishedArticles().map((a) => `/journal/${a.slug}`),
      ...getPublicSpots().map(
        (s) => `/spots/${slugify(s.region)}/${slugify(s.city)}/${slugify(s.name)}`,
      ),
    ].map((path) => `${SITE_URL}${path}`);
    expect(urls).toHaveLength(expected.length);
    expect(new Set(urls).size).toBe(urls.length);
    expect([...urls].sort()).toEqual(expected.sort());
  });

  it("resolves every dynamic sitemap URL with the same chain used by loaders", () => {
    for (const url of urls) {
      const parsed = new URL(url);
      expect(parsed.origin).toBe(SITE_URL);
      expect(parsed.search).toBe("");
      expect(parsed.hash).toBe("");
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "journal" && parts.length > 1) {
        expect(findArticle(parts[1]), url).toBeTruthy();
      } else if (parts[0] === "spots" && parts.length > 1) {
        const continent = findContinent(undefined, parts[1]);
        expect(continent, url).toBeTruthy();
        const region = findRegion(undefined, continent!.name, parts[2]);
        expect(region, url).toBeTruthy();
        expect(findSpot(undefined, continent!.name, region!.name, parts[3]), url).toBeTruthy();
      }
    }
  });

  it("honors curated overlay content while keeping legacy source blobs private", () => {
    const legacy = {
      description: "",
      descriptionRaw: "Imported text",
      conditions: { bestMonths: [] as string[], activitySpecific: {} },
    };
    expect(isPublicSpot(legacy)).toBe(false);
    expect(isPublicSpot(applySpotOverlay(legacy, { description: "Curated description" }))).toBe(
      false,
    );
    expect(
      isPublicSpot(
        applySpotOverlay(legacy, {
          description: "Curated description",
          activitySpecific: { access: "Verified access" },
        }),
      ),
    ).toBe(true);
    expect(legacy.description).toBe("");
  });
});
