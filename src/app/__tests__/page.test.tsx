import { render, screen } from "@testing-library/react";
import Page from "../page";

jest.mock("@vibe-rational/medusae", () => ({
  __esModule: true,
  Medusae: () => <div data-testid="medusae" />,
}));

test("renders Medusae inside a div", () => {
  const { container } = render(<Page />);

  expect(container.firstChild?.nodeName).toBe("DIV");
  expect(screen.getByTestId("medusae")).toBeInTheDocument();
});

test("renders centered landing text", () => {
  render(<Page />);

  const heading = screen.getByRole("heading", { name: /Vibe\s*Rational/i });
  expect(heading).toBeInTheDocument();
  expect(heading).toHaveClass("landing-text");
});

test("renders subtext and nav links as glass buttons", () => {
  render(<Page />);

  const subtext = screen.getByText("Where hype becomes reality.");
  expect(subtext).toBeInTheDocument();
  expect(subtext).toHaveClass("landing-subtext");

  expect(screen.getByRole("link", { name: "About" })).toHaveClass(
    "button-glass"
  );
  expect(screen.getByRole("link", { name: "Experience" })).toHaveClass(
    "button-glass"
  );
  expect(screen.getByRole("link", { name: "Blog" })).toHaveClass(
    "button-glass"
  );
  expect(screen.getByRole("link", { name: "Portfolio" })).toHaveClass(
    "button-glass"
  );
  expect(screen.getByRole("link", { name: "Contact" })).toHaveClass(
    "button-glass"
  );
});
