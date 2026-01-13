export interface PortfolioWebsite {
  id: string;
  title: string;
  description: string;
  image: string;
  url?: string;
  technologies?: string[];
}

export const portfolioWebsites: PortfolioWebsite[] = [
  {
    id: "portfolio-1",
    title: "HR Compliance Team App",
    description:
      "A modern e-commerce platform built to enhance a security company's HR and scheduling capabilities while seamlessy integrating with industry standard HR tools such as paychex and swipeclock",
    image: "/hrcompliance.png",
    url: "https://app.hrcomplianceteam.com/",
    technologies: [
      "React",
      "TypeScript",
      "Express",
      "MUI",
      "PostgreSQL",
      "Docker",
      "GitHub Actions",
      "JWT-based auth",
    ],
  },
  {
    id: "portfolio-4",
    title: "Mesh Agent",
    description:
      "Collaborative task management application with integrated agentic AI functionality",
    image: "/mesh-agent.png",
    url: "https://www.meshagent.com/",
    technologies: [
      "Go",
      "Dart",
      "Flutter",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "Github Actions",
      "Bitbucket",
      "WebSockets",
    ],
  },
  {
    id: "portfolio-3",
    title: "Powerboards",
    description:
      "Collaborative task management application with drag-and-drop functionality, team collaboration features, and integration with AI agents.",
    image: "/powerboards.png",
    url: "https://www.powerboards.com/",
    technologies: [
      "Go",
      "Dart",
      "Flutter",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "Github Actions",
      "Bitbucket",
    ],
  },
];

export function getAllWebsites(): PortfolioWebsite[] {
  return portfolioWebsites;
}

export function getWebsiteById(id: string): PortfolioWebsite | undefined {
  return portfolioWebsites.find((website) => website.id === id);
}
