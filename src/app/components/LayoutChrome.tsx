"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import HeaderLogo from "../logo";
import MainNavigation from "./MainNavigation";
import { PAGE_TRANSITION_DURATION } from "../transition-config";
import "../layout.css";

let lastPathname: string | null = null;

export default function LayoutChrome() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const isHomePage = pathname === "/";
  const previousPathname = useRef<string | null>(lastPathname);
  const [isVisible, setIsVisible] = useState(false);
  const [transitionDelayMs, setTransitionDelayMs] = useState(0);

  useEffect(() => {
    const enteringFromHome =
      previousPathname.current === "/" && pathname !== "/";

    if (isHomePage) {
      setIsVisible(false);
      setTransitionDelayMs(0);
    } else if (enteringFromHome) {
      setTransitionDelayMs(
        shouldReduceMotion ? 0 : PAGE_TRANSITION_DURATION * 1000,
      );
      setIsVisible(true);
    } else {
      setTransitionDelayMs(0);
      setIsVisible(true);
    }

    previousPathname.current = pathname;
    lastPathname = pathname;
  }, [isHomePage, pathname, shouldReduceMotion]);

  return (
    <>
      <div
        data-testid="layout-chrome"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: shouldReduceMotion
            ? "none"
            : `opacity 280ms ease-out ${transitionDelayMs}ms`,
          pointerEvents: isVisible ? "auto" : "none",
        }}
      >
        <div className="layout-logo">
          <HeaderLogo />
        </div>
        <MainNavigation />
      </div>
    </>
  );
}
