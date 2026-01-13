"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import RotatingCursor from "./rotatingCursor";
import IntroBanner from "./introBanner";
import HeaderLogo from "../logo";
import Screensaver, { ScreensaverRef } from "./screensaver";
import { getAllWebsites, PortfolioWebsite } from "../data/portfolio";
import { navLinks } from "../data/nav";
import "./portfolio.css";

export default function PortfolioPage() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const screensaverRef = useRef<ScreensaverRef>(null);
  const portfolioWebsites = getAllWebsites();

  const handleIntroComplete = () => {
    console.log("Intro complete");
    setShowIntro(false);
  };

  const handleCardClick = (websiteId: string) => {
    setExpandedCard(websiteId);
  };

  const handleCloseCard = () => {
    setExpandedCard(null);
  };

  const handleVisitSite = (url: string | undefined) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  // Prevent body scroll when card is expanded
  useEffect(() => {
    if (expandedCard) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [expandedCard]);

  return (
    <div className="portfolio-container">
      {showIntro && (
        <IntroBanner text="<ELVISWOHLKEN/>" onComplete={handleIntroComplete} />
      )}
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
        <h1 className="portfolio-title">Portfolio</h1>
        <div className="portfolio-grid">
          {portfolioWebsites.map((website) => (
            <div
              key={website.id}
              data-cursor
              className="portfolio-card"
              onClick={() => handleCardClick(website.id)}
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
      </div>

      {/* Expanded Card View */}
      {expandedCard && (
        <div className="portfolio-card-expanded-overlay">
          <div className="portfolio-card-expanded">
            {(() => {
              const website = portfolioWebsites.find(
                (w) => w.id === expandedCard
              );
              if (!website) return null;

              return (
                <>
                  <button
                    data-cursor
                    className="portfolio-card-close"
                    onClick={handleCloseCard}
                    aria-label="Close"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                  <div className="portfolio-card-expanded-content">
                    <div className="portfolio-card-expanded-image">
                      <div className="portfolio-card-expanded-image-container">
                        <div className="portfolio-card-expanded-image-inner">
                          <Image
                            className="portfolio-card-website-image"
                            src={website.image}
                            alt={website.title}
                            width={800}
                            height={800}
                          />
                          <Image
                            width={1000}
                            height={1000}
                            src="/laptop.png"
                            alt="Laptop with website open"
                            className="portfolio-card-laptop-image"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="portfolio-card-expanded-details">
                      <h2 className="portfolio-card-expanded-title">
                        {website.title}
                      </h2>
                      <p className="portfolio-card-expanded-description">
                        {website.description}
                      </p>
                      {website.technologies &&
                        website.technologies.length > 0 && (
                          <div className="portfolio-card-expanded-tech">
                            <h3>Technologies:</h3>
                            <div className="portfolio-card-tech-tags">
                              {website.technologies.map((tech) => (
                                <span key={tech} className="portfolio-tech-tag">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {website.url && (
                        <button
                          data-cursor
                          className="portfolio-button portfolio-visit-button"
                          onClick={() => handleVisitSite(website.url)}
                        >
                          Visit Website
                        </button>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
