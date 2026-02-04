"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DirectionalHoverLink from "./directional-hover";
import "./header.css";
import HeaderLogo from "./logo";
import { navLinks } from "./data/nav";

interface HeaderProps {
  topSection?: string;
}

export default function Header({ topSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        // Adjust threshold as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  const handleCloseMenu = () => setMenuOpen(false);
  const menuLabel = menuOpen ? "Close menu" : "Open menu";
  const headerClassName = [
    "header",
    scrolled ? "header-scrolled" : "",
    topSection ?? "",
    menuOpen ? "menu-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={headerClassName}>
      <div className="header-container">
        <HeaderLogo />

        <nav className="header-nav" aria-label="Primary">
          {navLinks.map((link) => (
            <DirectionalHoverLink
              key={link.href}
              className="header-link"
              href={link.href}
            >
              <div className="link-text">{link.label}</div>
            </DirectionalHoverLink>
          ))}
        </nav>

        <button
          className="header-menu-toggle"
          type="button"
          aria-label={menuLabel}
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="hamburger-lines" aria-hidden="true">
            <span className="hamburger-line line-1"></span>
            <span className="hamburger-line line-2"></span>
            <span className="hamburger-line line-3"></span>
          </span>
          <span className="visually-hidden">{menuLabel}</span>
        </button>
      </div>

      <div
        className="mobile-menu-overlay"
        data-open={menuOpen}
        data-testid="mobile-menu-overlay"
        onClick={handleCloseMenu}
      ></div>
      <nav
        id="mobile-menu"
        className="mobile-menu"
        data-open={menuOpen}
        data-testid="mobile-menu"
        aria-hidden={!menuOpen}
        aria-label="Mobile"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            className="mobile-menu-link"
            href={link.href}
            onClick={handleCloseMenu}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
