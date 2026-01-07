"use client";

import { useEffect, useRef, useCallback } from "react";

function useInactivity(
  delay: number,
  onInactive: () => void,
  onActivity?: () => void
) {
  const timeoutRef = useRef<number | null>(null);

  const reset = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(onInactive, delay);
  }, [delay, onInactive]);

  useEffect(() => {
    if (delay <= 0) return;

    const handleActivity = () => {
      if (onActivity) onActivity();
      reset();
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "touchmove",
      "click",
    ];
    events.forEach((e) =>
      window.addEventListener(e, handleActivity, { passive: true })
    );
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reset, delay, onActivity]);
}

export default useInactivity;
