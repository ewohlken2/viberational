import { render, screen } from "@testing-library/react";
import About2Page from "../about/page";

test("renders the about2 page content and primary links", () => {
  render(<About2Page />);

  expect(
    screen.getByRole("heading", { name: /about viberational/i }),
  ).toBeInTheDocument();
  expect(screen.getByText(/where hype meets reality/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /view portfolio/i })).toHaveAttribute(
    "href",
    "/portfolio",
  );
  expect(
    screen.getByRole("link", { name: /start a project/i }),
  ).toHaveAttribute("href", "/contact");
});
