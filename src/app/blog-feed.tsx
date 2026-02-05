import Link from "next/link";
import BlogCard from "./blog-card";
import type { BlogPost } from "../lib/blog-types";

interface BlogFeedProps {
  posts: BlogPost[];
}

export default function BlogFeed({ posts }: BlogFeedProps) {
  return (
    <div className="blog-feed">
      <div className="blog-feed-grid">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="blog-feed-footer">
        <Link href="/blog" className="blog-feed-link">
          View all posts
        </Link>
      </div>
    </div>
  );
}
