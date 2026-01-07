"use client";

import { useState, useRef } from "react";
import RotatingCursor from "./rotatingCursor";
import IntroBanner from "./introBanner";
import HeaderLogo from "../logo";
import Screensaver, { ScreensaverRef } from "./screensaver";
import "./kris.css";

// Button padding constants (reduced by 3px from original 1rem/2rem)
const BUTTON_PADDING_Y = "0.75rem";
const BUTTON_PADDING_X = BUTTON_PADDING_Y;
const SCREENSAVER_BUTTON_DELAY = 250; // Delay in milliseconds before activating screensaver when button is clicked

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function KrisPage() {
  const [bannerKey, setBannerKey] = useState(0);
  const screensaverRef = useRef<ScreensaverRef>(null);

  const handleResetClick = () => {
    setBannerKey((prev) => prev + 1);
  };

  const handleScreensaverClick = () => {
    setTimeout(() => {
      screensaverRef.current?.activate();
    }, SCREENSAVER_BUTTON_DELAY);
  };

  return (
    <div style={{ cursor: "none" }}>
      <IntroBanner key={bannerKey} text="<ELVISWOHLKEN/>" />
      <RotatingCursor />
      <Screensaver ref={screensaverRef} text="Elvis Wohlken" />
      <div
        className="kris-logo"
        style={{
          position: "fixed",
          top: "20px",
          left: "20px",
          zIndex: 1001,
        }}
      >
        <HeaderLogo />
      </div>
      <nav
        style={{
          position: "fixed",
          top: "20px",
          right: 0,
          width: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {navLinks.map((link, index) => (
          <a
            key={link.label}
            href={link.href}
            data-cursor
            className="kris-nav-link"
            style={{
              textDecoration: "none",
              cursor: "none",
              padding: `${BUTTON_PADDING_Y} ${BUTTON_PADDING_X}`,
              marginLeft: index === 0 ? 0 : "30px",
              fontSize: "2rem",
            }}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div
        style={{
          backgroundColor: "#000000",
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          position: "fixed",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          data-cursor
          onClick={handleResetClick}
          className="kris-button"
          style={{
            padding: `${BUTTON_PADDING_Y} ${BUTTON_PADDING_X}`,
            fontSize: "1.6rem",
            backgroundColor: "transparent",
            border: "2px solid",
            borderRadius: "0.5rem",
            cursor: "none",
            textTransform: "uppercase",
          }}
        >
          Reset Intro Animation
        </button>
        <button
          data-cursor
          onClick={handleScreensaverClick}
          className="kris-button"
          style={{
            padding: `${BUTTON_PADDING_Y} ${BUTTON_PADDING_X}`,
            fontSize: "1.6rem",
            backgroundColor: "transparent",
            border: "2px solid",
            borderRadius: "0.5rem",
            cursor: "none",
            textTransform: "uppercase",
          }}
        >
          Start Screensaver
        </button>
      </div>
    </div>
  );
}
