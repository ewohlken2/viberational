"use client";

import CursorCanvas from "../cursor-canvas";
import IntroBanner from "../introBanner";
import HeaderLogo from "../logo";
import "./kris.css";

// Button padding constants (reduced by 3px from original 1rem/2rem)
const BUTTON_PADDING_Y = "0.75rem";
const BUTTON_PADDING_X = BUTTON_PADDING_Y;

const navLinks = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Portfolio", href: "/#portfolio" },
  { label: "Contact", href: "/contact" },
];

export default function KrisPage() {
  return (
    <div style={{ cursor: "none" }}>
      <IntroBanner text="<ELVISWOHLKEN/>" />
      <CursorCanvas />
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
          left: 0,
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
            style={{
              color: "#F8B4B9",
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
        }}
      >
        <button
          data-cursor
          style={{
            padding: `${BUTTON_PADDING_Y} ${BUTTON_PADDING_X}`,
            fontSize: "1.6rem",
            backgroundColor: "transparent",
            color: "#F8B4B9",
            border: "2px solid #F8B4B9",
            borderRadius: "0.5rem",
            cursor: "none",
            textTransform: "uppercase",
          }}
        >
          Click Me
        </button>
      </div>
    </div>
  );
}
