import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "./blog-types";

const postsDir = path.join(process.cwd(), "src", "app", "data", "blog-posts");

export function loadAllPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));

  const posts = files.map((file) => {
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
    } satisfies BlogPost;
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function loadPostBySlug(slug: string): BlogPost | null {
  return loadAllPosts().find((post) => post.slug === slug) ?? null;
}
