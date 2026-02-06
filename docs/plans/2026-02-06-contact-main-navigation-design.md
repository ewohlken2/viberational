# Contact Page MainNavigation Design (2026-02-06)

## Summary
Update the contact page to remove `Wrapper`/`Header` usage and render `MainNavigation` at the top of the page content.

## Architecture
- Remove `Wrapper` usage from `src/app/contact/page.tsx`
- Add `MainNavigation` from `src/app/components/MainNavigation.tsx` to the contact page

## Components
- `MainNavigation`: already exists; render it at the top of the page content
- `ContactForm`: unchanged

## Data Flow
- No new props or state
- Static nav rendering only

## Error Handling
- Unchanged (contact form handles submission state)

## Testing
- Existing contact page test should continue to pass
- Optional: assert a nav link presence if desired
