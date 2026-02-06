# Main Navigation Refactor Design (2026-02-06)

## Summary
Extract the portfolio page navigation into a reusable `MainNavigation` component under `src/app/components/`. The component will render the same markup/classes as today, and by default will exclude the `Portfolio` link.

## Architecture
- New component: `src/app/components/MainNavigation.tsx`
- Data source: `src/app/data/nav` (`navLinks` array)

## Component API
- `excludeLabel?: string` (default `"Portfolio"`)
- `className?: string` (optional, for future styling overrides)

## Rendering Behavior
- Render `<nav>` with class `portfolio-nav` (plus optional `className`)
- Render `<a>` links with `portfolio-nav-link`
- Filter out the link with label matching `excludeLabel`

## Data Flow
- Stateless, no hooks
- Uses `navLinks` directly

## Error Handling
- If `navLinks` is empty, `<nav>` renders empty
- If `excludeLabel` doesn’t match, all links render

## Testing
- Optional: add a small test to verify `Portfolio` is excluded by default
- No behavior change; minimal risk
