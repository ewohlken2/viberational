"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./introBanner.css";

type Phase = "typing" | "holding" | "fading" | "done";

interface IntroBannerProps {
  text: string;
  letterDelay?: number;
  letterDuration?: number;
  holdDelay?: number;
  fadeDuration?: number;
}

export default function IntroBanner({
  text,
  letterDelay = 30,
  letterDuration = 150,
  holdDelay = 100,
  fadeDuration = 600,
}: IntroBannerProps) {
  const [phase, setPhase] = useState<Phase>("typing");
  const [fontSizeReady, setFontSizeReady] = useState(false);
  const [measuredFontSize, setMeasuredFontSize] = useState<number>(0);

  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset when text changes
  useEffect(() => {
    setPhase("typing");
    setFontSizeReady(false);
    setMeasuredFontSize(0);
  }, [text]);

  useLayoutEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    let cancelled = false;

    const measureAndSet = () => {
      if (cancelled) return;
      if (!containerRef.current || !textRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const padding = 4 * 16;
      const availableWidth = containerWidth - padding * 2;

      if (availableWidth <= 0) {
        requestAnimationFrame(measureAndSet);
        return;
      }

      const measureElement = document.createElement("span");
      measureElement.style.visibility = "hidden";
      measureElement.style.position = "absolute";
      measureElement.style.whiteSpace = "nowrap";
      measureElement.style.fontFamily = "var(--font-geist-sans), sans-serif";
      measureElement.style.fontWeight = "600";
      measureElement.style.letterSpacing = "0.05em";
      measureElement.textContent = text;

      document.body.appendChild(measureElement);

      let min = 1;
      let max = 300;
      let best = 1;

      while (min <= max) {
        const mid = Math.floor((min + max) / 2);
        measureElement.style.fontSize = `${mid}px`;

        if (measureElement.offsetWidth <= availableWidth) {
          best = mid;
          min = mid + 1;
        } else {
          max = mid - 1;
        }
      }

      document.body.removeChild(measureElement);

      textRef.current.style.fontSize = `${best}px`;
      setMeasuredFontSize(best);

      requestAnimationFrame(() => {
        if (!cancelled) setFontSizeReady(true);
      });
    };

    const ro = new ResizeObserver(() => {
      measureAndSet();
    });

    ro.observe(containerRef.current);

    // initial attempt
    measureAndSet();

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [text]);

  // Start the animation timeline ONLY after size is ready
  useEffect(() => {
    if (!fontSizeReady) return;

    const chars = text.split("");
    const typingTotal = (chars.length - 1) * letterDelay + letterDuration;

    const holdTimer = window.setTimeout(() => {
      setPhase("holding");

      const fadeTimer = window.setTimeout(() => {
        setPhase("fading");

        const doneTimer = window.setTimeout(() => {
          setPhase("done");
        }, fadeDuration);

        return () => window.clearTimeout(doneTimer);
      }, holdDelay);

      return () => window.clearTimeout(fadeTimer);
    }, typingTotal);

    return () => window.clearTimeout(holdTimer);
  }, [
    fontSizeReady,
    text,
    letterDelay,
    letterDuration,
    holdDelay,
    fadeDuration,
  ]);

  if (phase === "done") return null;

  // We render always so refs exist.
  // While measuring, hide the text + STOP animations from running.
  const isMeasuring = !fontSizeReady;
  const chars = text.split("");
  const typingTotal = (chars.length - 1) * letterDelay + letterDuration;

  return (
    <div
      ref={containerRef}
      className={`intro-banner ${phase === "fading" ? "fade-out" : ""}`}
      style={{ ["--fade-ms" as any]: `${fadeDuration}ms` }}
    >
      <div
        ref={textRef}
        className="intro-text"
        aria-label={text}
        style={{
          // invisible but still laid out & measurable
          visibility: isMeasuring ? "hidden" : "visible",
          // extra safety: prevent any CSS animations from progressing while hidden
          animationPlayState: isMeasuring
            ? ("paused" as const)
            : ("running" as const),
          // optional: ensure the measured size is used even before state paint catches up
          fontSize: measuredFontSize ? `${measuredFontSize}px` : undefined,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            className="intro-letter"
            style={{
              // While measuring, force no delay so nothing "starts in the background"
              animationDelay: isMeasuring ? "0ms" : `${i * letterDelay}ms`,
              animationDuration: `${letterDuration}ms`,
              animationPlayState: isMeasuring
                ? ("paused" as const)
                : ("running" as const),
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </div>
    </div>
  );
}
