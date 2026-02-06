import { renderToStaticMarkup } from "react-dom/server";
import RootLayout from "../layout";

jest.mock("next/font/local", () => ({
  __esModule: true,
  default: () => ({ variable: "mock-font" }),
}));

jest.mock("../components/AppCursor", () => ({
  __esModule: true,
  default: () => <div data-testid="app-cursor" />,
}));

jest.mock("../components/LayoutChrome", () => ({
  __esModule: true,
  default: () => <div data-testid="layout-chrome" />,
}));

test("renders a global copyright footer", () => {
  const markup = renderToStaticMarkup(
    <RootLayout>
      <main>Page Content</main>
    </RootLayout>,
  );

  expect(markup).toContain("Copyright 2026");
});
