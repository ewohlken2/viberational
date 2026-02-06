"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import IntroBanner from "./introBanner";
import { getAllWebsites } from "../data/portfolio";
import AuroraBackground from "../components/AuroraBackground";
import "./portfolio.css";

export default function PortfolioPage() {
  const CLOSE_ANIMATION_MS = 300;
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [isClosingExpandedCard, setIsClosingExpandedCard] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const closeTimeoutRef = useRef<number | null>(null);
  const portfolioWebsites = getAllWebsites();

  const handleIntroComplete = () => {
    console.log("Intro complete");
    setShowIntro(false);
  };

  const handleCardClick = (websiteId: string) => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsClosingExpandedCard(false);
    setExpandedCard(websiteId);
  };

  const handleCloseCard = () => {
    if (!expandedCard || isClosingExpandedCard) return;

    setIsClosingExpandedCard(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setExpandedCard(null);
      setIsClosingExpandedCard(false);
      closeTimeoutRef.current = null;
    }, CLOSE_ANIMATION_MS);
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

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AuroraBackground palette="cool" intensity="low">
      <div className="portfolio-container">
        {showIntro && (
          <IntroBanner text="<VIBERATIONAL/>" onComplete={handleIntroComplete} />
        )}
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">Portfolio</h1>
            <p className="page-description">See what we're working on.</p>
          </div>
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
          <div
            className={`portfolio-card-expanded-overlay${isClosingExpandedCard ? " is-closing" : ""}`}
          >
            <div
              className={`portfolio-card-expanded${isClosingExpandedCard ? " is-closing" : ""}`}
            >
              {(() => {
                const website = portfolioWebsites.find(
                  (w) => w.id === expandedCard,
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
    </AuroraBackground>
  );
}
