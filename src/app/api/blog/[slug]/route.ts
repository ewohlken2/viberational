import { NextResponse } from "next/server";
import { loadPostBySlug } from "../../../../lib/blog-loader";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const post = loadPostBySlug(slug);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load post" },
      { status: 500 },
    );
  }
}
