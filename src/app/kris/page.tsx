"use client";

import CursorCanvas from "../cursor-canvas";
import "./kris.css";

export default function KrisPage() {
  return (
    <div style={{ cursor: "none" }}>
      <CursorCanvas />
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          padding: "1.5rem 2rem",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(10px)",
          zIndex: 1000,
          display: "flex",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          Home
        </a>
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          About
        </a>
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          Services
        </a>
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          Portfolio
        </a>
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          Blog
        </a>
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          Contact
        </a>
        <a
          href="#"
          data-cursor
          style={{ color: "#F8B4B9", textDecoration: "none", cursor: "none" }}
        >
          Shop
        </a>
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
            padding: "1rem 2rem",
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
