"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import "./typingText.css";

interface TypingTextProps {
  children: ReactNode;
  startDelay?: number;
  typeSpeed?: number;
  cursorBlinkMs?: number;
  cursorFadeOutMs?: number;
  cursorColor?: string;
  cursorGradient?: string;
  onFinishTyping?: () => void;
  className?: string;
  as?: "span" | "div";
}

export default function TypingText({
  children,
  startDelay = 400,
  typeSpeed = 60,
  cursorBlinkMs = 500,
  cursorFadeOutMs = 500,
  cursorColor = "#f3f6ff",
  cursorGradient = "linear-gradient(180deg, #53d6ff, #ff7afd)",
  onFinishTyping,
  className,
  as = "div",
}: TypingTextProps) {
  const segments = useMemo(() => {
    const items = Children.toArray(children);
    const extractText = (node: ReactNode): string => {
      return Children.toArray(node)
        .map((child) => {
          if (typeof child === "string" || typeof child === "number") {
            return String(child);
          }
          return "";
        })
        .join("");
    };

    return items
      .map((item, index) => {
        if (typeof item === "string" || typeof item === "number") {
          return {
            key: `text-${index}`,
            text: String(item),
            element: null as null | { props: Record<string, unknown> },
          };
        }

        if (isValidElement(item) && item.type === "span") {
          const spanText = extractText(item.props.children);
          const { children: _children, ...restProps } = item.props;
          return {
            key: `span-${index}`,
            text: spanText,
            element: { props: restProps },
          };
        }

        return {
          key: `text-${index}`,
          text: "",
          element: null as null | { props: Record<string, unknown> },
        };
      })
      .filter((segment) => segment.text.length > 0);
  }, [children]);

  const fullText = useMemo(
    () => segments.map((segment) => segment.text).join(""),
    [segments],
  );
  const Tag = as;

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [cursorFading, setCursorFading] = useState(false);
  const [cursorGone, setCursurGone] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  const finishCalledRef = useRef(false);

  useEffect(() => {
    setStarted(false);
    setIndex(0);
    setCursorFading(false);
    finishCalledRef.current = false;

    const startTimer = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(startTimer);
  }, [startDelay, fullText]);

  useEffect(() => {
    if (!started) return;

    intervalRef.current = window.setInterval(() => {
      setIndex((value) => {
        if (value >= fullText.length) {
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
  }, [started, fullText.length, typeSpeed]);

  useEffect(() => {
    if (!started) return;
    if (index < fullText.length) return;
    if (cursorFading) return;

    setCursorFading(true);
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
    }

    hideTimerRef.current = window.setTimeout(() => {
      setCursorFading(false);
      hideTimerRef.current = null;
    }, cursorFadeOutMs);
  }, [cursorFadeOutMs, cursorFading, index, started, fullText.length]);

  useEffect(() => {
    if (!started) return;
    if (index < fullText.length) return;
    if (finishCalledRef.current) return;

    setCursurGone(true);
    finishCalledRef.current = true;
    onFinishTyping?.();
  }, [index, onFinishTyping, started, fullText.length]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
      }
    };
  }, []);

  const visibleText = started ? fullText.slice(0, index) : "";
  const cursorClassName = [
    "typing-text__cursor",
    cursorGradient ? "typing-text__cursor--gradient" : "",
    cursorFading || cursorGone ? "is-fading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const visibleNodes = useMemo(() => {
    if (!visibleText) return [];
    const nodes: ReactNode[] = [];
    let remaining = visibleText.length;

    for (const segment of segments) {
      if (remaining <= 0) break;
      const sliceLength = Math.min(segment.text.length, remaining);
      if (sliceLength <= 0) continue;
      const sliceText = segment.text.slice(0, sliceLength);
      remaining -= sliceLength;

      if (segment.element) {
        nodes.push(
          <span key={segment.key} {...segment.element.props}>
            {sliceText}
          </span>,
        );
      } else {
        nodes.push(sliceText);
      }
    }

    return nodes;
  }, [segments, visibleText]);

  return (
    <Tag
      className={`typing-text ${className ?? ""}`.trim()}
      aria-label={fullText}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="typing-text__content">{visibleNodes}</span>
      <span
        className={cursorClassName}
        data-testid="typing-text-cursor"
        style={{
          ["--cursor-blink" as any]: `${cursorBlinkMs}ms`,
          ["--cursor-fade" as any]: `${cursorFadeOutMs}ms`,
          ["--cursor-color" as any]: cursorColor,
          ["--cursor-gradient" as any]: cursorGradient,
        }}
      />
    </Tag>
  );
}
