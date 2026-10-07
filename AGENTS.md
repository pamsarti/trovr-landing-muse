# Project rules
- Public localization is resolved unconditionally to Brazilian Portuguese, while technical identifiers and parser inputs remain stable, to prevent SSR/client language divergence.
- Public translated data uses typed overlays merged by stable IDs, to preserve logic and original source records.
- Public visual roles are defined in global semantic tokens and scoped to public pages, to keep administrative presentation separate.
- Public copy regression checks run as tests against effective localized data and public source, to detect accidental English fallback.