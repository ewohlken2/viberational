import { render, screen } from "@testing-library/react";
import LayoutChrome from "../components/LayoutChrome";

const mockUsePathname = jest.fn();
const mockUseReducedMotion = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("framer-motion", () => ({
  useReducedMotion: () => mockUseReducedMotion(),
}));

test("renders shared logo and main navigation", () => {
  mockUsePathname.mockReturnValue("/about");
  mockUseReducedMotion.mockReturnValue(false);

  render(<LayoutChrome />);

  expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute(
    "href",
    "/",
  );
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute(
    "href",
    "/about",
  );
  expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
    "href",
    "/blog",
  );
  expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
    "href",
    "/contact",
  );
});

test("hides chrome on homepage and fades it in on other routes", () => {
  mockUseReducedMotion.mockReturnValue(false);

  mockUsePathname.mockReturnValue("/");
  const { rerender } = render(<LayoutChrome />);

  const chrome = screen.getByTestId("layout-chrome");
  expect(chrome).toHaveStyle({
    opacity: "0",
    transition: "opacity 280ms ease-out 0ms",
  });

  mockUsePathname.mockReturnValue("/blog");
  rerender(<LayoutChrome />);

  expect(screen.getByTestId("layout-chrome")).toHaveStyle({
    opacity: "1",
    transition: "opacity 280ms ease-out 240ms",
  });
});
