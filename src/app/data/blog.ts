import type { BlogPost } from "../../lib/blog-types";
import { loadAllPosts, loadPostBySlug } from "../../lib/blog-loader";

export type { BlogPost };

export function getAllPosts(): BlogPost[] {
  return loadAllPosts();
}

export function getPostBySlug(slug: string): BlogPost | null {
  return loadPostBySlug(slug);
}

export function getRecentPosts(count: number): BlogPost[] {
  return loadAllPosts().slice(0, count);
}
