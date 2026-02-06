"use client";

import { Medusae } from "@vibe-rational/medusae";
import "@vibe-rational/medusae/style.css";
import "./page.css";
import LavaLampText from "./components/LavaLampText";
import Link from "next/link";
import { navLinks } from "./data/nav";
import TypingText from "./components/TypingText";
import { useState } from "react";
import { motion } from "framer-motion";

const MEDUSAE_CONFIG = {
  cursor: {
    radius: 0.065,
    strength: 3,
    dragFactor: 0.015,
  },
  halo: {
    outerOscFrequency: 2.6,
    outerOscAmplitude: 0.76,
    outerOscJitterStrength: 0.025,
    outerOscJitterSpeed: 0.3,
    radiusBase: 2.4,
    radiusAmplitude: 0.5,
    shapeAmplitude: 0.75,
    rimWidth: 1.8,
    outerStartOffset: 0.4,
    outerEndOffset: 2.2,
    scaleX: 1.3,
    scaleY: 1,
  },
  particles: {
    baseSize: 0.012,
    activeSize: 0.044,
    blobScaleX: 1,
    blobScaleY: 0.6,
    rotationSpeed: 0.1,
    rotationJitter: 0.2,
    cursorFollowStrength: 1,
    oscillationFactor: 1,
    colorBase: "#16f59c",
    colorOne: "#fff186",
    colorTwo: "#0080ff",
    colorThree: "#ff60dd",
  },
  background: {
    color: "#000000",
  },
};

export default function Page() {
  const [isTypingFinished, setIsTypingFinished] = useState(false);
  return (
    <div className="landing-page">
      <div className="landing-medusae">
        <Medusae config={MEDUSAE_CONFIG} />
      </div>
      <div className="landing-content">
        <h1 className="landing-text">
          <span
            className="vibe-text"
            style={{ opacity: isTypingFinished ? 1 : 0 }}
          >
            <LavaLampText>
              <span className="bold">vibe</span>
            </LavaLampText>
            Rational
          </span>

          <TypingText onFinishTyping={() => setIsTypingFinished(true)}>
            <span className="bold">vibe</span>Rational
          </TypingText>
        </h1>
        <motion.p
          className="landing-subtext"
          initial={{ opacity: 0, y: 8 }}
          animate={
            isTypingFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
          }
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        >
          Where hype becomes reality.
        </motion.p>
        <motion.div
          className="buttons"
          initial={{ opacity: 0, y: 8 }}
          animate={
            isTypingFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }
          }
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          {navLinks
            .filter((link) => link.label != "Experience")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-cursor
                className="button button-glass"
              >
                {link.label}
              </Link>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
