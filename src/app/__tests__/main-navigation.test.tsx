import { render, screen } from "@testing-library/react";
import MainNavigation from "../components/MainNavigation";

test("excludes Portfolio by default", () => {
  render(<MainNavigation />);

  expect(screen.queryByText("Portfolio")).not.toBeInTheDocument();
  expect(screen.getByText("About")).toBeInTheDocument();
});
