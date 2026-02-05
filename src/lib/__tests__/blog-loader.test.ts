import { loadAllPosts, loadPostBySlug } from "../blog-loader";

describe("blog-loader", () => {
  test("loads posts from markdown files", () => {
    const posts = loadAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].slug).toBeDefined();
  });

  test("loads a post by slug", () => {
    const post = loadPostBySlug("moltbook-weird-posts-and-security");
    expect(post?.title).toBeDefined();
  });
});
