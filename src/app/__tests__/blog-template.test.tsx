import { render, screen } from "@testing-library/react";
import BlogTemplate from "../blog/template";

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
      <div data-testid="blog-transition-wrapper" data-props={JSON.stringify(props)}>
        {children}
      </div>
    ),
  },
  useReducedMotion: () => mockUseReducedMotion(),
}));

describe("Blog route template transitions", () => {
  test("uses wait-mode fade transitions for blog route changes", () => {
    mockUsePathname.mockReturnValue("/blog/test-post");
    mockUseReducedMotion.mockReturnValue(false);

    render(
      <BlogTemplate>
        <p>Blog post content</p>
      </BlogTemplate>,
    );

    expect(screen.getByTestId("presence")).toHaveAttribute("data-mode", "wait");

    const props = JSON.parse(
      screen
        .getByTestId("blog-transition-wrapper")
        .getAttribute("data-props")!,
    );
    expect(props.initial).toEqual({ opacity: 0 });
    expect(props.animate).toEqual({ opacity: 1 });
    expect(props.exit).toEqual({ opacity: 0 });
    expect(props.transition).toEqual({ duration: 0.24, ease: "easeOut" });
  });

  test("disables blog route animation when reduced motion is preferred", () => {
    mockUsePathname.mockReturnValue("/blog");
    mockUseReducedMotion.mockReturnValue(true);

    render(
      <BlogTemplate>
        <p>Reduced motion blog content</p>
      </BlogTemplate>,
    );

    const props = JSON.parse(
      screen
        .getByTestId("blog-transition-wrapper")
        .getAttribute("data-props")!,
    );
    expect(props.initial).toBe(false);
    expect(props.animate).toEqual({ opacity: 1 });
    expect(props.exit).toBeUndefined();
    expect(props.transition).toEqual({ duration: 0 });
  });
});
