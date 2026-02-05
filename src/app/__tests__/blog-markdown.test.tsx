import { render } from "@testing-library/react";
import React from "react";
import Markdown from "../blog/markdown";

describe("Blog Markdown", () => {
  test("renders headings", () => {
    const markdown = `# Title

## Subtitle`;
    const { container } = render(<Markdown content={markdown} />);

    expect(container.querySelector("h1")?.textContent).toBe("Title");
    expect(container.querySelector("h2")?.textContent).toBe("Subtitle");
  });
});
