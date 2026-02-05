import HomeClient from "./home-client";
import { getAllBlogPosts } from "../lib/blog-client";

export default async function Home() {
  const posts = await getAllBlogPosts();
  const recentPosts = posts.slice(0, 3);

  return <HomeClient recentPosts={recentPosts} />;
}
