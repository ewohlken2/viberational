import BlogCard from "../blog-card";
import "./blog.css";
import type { Metadata } from "next";
import { getAllBlogPosts } from "../../lib/blog-client";
import AuroraBackground from "../components/AuroraBackground";

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
    <AuroraBackground palette="cool" intensity="low">
      <main className="blog-page main-content">
        <div className="page-header">
          <h1 className="page-title">Blog</h1>
          <p className="page-description">{metadata.description}</p>
        </div>
        <div className="blog-page-grid">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </main>
    </AuroraBackground>
  );
}
