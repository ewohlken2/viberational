"use client";

import { ReactNode, useEffect, useMemo, useRef } from "react";

export interface LavaLampTextProps {
  children: ReactNode;
  className?: string;
  palette?: string[];
  speed?: number;
  baseColor?: string;
}

const DEFAULT_PALETTE = ["#ff9595", "#1E6BFF", "#ff7afd", "#e4ff7a"];

const buildGradient = (palette: string[]) => {
  const [a, b, c, d] = palette;
  return `
    radial-gradient(60% 60% at var(--lava-x1) var(--lava-y1), ${a} 0%, transparent 65%),
    radial-gradient(55% 55% at var(--lava-x2) var(--lava-y2), ${b} 0%, transparent 65%),
    radial-gradient(50% 50% at var(--lava-x3) var(--lava-y3), ${c} 0%, transparent 65%),
    radial-gradient(65% 65% at var(--lava-x4) var(--lava-y4), ${d} 0%, transparent 65%)
  `;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function LavaLampText({
  children,
  className,
  palette = DEFAULT_PALETTE,
  speed = 5,
  baseColor = "#dd6dff",
}: LavaLampTextProps) {
  const overlayRef = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const gradient = useMemo(() => buildGradient(palette), [palette]);

  useEffect(() => {
    const start = performance.now();

    const animate = (timestamp: number) => {
      const t = (timestamp - start) * 0.00015 * speed;
      const blob = (offset: number, amp = 30) => {
        const x = 50 + Math.sin(t + offset) * amp;
        const y = 50 + Math.cos(t * 1.1 + offset * 1.3) * amp;
        return {
          x: clamp(x, 5, 95),
          y: clamp(y, 5, 95),
        };
      };

      const b1 = blob(0.2, 32);
      const b2 = blob(1.7, 28);
      const b3 = blob(3.4, 30);
      const b4 = blob(5.1, 26);

      const node = overlayRef.current;
      if (node) {
        node.style.setProperty("--lava-x1", `${b1.x}%`);
        node.style.setProperty("--lava-y1", `${b1.y}%`);
        node.style.setProperty("--lava-x2", `${b2.x}%`);
        node.style.setProperty("--lava-y2", `${b2.y}%`);
        node.style.setProperty("--lava-x3", `${b3.x}%`);
        node.style.setProperty("--lava-y3", `${b3.y}%`);
        node.style.setProperty("--lava-x4", `${b4.x}%`);
        node.style.setProperty("--lava-y4", `${b4.y}%`);
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, [speed]);

  return (
    <span
      className={className}
      data-testid="lava-wrapper"
      style={{
        position: "relative",
        display: "inline-block",
      }}
    >
      <span data-testid="lava-base" style={{ color: baseColor }}>
        {children}
      </span>
      <span
        data-testid="lava-overlay"
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          color: "transparent",
          backgroundImage: gradient,
          backgroundBlendMode: "screen",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          pointerEvents: "none",
        }}
      >
        {children}
      </span>
    </span>
  );
}
