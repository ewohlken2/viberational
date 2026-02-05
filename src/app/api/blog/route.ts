import { NextResponse } from "next/server";
import { loadAllPosts } from "../../../lib/blog-loader";

export async function GET() {
  try {
    const posts = loadAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load posts" },
      { status: 500 },
    );
  }
}
