import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { getAllWebsites } from "../data/portfolio";
import PortfolioPage from "../portfolio/page";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    fill: _fill,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

jest.mock("../portfolio/introBanner", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("../components/AuroraBackground", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

describe("Portfolio modal close animation", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  test("adds closing classes before unmounting the expanded modal", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    const { container } = render(<PortfolioPage />);
    const [firstWebsite] = getAllWebsites();

    expect(firstWebsite).toBeDefined();

    const firstCard = screen
      .getByText(firstWebsite!.title)
      .closest(".portfolio-card") as HTMLElement | null;

    expect(firstCard).not.toBeNull();

    await user.click(firstCard as HTMLElement);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    const overlay = container.querySelector(".portfolio-card-expanded-overlay");
    const expandedCard = container.querySelector(".portfolio-card-expanded");

    expect(overlay).toHaveClass("is-closing");
    expect(expandedCard).toHaveClass("is-closing");

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(
      container.querySelector(".portfolio-card-expanded-overlay"),
    ).toBeNull();
  });

  test("shows a view source button when repo exists and opens it", async () => {
    const user = userEvent.setup();
    const openSpy = jest
      .spyOn(window, "open")
      .mockImplementation(() => null as unknown as Window);

    const [firstWebsite] = getAllWebsites();

    expect(firstWebsite).toBeDefined();
    expect(firstWebsite.repo).toBeDefined();

    render(<PortfolioPage />);

    const firstCard = screen
      .getByText(firstWebsite.title)
      .closest(".portfolio-card") as HTMLElement | null;

    expect(firstCard).not.toBeNull();

    await user.click(firstCard as HTMLElement);

    const viewSourceButton = screen.getByRole("button", {
      name: /view source/i,
    });
    await user.click(viewSourceButton);

    expect(openSpy).toHaveBeenCalledWith(firstWebsite.repo, "_blank");
    openSpy.mockRestore();
  });
});
