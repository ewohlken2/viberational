import localFont from "next/font/local";
import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import AppCursor from "./components/AppCursor";
import LayoutChrome from "./components/LayoutChrome";

const robotoMono = localFont({
  src: [
    {
      path: "./fonts/RobotoMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-Bold.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-Light.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-SemiBold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/RobotoMono-Medium.ttf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-roboto-mono",
  weight: "100 900",
});

const geistSans = localFont({
  src: "./fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const chillax = localFont({
  src: "./fonts/Chillax-Variable.ttf",
  variable: "--font-chillax",
  weight: "100 900",
});

const baseUrl = new URL("https://elviswohlken.com");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Elvis Wohlken",
    template: "%s | Elvis Wohlken",
  },
  description: "Let's build something together.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Elvis Wohlken",
    title: "Elvis Wohlken",
    description: "Let's build something together.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elvis Wohlken",
    description: "Let's build something together.",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${robotoMono.variable} ${geistSans.variable} ${chillax.variable} antialiased`}
      >
        <AppCursor />
        <LayoutChrome />
        {children}
        <footer className="site-footer">Copyright 2026</footer>
      </body>
    </html>
  );
}
