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

  test("renders fenced code blocks with highlight.js classes", () => {
    const markdown = "```ts\nconst value: number = 1;\n```";
    const { container } = render(<Markdown content={markdown} />);

    const pre = container.querySelector("pre.hljs");
    expect(pre).toBeInTheDocument();
    expect(pre?.querySelector("code span")).toBeInTheDocument();
  });

  test("does not apply highlight.js class when no language is provided", () => {
    const markdown = "```\nconst value = 1;\n```";
    const { container } = render(<Markdown content={markdown} />);

    const pre = container.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre).not.toHaveClass("hljs");
  });
});
