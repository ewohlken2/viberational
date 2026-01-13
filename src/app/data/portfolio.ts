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
    title: "HR Compliance Team",
    description:
      "A modern HR platform built to enhance a security company's mesaging, scheduling, and compliance capabilities while seamlessy integrating with industry standard HR tools such as paychex and swipeclock",
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
      "MeshAgent is a production-grade agent orchestration platform providing secure real-time collaboration environments, enterprise deployment infrastructure, and end-to-end observability for building, operating, and scaling agentic applications.",
    image: "/mesh-agent.png",
    url: "https://www.meshagent.com/",
    technologies: [
      "Go",
      "Dart",
      "Flutter",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
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
      "Bitbucket",
    ],
  },
  {
    id: "sourceability",
    title: "Sourceability",
    description:
      "Large scale B2B ecommerce platform featuring a custom Bill of Materials tool and advanced price comparison engine.",
    image: "/sourceability.png",
    url: "https://www.sourceability.com/",
    technologies: ["C#", "React", "Javascript", "AWS", "Jira", "Cypress"],
  },
];

export function getAllWebsites(): PortfolioWebsite[] {
  return portfolioWebsites;
}

export function getWebsiteById(id: string): PortfolioWebsite | undefined {
  return portfolioWebsites.find((website) => website.id === id);
}
