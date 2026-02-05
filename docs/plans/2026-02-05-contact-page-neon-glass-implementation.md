# Contact Page Neon Glass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the `/contact` form with MUI components and a local dark neon-glass theme.

**Architecture:** Local `ThemeProvider` and MUI components will be scoped to `src/app/contact/page.tsx`, with page-level styling handled via MUI `sx` plus a minimal CSS module for background layers if needed. Existing form state and API submission logic remains intact.

**Tech Stack:** Next.js, React, MUI (`@mui/material`), Emotion (`@emotion/react`, `@emotion/styled`), Jest + Testing Library.

### Task 1: Add MUI dependencies

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

**Step 1: Install dependencies**

Run:
```bash
pnpm add @mui/material @emotion/react @emotion/styled
```

Expected: `package.json` and `pnpm-lock.yaml` updated with new deps.

**Step 2: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "feat: add mui dependencies"
```

### Task 2: Write failing contact page test (TDD)

**Files:**
- Create: `src/app/__tests__/contact-page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import ContactPage from "../contact/page";

jest.mock("../wrapper", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="wrapper">{children}</div>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

test("renders contact form fields and submit button", () => {
  render(<ContactPage />);

  expect(screen.getByRole("heading", { name: /contact me/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run:
```bash
pnpm test -- src/app/__tests__/contact-page.test.tsx
```

Expected: FAIL because `ContactPage` is not yet using MUI labels or heading text may differ.

**Step 3: Commit**

```bash
git add src/app/__tests__/contact-page.test.tsx
git commit -m "test: add contact page render coverage"
```

### Task 3: Replace contact form with MUI components and local theme

**Files:**
- Modify: `src/app/contact/page.tsx`
- Delete: `src/app/contact/contact.css` (if unused)
- Modify: `src/app/contact/page.tsx` import list

**Step 1: Implement local MUI theme + page layout**

- Add `ThemeProvider` and `createTheme` in `src/app/contact/page.tsx`.
- Define palette with `mode: "dark"`, background/surface, accent primary.
- Add `Box` as page root with gradient/glow background using `sx`.
- Add `Container` and `Paper` (glass card) with transparency, border, and shadow.

**Step 2: Replace inputs with MUI `TextField` and `Button`**

- Use controlled `TextField` for name/email/subject/message (multiline with `minRows`).
- Use `Button` for submit with `disabled` based on validity/loading.
- Use `Alert` for success/error messaging.

**Step 3: Remove old CSS usage**

- Remove `import "./contact.css"` and delete `src/app/contact/contact.css` if no longer referenced.

**Step 4: Run tests**

```bash
pnpm test -- src/app/__tests__/contact-page.test.tsx
```

Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/contact/page.tsx src/app/contact/contact.css

git commit -m "feat: revamp contact page with mui"
```

### Task 4: Full test pass

**Files:**
- None

**Step 1: Run full test suite**

```bash
pnpm test
```

Expected: PASS.

**Step 2: Commit (if needed)**

Only if changes were required to fix tests.
