import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "../header";

describe("Header mobile menu", () => {
  test("toggles the mobile menu via the hamburger button", async () => {
    const user = userEvent.setup();

    render(<Header />);

    const toggleButton = screen.getByRole("button", { name: /open menu/i });
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    await user.click(toggleButton);

    expect(toggleButton).toHaveAttribute("aria-expanded", "true");
    const menu = screen.getByTestId("mobile-menu");
    expect(menu).toHaveAttribute("data-open", "true");

    await user.click(screen.getByTestId("mobile-menu-overlay"));

    expect(toggleButton).toHaveAttribute("aria-expanded", "false");
    expect(menu).toHaveAttribute("data-open", "false");
  });
});
