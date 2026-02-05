import { getAllPosts, getPostBySlug } from "../data/blog";

describe("Blog data loader", () => {
  test("loads posts from markdown files", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].slug).toBeDefined();
  });

  test("returns a post by slug", () => {
    const post = getPostBySlug("moltbook-weird-posts-and-security");
    expect(post?.title).toBeDefined();
  });
});
