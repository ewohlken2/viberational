# Contact Page Neon Glass Revamp Design

Date: 2026-02-05
Owner: Codex
Status: Draft

## Overview
Revamp `/contact` to a modern, dark, neon-glass aesthetic using local MUI theming and MUI form controls. Replace the current custom CSS form with MUI components for consistent spacing, focus states, and accessibility, while preserving existing submit logic and API wiring.

## Goals
- MUI-based form controls with a cohesive dark theme.
- Neon-glass visual treatment (gradient background, soft glow, glassy form card).
- Preserve existing data flow, form validation, and API submission logic.
- Keep changes localized to the contact page (local `ThemeProvider`).

## Non-Goals
- Global theme overhaul or typography changes across the site.
- Backend or API changes.
- New form fields or analytics instrumentation.

## Proposed UI Structure
- Page root `Box` (full-height) with layered background:
  - Dark linear/radial gradient.
  - Soft glow behind the form.
  - Optional subtle noise overlay for texture.
- Centered `Container` housing a glass `Paper` or `Box` card.
- Form layout via `Stack`:
  - `TextField` (Name, Email, Subject, Message multiline).
  - Submit `Button`.
  - Success and error feedback using `Alert` or styled `Typography`.

## Theme & Styling
- Local MUI `ThemeProvider` in `/contact` only.
- Palette: `mode: "dark"`, near-black background, cool surface, neon accent (cyan/teal).
- Component overrides:
  - `TextField`: softened borders, subtle placeholder, neon focus ring.
  - `Button`: contained with glow on hover, muted disabled state.
  - `Paper`: semi-transparent background, thin border, soft shadow.

## Data Flow & Behavior
- Keep existing local state for inputs and submission feedback.
- Use MUI `TextField` controlled inputs.
- Preserve `onSubmit` flow: POST `/api/contact`, show success/error, clear inputs on success.

## Error Handling
- Network or API errors shown inline with `Alert`.
- Disabled submit when invalid or loading.

## Testing & Validation
- Manual: verify focus styles, hover states, and success/error flows.
- Confirm layout on mobile and desktop breakpoints.
- Ensure form submission still reaches `/api/contact` and renders success state.
