"use client";

import Link from "next/link";
import "./logo.css";
import Image from "next/image";
import LavaLampText from "./components/LavaLampText";

export default function HeaderLogo() {
  return (
    <Link className="header-logo" href="/" data-cursor>
      <div className="link-text">Home</div>
      {/* <LavaLampText>𝜈</LavaLampText>𝑹 */}
      <LavaLampText>v</LavaLampText>
      <span className="R">R</span>
    </Link>
  );
}
