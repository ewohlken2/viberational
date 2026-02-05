import BlogCard from "../blog-card";
import Header from "../header";
import "./blog.css";
import type { Metadata } from "next";
import { getAllBlogPosts } from "../../lib/blog-client";

export const metadata: Metadata = {
  title: "Blog | Elvis Wohlken",
  description: "Thoughts on web development, AI, and more.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog",
    description: "Thoughts on web development, AI, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Thoughts on web development, AI, and more.",
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <>
      <Header />
      <main className="blog-page">
        <div className="blog-page-header">
          <h1 className="blog-page-title">Blog</h1>
          <p className="blog-page-description">{metadata.description}</p>
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
