"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import RotatingCursor from "./rotatingCursor";
import IntroBanner from "./introBanner";
import HeaderLogo from "../logo";
import Screensaver, { ScreensaverRef } from "./screensaver";
import { getAllWebsites } from "../data/portfolio";
import { navLinks } from "../data/nav";
import "./portfolio.css";

export default function PortfolioPage() {
  const [bannerKey, setBannerKey] = useState(0);
  const screensaverRef = useRef<ScreensaverRef>(null);
  const portfolioWebsites = getAllWebsites();

  const handleResetClick = () => {
    setBannerKey((prev) => prev + 1);
  };

  const handleIntroComplete = () => {
    console.log("Intro complete");
  };

  return (
    <div className="portfolio-container">
      <IntroBanner
        key={bannerKey}
        text="<ELVISWOHLKEN/>"
        onComplete={handleIntroComplete}
      />
      <RotatingCursor />
      <Screensaver ref={screensaverRef} text="Elvis Wohlken" />
      <div className="portfolio-logo">
        <HeaderLogo />
      </div>
      <nav className="portfolio-nav">
        {navLinks
          .filter((link) => link.label !== "Portfolio")
          .map((link) => (
            <a
              key={link.label}
              href={link.href}
              data-cursor
              className="portfolio-nav-link"
            >
              {link.label}
            </a>
          ))}
      </nav>
      <div className="portfolio-main-content">
        <h1 className="portfolio-title">Portfolio Websites</h1>
        <div className="portfolio-grid">
          {portfolioWebsites.map((website) => (
            <div
              key={website.id}
              data-cursor
              className="portfolio-card"
              onClick={() => {
                if (website.url) {
                  window.open(website.url, "_blank");
                }
              }}
            >
              <div className="portfolio-card-image">
                <Image
                  src={website.image}
                  alt={website.title}
                  fill
                  className="portfolio-card-image"
                />
              </div>
              <div className="portfolio-card-content">
                <h2 className="portfolio-card-title">{website.title}</h2>
                <p className="portfolio-card-description">
                  {website.description}
                </p>
                {website.technologies && website.technologies.length > 0 && (
                  <div className="portfolio-card-tech-tags">
                    {website.technologies.map((tech) => (
                      <span key={tech} className="portfolio-tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="portfolio-button-container">
          <button
            data-cursor
            onClick={handleResetClick}
            className="portfolio-button"
          >
            Reset Intro Animation
          </button>
        </div>
      </div>
    </div>
  );
}
