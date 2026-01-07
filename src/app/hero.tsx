'use client';
import "./hero.css";
import Link from 'next/link';
import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="main-banner-container">
      <div className="main-banner">
        <div className="main-banner-content">
          <div className="title">
            <span className="intro-header">Hello, my name is </span>
            <h1 className="main-header">Elvis Wohlken</h1>
            <div className="intro-header-2">I&apos;m a Full Stack Web Developer in LA </div>
          </div>
          <div className="button-container">
            <div className="button-inner">
              <Link className="button button--light" href="/contact">
                I want to work with you
              </Link>
            </div>
          </div>
        </div>

        <picture className="main-banner-image fade-in"><Image
          className="image"
          src="/confident-1-cutout.png"
          alt="Hero Portrait of Elvis Wohlken"
          width={1000}
          height={1000}
          priority
        /></picture>
      </div>
    </div>
  );
}
