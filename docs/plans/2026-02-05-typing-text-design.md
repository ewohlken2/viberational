# TypingText Component Design

Date: 2026-02-05
Owner: Codex
Status: Draft

## Overview
Create a standalone `TypingText` client component that renders a CLI-like typing effect with a blinking cursor. On load, only a blinking cursor is visible. After a configurable delay, the wrapped text is typed out character-by-character. The cursor blinks with an instant-on / fade-out animation and fades away once typing completes. The cursor supports optional gradient coloring.

## Goals
- Standalone component named `TypingText`.
- Configurable start delay, typing speed, cursor blink timing, and cursor fade-out duration.
- Cursor supports gradient color or solid color.
- Default usage tuned for landing page hero text.
- Accessible: full text exposed to screen readers without per-character announcements.

## Non-Goals
- Reusing or refactoring existing typing logic in `introBanner.tsx`.
- Global typography changes.
- Complex multi-line layout measurement.

## Component API (Proposed)
- `children: string` (required) — the text to type.
- `startDelay?: number` (ms) — delay before typing begins.
- `typeSpeed?: number` (ms per character).
- `cursorBlinkMs?: number` (ms) — blink cycle duration.
- `cursorFadeOutMs?: number` (ms) — fade duration after typing ends.
- `cursorColor?: string` — fallback solid color (default).
- `cursorGradient?: string` — optional CSS gradient string.
- `className?: string` — styling hook for consumers.
- `as?: "span" | "div"` — default `div` for hero usage, `span` for inline.

## Behavior
- Initial render shows only the cursor (text hidden).
- After `startDelay`, reveal characters one by one at `typeSpeed`.
- Cursor blinks during typing with instant-on and fade-out in each cycle.
- After final character is shown, cursor fades out and is removed.

## Styling
- Dedicated CSS file (e.g., `src/app/components/typingText.css`).
- Wrapper uses inline-flex or inline-block and `white-space: pre-wrap`.
- Cursor is a span with fixed width and height; uses gradient background if provided.
- Blink animation: `opacity: 1` at start, then fades to `0` for remainder.
- End-of-typing animation: fade to `0` over `cursorFadeOutMs`.

## Accessibility
- Wrapper includes `aria-label` with full text.
- Use `aria-live="polite"` but avoid per-character announcements by rendering the full text only visually sliced.

## Testing & Validation
- Unit test to ensure:
  - Initial render shows no text but shows cursor.
  - Text appears after delay and completes typing.
  - Cursor element is removed after completion.
- Manual check on landing page to confirm visual effect and timing.
