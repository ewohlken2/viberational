import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "./data/blog";

interface BlogCardProps {
  post: BlogPost;
}

function getExcerpt(content: string, maxLength: number = 150): string {
  // Remove code blocks and get plain text
  const plainText = content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\*\*/g, "")
    .replace(/\n+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength).trim() + "...";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="blog-card">
      {post.image && (
        <div className="blog-card-image">
          <Image
            src={post.image}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
      <div className="blog-card-content">
        <h3 className="blog-card-title">{post.title}</h3>
        <time className="blog-card-date">{formatDate(post.date)}</time>
        <p className="blog-card-excerpt">{getExcerpt(post.content)}</p>
      </div>
    </Link>
  );
}
