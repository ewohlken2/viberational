'use client';

import { useContext, useEffect, useState } from "react";
import DirectionalHoverLink from "./directional-hover";
import "./header.css";
import Image from "next/image";
import HeaderLogo from "./logo";

import { HeaderContext } from './context/headerContext';

interface HeaderProps {
  topSection?: string;
}

export default function Header({ topSection }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Adjust threshold as needed
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={scrolled ? 'header header-scrolled ' + topSection : 'header ' + topSection}>
      <div className="header-container">
        <HeaderLogo />

        <DirectionalHoverLink className="header-link" href="/#about">
          <div className="link-text">About</div>
        </DirectionalHoverLink>
        <DirectionalHoverLink className="header-link" href="/#experience">
          <div className="link-text">Experience</div>
        </DirectionalHoverLink>
        <DirectionalHoverLink className="header-link" href="/#portfolio">
          <div className="link-text">Portfolio</div>
        </DirectionalHoverLink>
        <DirectionalHoverLink className="header-link" href="/contact">
          <div className="link-text">Contact</div>
        </DirectionalHoverLink>
      </div>
    </div>
  );
}
