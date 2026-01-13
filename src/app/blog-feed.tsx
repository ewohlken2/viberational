import Link from "next/link";
import BlogCard from "./blog-card";
import { getRecentPosts } from "./data/blog";

export default function BlogFeed() {
  const recentPosts = getRecentPosts(3);

  return (
    <div className="blog-feed">
      <div className="blog-feed-grid">
        {recentPosts.map((post) => (
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
