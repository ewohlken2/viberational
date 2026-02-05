import { render } from "@testing-library/react";
import React from "react";
import BlogFeed from "../blog-feed";
import type { BlogPost } from "../../lib/blog-types";

describe("BlogFeed", () => {
  test("renders provided posts", () => {
    const posts: BlogPost[] = [
      {
        slug: "test-post",
        title: "Test Post",
        date: "2026-02-01",
        content: "Test content",
      },
    ];

    const { getByText } = render(<BlogFeed posts={posts} />);

    expect(getByText("Test Post")).toBeInTheDocument();
    expect(getByText("View all posts")).toBeInTheDocument();
  });
});
