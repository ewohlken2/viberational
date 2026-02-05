export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  image?: string;
}

import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src", "app", "data", "blog-posts");

let cachedPosts: BlogPost[] | null = null;

function loadPosts(): BlogPost[] {
  const files = fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".md"));

  return files.map((file) => {
    const filePath = path.join(postsDir, file);
    const fileSlug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    const slug = (data.slug as string | undefined) ?? fileSlug;
    if (slug !== fileSlug) {
      throw new Error(
        `Blog post slug mismatch: ${fileSlug} vs ${slug} in ${file}`,
      );
    }

    if (!data.title || !data.date) {
      throw new Error(`Blog post missing title or date: ${file}`);
    }

    return {
      slug,
      title: data.title as string,
      date: data.date as string,
      image: data.image as string | undefined,
      content: content.trim(),
    };
  });
}

export function getAllPosts(): BlogPost[] {
  if (!cachedPosts) {
    cachedPosts = loadPosts();
  }

  return cachedPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getRecentPosts(count: number): BlogPost[] {
  return getAllPosts().slice(0, count);
}
