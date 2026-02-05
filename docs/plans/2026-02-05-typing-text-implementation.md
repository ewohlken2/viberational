# TypingText Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a standalone `TypingText` component with configurable typing delay/speed and a gradient-capable blinking cursor that fades out after typing completes.

**Architecture:** A client-side React component manages typing state and cursor visibility with timers. Styling and cursor animation live in a dedicated CSS file for easy reuse.

**Tech Stack:** Next.js, React, CSS, Jest + Testing Library.

### Task 1: Add TypingText component and styles

**Files:**
- Create: `src/app/components/typingText.css`
- Create: `src/app/components/TypingText.tsx`

**Step 1: Write the component skeleton**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import "./typingText.css";

interface TypingTextProps {
  children: string;
  startDelay?: number;
  typeSpeed?: number;
  cursorBlinkMs?: number;
  cursorFadeOutMs?: number;
  cursorColor?: string;
  cursorGradient?: string;
  className?: string;
  as?: "span" | "div";
}

export default function TypingText({
  children,
  startDelay = 400,
  typeSpeed = 60,
  cursorBlinkMs = 800,
  cursorFadeOutMs = 500,
  cursorColor = "#f3f6ff",
  cursorGradient,
  className,
  as = "div",
}: TypingTextProps) {
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  const Tag = as;
  const text = useMemo(() => children ?? "", [children]);

  useEffect(() => {
    const startTimer = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(startTimer);
  }, [startDelay, text]);

  useEffect(() => {
    if (!started) return;
    if (index >= text.length) {
      setDone(true);
      return;
    }

    const timer = window.setTimeout(() => {
      setIndex((value) => value + 1);
    }, typeSpeed);

    return () => window.clearTimeout(timer);
  }, [index, started, text, typeSpeed]);

  const visibleText = started ? text.slice(0, index) : "";
  const showCursor = !done;

  return (
    <Tag
      className={`typing-text ${className ?? ""}`.trim()}
      aria-label={text}
      aria-live="polite"
    >
      <span className="typing-text__content">{visibleText}</span>
      {showCursor && (
        <span
          className={`typing-text__cursor ${done ? "is-fading" : ""}`}
          style={{
            ["--cursor-blink" as any]: `${cursorBlinkMs}ms`,
            ["--cursor-fade" as any]: `${cursorFadeOutMs}ms`,
            ["--cursor-color" as any]: cursorColor,
            ["--cursor-gradient" as any]: cursorGradient,
          }}
        >
          █
        </span>
      )}
    </Tag>
  );
}
```

**Step 2: Add styles**

```css
.typing-text {
  display: inline-flex;
  align-items: baseline;
  gap: 0.1ch;
  white-space: pre-wrap;
}

.typing-text__cursor {
  display: inline-block;
  width: 0.6ch;
  animation: typing-text-blink var(--cursor-blink) infinite;
  color: var(--cursor-color);
}

.typing-text__cursor::selection {
  background: transparent;
}

.typing-text__cursor.is-fading {
  animation: typing-text-fade var(--cursor-fade) ease forwards;
}

.typing-text__cursor[data-gradient="true"] {
  color: transparent;
  background: var(--cursor-gradient);
  -webkit-background-clip: text;
  background-clip: text;
}

@keyframes typing-text-blink {
  0% {
    opacity: 1;
  }
  35% {
    opacity: 0.15;
  }
  100% {
    opacity: 0;
  }
}

@keyframes typing-text-fade {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```

**Step 3: Commit**

```bash
git add src/app/components/TypingText.tsx src/app/components/typingText.css
git commit -m "feat: add typing text component"
```

### Task 2: Add tests for TypingText behavior

**Files:**
- Create: `src/app/__tests__/typing-text.test.tsx`

**Step 1: Write failing tests**

```tsx
import { render, screen, act } from "@testing-library/react";
import TypingText from "../components/TypingText";

jest.useFakeTimers();

test("shows cursor immediately but no text", () => {
  render(<TypingText startDelay={200}>Hello</TypingText>);

  expect(screen.getByText("█")).toBeInTheDocument();
  expect(screen.queryByText("Hello")).not.toBeInTheDocument();
});

test("types text after delay and removes cursor", () => {
  render(
    <TypingText startDelay={100} typeSpeed={50} cursorFadeOutMs={200}>
      Hi
    </TypingText>
  );

  act(() => {
    jest.advanceTimersByTime(100);
  });

  act(() => {
    jest.advanceTimersByTime(100);
  });

  expect(screen.getByText("Hi")).toBeInTheDocument();

  act(() => {
    jest.advanceTimersByTime(300);
  });

  expect(screen.queryByText("█")).not.toBeInTheDocument();
});
```

**Step 2: Run tests**

```bash
pnpm test -- src/app/__tests__/typing-text.test.tsx
```

Expected: PASS.

**Step 3: Commit**

```bash
git add src/app/__tests__/typing-text.test.tsx
git commit -m "test: cover typing text component"
```

### Task 3: Full test pass

**Files:**
- None

**Step 1: Run full test suite**

```bash
pnpm test
```

Expected: PASS.
