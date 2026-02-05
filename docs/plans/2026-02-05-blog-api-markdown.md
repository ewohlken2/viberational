# Blog API + Client Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Serve blog data via API routes and consume it through a blog client, keeping filesystem access server-only.

**Architecture:** Move Markdown parsing into a server-only loader used by API routes under `src/app/api/blog`. Create a blog client in `src/lib/blog-client.ts` that fetches from these routes. Update UI to use the blog client and remove any direct `fs` usage from client-bound code.

**Tech Stack:** Next.js App Router, TypeScript, `gray-matter`, `markdown-it`, Jest.

### Task 1: Add blog client tests

**Files:**
- Create: `src/lib/__tests__/blog-client.test.ts`

**Step 1: Write the failing test**

```typescript
import { getAllBlogPosts, getBlogPost } from "../blog-client";

describe("blog-client", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("getAllBlogPosts returns data on 200", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [{ slug: "test" }],
    });

    const posts = await getAllBlogPosts();

    expect(posts[0].slug).toBe("test");
  });

  test("getBlogPost returns null on 404", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: "Not found" }),
    });

    const post = await getBlogPost("missing");

    expect(post).toBeNull();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/blog-client.test.ts`
Expected: FAIL because `blog-client` does not exist.

**Step 3: Write minimal implementation**

Implementation happens in Task 3.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/blog-client.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/__tests__/blog-client.test.ts

git commit -m "test: add blog client tests"
```

### Task 2: Add server-only loader tests

**Files:**
- Create: `src/lib/__tests__/blog-loader.test.ts`

**Step 1: Write the failing test**

```typescript
import { loadAllPosts, loadPostBySlug } from "../blog-loader";

describe("blog-loader", () => {
  test("loads posts from markdown files", () => {
    const posts = loadAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].slug).toBeDefined();
  });

  test("loads a post by slug", () => {
    const post = loadPostBySlug("moltbook-weird-posts-and-security");
    expect(post?.title).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/blog-loader.test.ts`
Expected: FAIL because `blog-loader` does not exist.

**Step 3: Write minimal implementation**

Implementation happens in Task 3.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/blog-loader.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/__tests__/blog-loader.test.ts

git commit -m "test: add blog loader tests"
```

### Task 3: Add shared types, server loader, and API routes

**Files:**
- Create: `src/lib/blog-types.ts`
- Create: `src/lib/blog-loader.ts`
- Create: `src/app/api/blog/route.ts`
- Create: `src/app/api/blog/[slug]/route.ts`
- Modify: `src/app/data/blog.ts` (remove or replace with re-exports if needed)

**Step 1: Write the failing test**

Covered by Tasks 1–2.

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/lib/__tests__/blog-client.test.ts src/lib/__tests__/blog-loader.test.ts`
Expected: FAIL because modules do not exist.

**Step 3: Write minimal implementation**

```typescript
// src/lib/blog-types.ts
export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  image?: string;
}
```

```typescript
// src/lib/blog-loader.ts
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
      throw new Error(`Blog post slug mismatch: ${fileSlug} vs ${slug} in ${file}`);
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

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function loadPostBySlug(slug: string): BlogPost | null {
  return loadAllPosts().find((post) => post.slug === slug) ?? null;
}
```

```typescript
// src/app/api/blog/route.ts
import { NextResponse } from "next/server";
import { loadAllPosts } from "../../../lib/blog-loader";

export async function GET() {
  try {
    const posts = loadAllPosts();
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}
```

```typescript
// src/app/api/blog/[slug]/route.ts
import { NextResponse } from "next/server";
import { loadPostBySlug } from "../../../../lib/blog-loader";

interface RouteParams {
  params: { slug: string };
}

export async function GET(_: Request, { params }: RouteParams) {
  try {
    const post = loadPostBySlug(params.slug);

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load post" }, { status: 500 });
  }
}
```

If `src/app/data/blog.ts` is still referenced by UI, replace its contents with re-exports or remove it and update imports to use `src/lib/blog-types` or `src/lib/blog-client`.

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/lib/__tests__/blog-client.test.ts src/lib/__tests__/blog-loader.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/blog-types.ts src/lib/blog-loader.ts src/app/api/blog/route.ts src/app/api/blog/[slug]/route.ts src/app/data/blog.ts

git commit -m "feat: add blog loader and api routes"
```

### Task 4: Add blog client implementation

**Files:**
- Create: `src/lib/blog-client.ts`
- Modify: `src/lib/__tests__/blog-client.test.ts`

**Step 1: Write the failing test**

Covered in Task 1.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/blog-client.test.ts`
Expected: FAIL.

**Step 3: Write minimal implementation**

```typescript
// src/lib/blog-client.ts
import type { BlogPost } from "./blog-types";

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch("/api/blog");
  if (!res.ok) {
    throw new Error("Failed to load posts");
  }
  return (await res.json()) as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`/api/blog/${slug}`);
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to load post");
  }
  return (await res.json()) as BlogPost;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/blog-client.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/lib/blog-client.ts src/lib/__tests__/blog-client.test.ts

git commit -m "feat: add blog client"
```

### Task 5: Update UI to use blog client

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/blog-feed.tsx`
- Modify: `src/app/blog-card.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/home-client.tsx` (if present)

**Step 1: Write the failing test**

Add a small UI test to ensure `BlogFeed` renders provided posts instead of importing server modules.

```typescript
// src/app/__tests__/blog-feed.test.tsx
import { render } from "@testing-library/react";
import React from "react";
import BlogFeed from "../blog-feed";
import type { BlogPost } from "../../lib/blog-types";

describe("BlogFeed", () => {
  test("renders provided posts", () => {
    const posts: BlogPost[] = [
      {
        slug: "test-post",
        title: "Test Post",
        date: "2026-02-01",
        content: "Test content",
      },
    ];

    const { getByText } = render(<BlogFeed posts={posts} />);

    expect(getByText("Test Post")).toBeInTheDocument();
    expect(getByText("View all posts")).toBeInTheDocument();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/blog-feed.test.tsx`
Expected: FAIL if `BlogFeed` still pulls data internally.

**Step 3: Write minimal implementation**

- Update `BlogFeed` to accept a `posts` prop and remove any data loading inside.
- Update `page.tsx` to fetch posts via `getAllBlogPosts()` or `getBlogPost()` using the blog client and pass them to client components.
- Ensure `BlogCard` imports `BlogPost` type from `src/lib/blog-types`.
- Update the blog slug page to fetch via the blog client and render content.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/blog-feed.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/page.tsx src/app/blog-feed.tsx src/app/blog-card.tsx src/app/blog/[slug]/page.tsx src/app/home-client.tsx src/app/__tests__/blog-feed.test.tsx

git commit -m "feat: wire ui to blog client"
```

### Task 6: Final verification

**Step 1: Run full test suite**

Run: `npm test`
Expected: PASS all tests.

**Step 2: Commit (if any changes)**

```bash
git add -A

git commit -m "test: verify blog api integration"
```
