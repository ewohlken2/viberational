# Chillax Landing Font Design

## Goal
Use the Chillax font for the homepage landing headline only, without changing subtext or other typography.

## Approach
Register Chillax as a local variable font using `next/font/local` in the root layout, exposing a CSS variable `--font-chillax`. Apply the font only to `.landing-text` in `src/app/page.css`, keeping the existing Geist fallback for continuity. This aligns with the existing font system and keeps the change scoped to the landing headline.

## Scope
- Add a local font definition for Chillax in `src/app/layout.tsx`.
- Include the Chillax CSS variable on the `<body>` element.
- Update `.landing-text` to use Chillax, leaving `.landing-subtext` unchanged.

## Non-Goals
- Changing typography for other pages or global styles.
- Adding external font links.

## Testing
Manual visual inspection of the homepage: confirm the landing headline uses Chillax and subtext remains in Geist.
