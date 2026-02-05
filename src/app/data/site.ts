import { Metadata } from "next";

export const baseUrl = new URL("https://elviswohlken.com");

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
