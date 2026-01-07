"use client";

import { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";

interface CountupProps {
  target: number;
  duration?: number;
  decimals?: number;
  className?: string;
  autoStart?: boolean;
}

export interface CountupRef {
  restart: () => void;
}

const Countup = forwardRef<CountupRef, CountupProps>(({
  target,
  duration = 2000,
  decimals = 0,
  className = "",
  autoStart = true,
}, ref) => {
  const [count, setCount] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const animationFrameRef = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    restart: () => {
      setCount(0);
      setHasStarted(true);
      setRestartKey((prev) => prev + 1);
    },
  }));

  useEffect(() => {
    // Don't start if autoStart is false and hasn't been started yet
    if (!autoStart && !hasStarted) {
      return;
    }

    // Cancel any existing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function: starts fast, slows down as it approaches 1
      // Using easeOutExpo for a dramatic slow-down effect
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentValue = eased * target;
      setCount(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [target, duration, restartKey, autoStart, hasStarted]);

  const formattedCount = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toString();

  return (
    <div className={className} style={{ fontSize: "4rem", fontWeight: "600", color: "#F8B4B9" }}>
      {formattedCount}
    </div>
  );
});

Countup.displayName = "Countup";

export default Countup;
