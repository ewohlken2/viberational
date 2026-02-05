"use client";

import { Medusae } from "@vibe-rational/medusae";
import "@vibe-rational/medusae/style.css";
import "./page.css";
import LavaLampText from "./components/LavaLampText";
import Link from "next/link";
import { navLinks } from "./data/nav";

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
    colorBase: "#ffffff",
    colorOne: "#75a8ff",
    colorTwo: "#ff7166",
    colorThree: "#cfffca",
  },
  background: {
    color: "#000000",
  },
};

export default function Page() {
  return (
    <div className="landing-page">
      <div className="landing-medusae">
        <Medusae config={MEDUSAE_CONFIG} />
      </div>
      <div className="landing-content">
        <h1 className="landing-text">
          <LavaLampText>Vibe</LavaLampText>Rational
        </h1>
        <p className="landing-subtext">Where hype becomes reality.</p>
        <div className="landing-actions">
          {navLinks
            .filter((link) => link.label != "Experience")
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="landing-button button-glass"
              >
                {link.label}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
