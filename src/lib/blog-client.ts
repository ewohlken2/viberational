import type { BlogPost } from "./blog-types";

interface ClientOptions {
  baseUrl?: string;
}

function resolveBaseUrl(baseUrl?: string): string {
  if (baseUrl) {
    return baseUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    return "";
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

function buildUrl(path: string, options?: ClientOptions): string {
  const baseUrl = resolveBaseUrl(options?.baseUrl);
  return baseUrl ? `${baseUrl}${path}` : path;
}

export async function getAllBlogPosts(
  options?: ClientOptions,
): Promise<BlogPost[]> {
  const res = await fetch(buildUrl("/api/blog", options));
  if (!res.ok) {
    throw new Error("Failed to load posts");
  }
  return (await res.json()) as BlogPost[];
}

export async function getBlogPost(
  slug: string,
  options?: ClientOptions,
): Promise<BlogPost | null> {
  const res = await fetch(buildUrl(`/api/blog/${slug}`, options));
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to load post");
  }
  return (await res.json()) as BlogPost;
}
