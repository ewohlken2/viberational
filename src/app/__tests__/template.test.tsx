import { render, screen } from "@testing-library/react";
import Template from "../template";

const mockUsePathname = jest.fn();
const mockUseReducedMotion = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

jest.mock("framer-motion", () => ({
  AnimatePresence: ({
    children,
    mode,
  }: {
    children: React.ReactNode;
    mode?: string;
  }) => (
    <div data-testid="presence" data-mode={mode}>
      {children}
    </div>
  ),
  motion: {
    div: ({
      children,
      ...props
    }: {
      children: React.ReactNode;
      [key: string]: unknown;
    }) => (
      <div data-testid="transition-wrapper" data-props={JSON.stringify(props)}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe("Route template transitions", () => {
  test("uses subtle fade motion defaults", () => {
    mockUsePathname.mockReturnValue("/about");
    mockUseReducedMotion.mockReturnValue(false);

    render(
      <Template>
        <p>Animated content</p>
      </Template>,
    );

    expect(screen.getByTestId("presence")).toHaveAttribute("data-mode", "wait");
    expect(screen.getByText("Animated content")).toBeInTheDocument();

    const props = JSON.parse(
      screen.getByTestId("transition-wrapper").getAttribute("data-props")!,
    );
    expect(props.initial).toEqual({ opacity: 0, y: 6 });
    expect(props.animate).toEqual({ opacity: 1, y: 0 });
    expect(props.exit).toEqual({ opacity: 0, y: -4 });
    expect(props.transition).toEqual({ duration: 0.24, ease: "easeOut" });
  });

  test("disables route animation when reduced motion is preferred", () => {
    mockUsePathname.mockReturnValue("/blog");
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <Template>
        <p>Reduced motion content</p>
      </Template>,
    );

    const props = JSON.parse(
      screen.getByTestId("transition-wrapper").getAttribute("data-props")!,
    );
    expect(props.initial).toBe(false);
    expect(props.animate).toEqual({ opacity: 1, y: 0 });
    expect(props.exit).toBeUndefined();
    expect(props.transition).toEqual({ duration: 0 });
  });
});
