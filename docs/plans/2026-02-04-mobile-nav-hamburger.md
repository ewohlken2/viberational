# Mobile-Friendly Header + Hamburger Menu Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the site mobile-friendly at `<= 768px` with a modern hamburger menu using `navLinks` and CSS variables in `globals.css`.

**Architecture:** Keep the existing header as the desktop nav. Add a mobile toggle button in `Header` that controls a slide-in menu overlay rendered from `navLinks`, with accessibility attributes and body scroll lock when open.

**Tech Stack:** Next.js (App Router), React, CSS modules via global CSS files, existing `header.css`.

---

### Task 1: Add global design tokens for breakpoints and mobile menu
**Files:**
- Modify: `src/app/globals.css`

**Step 1: Write the failing test**
No test framework is present. Add a manual QA checklist entry for CSS variables and breakpoint behavior.

**Step 2: Run test to verify it fails**
Manual: confirm there are no breakpoint vars or mobile menu variables in `globals.css`.

**Step 3: Write minimal implementation**
Add CSS variables to `:root`, for example:
- `--breakpoint-mobile: 768px;`
- `--breakpoint-desktop: 769px;`
- `--mobile-menu-padding: 2.4rem;`
- `--mobile-menu-bg: var(--secondary-dark);`
- `--mobile-menu-text: var(--pink);`
- `--mobile-menu-shadow: 0 12px 30px rgba(0,0,0,0.3);`
- `--mobile-menu-overlay: rgba(0,0,0,0.45);`
- `--mobile-menu-radius: 1.6rem;`
- `--mobile-menu-gap: 1.2rem;`
- `--mobile-menu-transition: 220ms cubic-bezier(0.2, 0.8, 0.2, 1);`

Note: CSS custom properties can’t reliably be used inside media queries, so media queries should still use `768px` literal values, but keep variables for reference and for JS if needed.

**Step 4: Run test to verify it passes**
Manual: verify the new variables exist in `globals.css`.

**Step 5: Commit**
```
git add src/app/globals.css
git commit -m "chore: add mobile breakpoint and menu tokens"
```

---

### Task 2: Add hamburger state and markup in Header
**Files:**
- Modify: `src/app/header.tsx`

**Step 1: Write the failing test**
No test framework. Add a manual QA checklist entry: “On mobile width, hamburger appears and menu toggles; on desktop, links appear inline and hamburger hidden.”

**Step 2: Run test to verify it fails**
Manual: confirm there is currently no hamburger button or mobile menu.

**Step 3: Write minimal implementation**
Update `Header` to:
- Add `useState` for `menuOpen`.
- Add a `<button>` for the hamburger with `aria-expanded`, `aria-controls`, and `aria-label` toggling between “Open menu” and “Close menu”.
- Render a mobile menu container (e.g., `div` with `id="mobile-menu"`) that maps `navLinks` like desktop.
- Close menu on link click.
- Add an overlay element to close menu on click.
- Optionally add `useEffect` to lock body scroll when `menuOpen` is true.

**Step 4: Run test to verify it passes**
Manual: open menu, click overlay to close, click link to close; verify `aria-expanded` toggles.

**Step 5: Commit**
```
git add src/app/header.tsx
git commit -m "feat: add hamburger toggle and mobile menu markup"
```

---

### Task 3: Implement responsive header + modern hamburger styling
**Files:**
- Modify: `src/app/header.css`

**Step 1: Write the failing test**
No test framework. Add a manual QA checklist entry: “Desktop links hidden on mobile; hamburger visible; menu slides in; overlay dims background.”

**Step 2: Run test to verify it fails**
Manual: at width <= 768px, current header has no mobile styling.

**Step 3: Write minimal implementation**
Add CSS for:
- Mobile layout: hide `.header-link` list, show hamburger button.
- Hamburger button: modern (rounded, subtle background, animated icon lines).
- Mobile menu panel: fixed position, slide-in from right or top, padding `var(--mobile-menu-padding)`, background `var(--mobile-menu-bg)`, text color `var(--mobile-menu-text)`, border-radius `var(--mobile-menu-radius)`, shadow `var(--mobile-menu-shadow)`.
- Overlay: full-screen, background `var(--mobile-menu-overlay)`, transition `var(--mobile-menu-transition)`.
- Open/closed states using classes toggled from React (e.g., `.menu-open` on root or body).

Use media queries:
- `@media (max-width: 768px)` for mobile layout.
- `@media (min-width: 769px)` for desktop layout.

**Step 4: Run test to verify it passes**
Manual: verify menu opens, closes, animates, and doesn’t affect desktop layout.

**Step 5: Commit**
```
git add src/app/header.css
git commit -m "feat: style mobile header and hamburger menu"
```

---

### Task 4: Quick validation and lint
**Files:**
- None (commands only)

**Step 1: Write the failing test**
Manual: set viewport to 375px and 1024px, check behavior.

**Step 2: Run test to verify it fails**
Manual: confirm issues if any.

**Step 3: Write minimal implementation**
Fix any layout or accessibility issues discovered.

**Step 4: Run test to verify it passes**
Run:
```
npm run lint
```
Expected: no lint errors.

**Step 5: Commit**
```
git add src/app/header.tsx src/app/header.css src/app/globals.css
git commit -m "chore: finalize mobile header behavior"
```
