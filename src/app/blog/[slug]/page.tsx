import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "../../data/blog";
import Header from "../../header";
import "../blog.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const baseUrl = "https://elviswohlken.com";

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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

interface ContentBlock {
  type: "text" | "code";
  content: string;
  language?: string;
}

function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;

  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      const textContent = content.substring(lastIndex, match.index).trim();
      if (textContent) {
        blocks.push({ type: "text", content: textContent });
      }
    }

    // Add the code block
    blocks.push({
      type: "code",
      language: match[1] || "plaintext",
      content: match[2].trim(),
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after the last code block
  if (lastIndex < content.length) {
    const textContent = content.substring(lastIndex).trim();
    if (textContent) {
      blocks.push({ type: "text", content: textContent });
    }
  }

  return blocks;
}

function renderTextContent(text: string): React.ReactNode[] {
  // Split by double newlines to create paragraphs
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((paragraph, index) => {
    // Handle bold text
    const parts = paragraph.split(/(\*\*.*?\*\*)/g);
    const rendered = parts.map((part, partIndex) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={partIndex}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    return <p key={index}>{rendered}</p>;
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentBlocks = parseContent(post.content);
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
      <Header />
      <Script
        id="blog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            {contentBlocks.map((block, index) => {
              if (block.type === "code") {
                return (
                  <div key={index} className="code-block">
                    {block.language && block.language !== "plaintext" && (
                      <span className="code-block-language">
                        {block.language}
                      </span>
                    )}
                    <pre>
                      <code>{block.content}</code>
                    </pre>
                  </div>
                );
              }
              return (
                <div key={index} className="text-block">
                  {renderTextContent(block.content)}
                </div>
              );
            })}
          </div>
        </article>
      </main>
    </>
  );
}
