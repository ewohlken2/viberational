export interface PortfolioWebsite {
  id: string;
  title: string;
  description: string;
  image: string;
  url?: string;
  repo?: string;
  technologies?: string[];
}

export const portfolioWebsites: PortfolioWebsite[] = [
  {
    id: "breathdearmedusae",
    title: "Breath Dear Medusae",
    description:
      "Cool configurable particle effect inspired by the antigravity landing page. A vibe coded collab with the help of GPT 5.2 and Gemini",
    image: "/medusae.png",
    url: "https://breath-dear-medusae.vercel.app/",
    repo: "https://github.com/ewohlken2/BreathDearMedusae",
    technologies: [
      "Three.js",
      "React",
      "Javascript",
      "GPT-5.2-Codex",
      "Gemini-3",
    ],
  },
];

export function getAllWebsites(): PortfolioWebsite[] {
  return portfolioWebsites;
}

export function getWebsiteById(id: string): PortfolioWebsite | undefined {
  return portfolioWebsites.find((website) => website.id === id);
}
