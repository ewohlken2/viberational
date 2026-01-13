"use client";

import { useEffect, useState } from "react";
import DirectionalHoverLink from "./directional-hover";
import "./header.css";
import HeaderLogo from "./logo";
import { navLinks } from "./data/nav";

interface HeaderProps {
  topSection?: string;
}

export default function Header({ topSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <div
      className={
        scrolled
          ? "header header-scrolled " + topSection
          : "header " + topSection
      }
    >
      <div className="header-container">
        <HeaderLogo />

        {navLinks.map((link) => (
          <DirectionalHoverLink
            key={link.href}
            className="header-link"
            href={link.href}
          >
            <div className="link-text">{link.label}</div>
          </DirectionalHoverLink>
        ))}
      </div>
    </div>
  );
}
