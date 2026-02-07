import Link from "next/link";
import AuroraBackground from "../components/AuroraBackground";
import "./about.css";

const capabilities = [
  "Brand storytelling and visual systems",
  "Web design and high-performance front-end builds",
  "Content production for launches and campaigns",
  "Growth experiments with clear measurement",
];

const operatingPrinciples = [
  "Ship quickly, but only what can be maintained.",
  "Use signal, not noise, to guide creative decisions.",
  "Translate vision into clear, testable execution.",
];

export default function AboutPage() {
  return (
    <AuroraBackground palette="cool" intensity="low">
      <div className="about2-page">
        <div className="main-content">
          <div className="page-header">
            <h1 className="page-title">About Viberational</h1>
            <p className="page-description">
              We are a digital studio where hype meets reality.
            </p>
          </div>

          <div className="about2-layout">
            <section className="about2-panel about2-panel-wide">
              <h2>What We Build</h2>
              <p>
                Viberational helps ambitious teams turn momentum into outcomes.
                We shape strategy, design, and production into systems that move
                fast without sacrificing quality.
              </p>
              <p>
                Our work spans brand launches, web experiences, and campaign
                ecosystems that need to perform in the real world, not just in
                pitch decks.
              </p>
            </section>

            <section className="about2-panel about2-panel-narrow">
              <h2>How We Work</h2>
              <ul className="about2-list">
                {operatingPrinciples.map((principle) => (
                  <li key={principle}>{principle}</li>
                ))}
              </ul>
            </section>

            <section className="about2-panel about2-panel-full">
              <h2>Capabilities</h2>
              <ul className="about2-capabilities">
                {capabilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="about2-panel about2-panel-full about2-cta">
              <h2>Ready To Build Something Real?</h2>
              <p>
                If your next launch needs both energy and execution, we are
                ready to collaborate.
              </p>
              <div className="about2-actions">
                <Link
                  href="/portfolio"
                  className="about2-link about2-link-solid"
                  data-cursor
                >
                  View Portfolio
                </Link>
                <Link
                  href="/contact"
                  className="about2-link about2-link-outline"
                  data-cursor
                >
                  Start A Project
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
}
