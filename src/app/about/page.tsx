import AboutClient from "./about-client";
import { getAllBlogPosts } from "../../lib/blog-client";

export default async function Home() {
  const posts = await getAllBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return <AboutClient recentPosts={recentPosts} />;
}
