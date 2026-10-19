# Local indexing validation

Use Node 22.18 or later (the Netlify environment selects Node 22). Nothing in these commands publishes or deploys.

```sh
npm run validate
NITRO_PRESET=netlify npm run build
```

`validate` checks TypeScript, regenerates the sitemap, compares it with the public route loaders, runs the tests, then starts an isolated dev server on 127.0.0.1:4175 for HTTP checks. It stops that server automatically. The port must be free. The build also requires TypeScript and sitemap validation to pass.

To check an already running local dev/preview server instead:

```sh
npm run check:indexing -- --base-url http://127.0.0.1:5184
```

The HTTP check rejects redirects or non-200 responses for sitemap pages, noindex directives, conflicting explicit canonicals, missing titles, missing-page redirects and the wrong legacy catalogue destination. It does not require explicit canonicals on spots. Missing content must return 404. A passed local check does not establish Google indexation or clear Search Console reports.

## Content and sitemap

`src/lib/public-content.ts` is the shared source for spot visibility, translated overlays and slugs. Site loaders, sitemap and homepage statistics use it. The sitemap tests also resolve every dynamic URL against the public loaders and reject duplicates or drift. Public spots still require a curated description and activity-specific conditions. Imported legacy records remain hidden; this change does not redefine publication status.

## Temporarily hidden catalogue

The catalogue was hidden in commit f111318 (30 September 2026). `/trips` now temporarily redirects to the current `/viagem` service (307). Detail and theme URLs have no equivalent public destination and return 404 with a route to the current service; this includes known legacy records and unknown identifiers. The catalogue code/data remain available for future restoration. No permanent retirement or mapping of individual trips has been inferred.
