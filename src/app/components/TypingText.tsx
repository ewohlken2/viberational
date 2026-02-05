"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const text = useMemo(() => children ?? "", [children]);
  const Tag = as;

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [cursorFading, setCursorFading] = useState(false);
  const [cursorHidden, setCursorHidden] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setStarted(false);
    setIndex(0);
    setCursorFading(false);
    setCursorHidden(false);

    const startTimer = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(startTimer);
  }, [startDelay, text]);

  useEffect(() => {
    if (!started) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((value) => {
        if (value >= text.length) {
          if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return value;
        }
        return value + 1;
      });
    }, typeSpeed);

    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [started, text.length, typeSpeed]);

  useEffect(() => {
    if (!started) return;
    if (index < text.length) return;
    if (cursorFading || cursorHidden) return;

    setCursorFading(true);
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setCursorHidden(true);
      setCursorFading(false);
      hideTimerRef.current = null;
    }, cursorFadeOutMs);
  }, [cursorFadeOutMs, cursorFading, cursorHidden, index, started, text.length]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const visibleText = started ? text.slice(0, index) : "";
  const showCursor = !cursorHidden;
  const cursorClassName = [
    "typing-text__cursor",
    cursorGradient ? "typing-text__cursor--gradient" : "",
    cursorFading ? "is-fading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag
      className={`typing-text ${className ?? ""}`.trim()}
      aria-label={text}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="typing-text__content">{visibleText}</span>
      {showCursor && (
        <span
          className={cursorClassName}
          data-testid="typing-text-cursor"
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
