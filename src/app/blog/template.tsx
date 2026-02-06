"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PAGE_TRANSITION_DURATION } from "../transition-config";

interface BlogTemplateProps {
  children: ReactNode;
}

export default function BlogTemplate({ children }: BlogTemplateProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0 }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : { duration: PAGE_TRANSITION_DURATION, ease: "easeOut" }
        }
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
