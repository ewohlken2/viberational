import { render, screen } from "@testing-library/react";
import About2Page from "../about/page";

test("renders the about2 page content and primary links", () => {
  render(<About2Page />);

  const portfolioLink = screen.getByRole("link", { name: /view portfolio/i });
  const projectLink = screen.getByRole("link", { name: /start a project/i });

  expect(
    screen.getByRole("heading", { name: /about viberational/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/where hype meets reality/i)).toBeInTheDocument();
  expect(portfolioLink).toHaveAttribute("href", "/portfolio");
  expect(projectLink).toHaveAttribute("href", "/contact");
  expect(portfolioLink).toHaveAttribute("data-cursor");
  expect(projectLink).toHaveAttribute("data-cursor");
});
