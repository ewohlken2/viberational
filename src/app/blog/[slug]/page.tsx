import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { getAllBlogPosts, getBlogPost } from "../../../lib/blog-client";
import "../blog.css";
import Markdown from "../markdown";
import AuroraBackground from "../../components/AuroraBackground";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const baseUrl = "https://elviswohlken.com";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const description = post.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Elvis Wohlken",
    },
    mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
    image: post.image ? [`${baseUrl}${post.image}`] : undefined,
  };

  return (
    <>
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AuroraBackground palette="cool" intensity="low">
        <main className="blog-post-page">
          <article className="blog-post">
            <header className="blog-post-header">
              <Link href="/blog" className="blog-post-back">
                &larr; Back to blog
              </Link>
              <h1 className="blog-post-title">{post.title}</h1>
              <time className="blog-post-date">{formatDate(post.date)}</time>
            </header>

            {post.image && (
              <div className="blog-post-image">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </div>
            )}

            <div className="blog-post-content">
              <Markdown content={post.content} />
            </div>
          </article>
        </main>
      </AuroraBackground>
    </>
  );
}
