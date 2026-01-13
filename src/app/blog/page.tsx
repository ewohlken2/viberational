import { getAllPosts } from "../data/blog";
import BlogCard from "../blog-card";
import Header from "../header";
import "./blog.css";

export const metadata = {
  title: "Blog | Elvis Wohlken",
  description: "Thoughts on web development, React, TypeScript, and more.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Header />
      <main className="blog-page">
        <div className="blog-page-header">
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-page-description">
            Thoughts on web development, React, TypeScript, and more.
          </p>
        </div>
        <div className="blog-page-grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </>
  );
}
