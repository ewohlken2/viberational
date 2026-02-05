import { getAllBlogPosts, getBlogPost } from "../blog-client";

describe("blog-client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("getAllBlogPosts returns data on 200", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ slug: "test" }],
    });

    const posts = await getAllBlogPosts();

    expect(posts[0].slug).toBe("test");
  });

  test("getBlogPost returns null on 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    const post = await getBlogPost("missing");

    expect(post).toBeNull();
  });
});
