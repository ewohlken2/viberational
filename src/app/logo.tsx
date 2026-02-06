"use client";

import Link from "next/link";
import "./logo.css";
import Image from "next/image";

export default function HeaderLogo() {
  return (
    <Link className="header-logo" href="/" data-cursor>
      <div className="link-text">Home</div>
      𝜈𝑹
    </Link>
  );
}
