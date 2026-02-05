# Blog Markdown + File-Based Posts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Render full Markdown in blog posts and move each post into its own file with frontmatter.

**Architecture:** Use `gray-matter` to parse frontmatter from Markdown files under `src/app/data/blog-posts/`, and `markdown-it` to render post content. Keep the existing `getAllPosts`/`getPostBySlug` API and update the blog page to render Markdown directly.

**Tech Stack:** Next.js App Router, TypeScript, `gray-matter`, `react-markdown`, `remark-gfm`, Jest.

### Task 1: Add Markdown rendering test

**Files:**
- Create: `src/app/__tests__/blog-markdown.test.tsx`

**Step 1: Write the failing test**

```typescript
import { render } from "@testing-library/react";
import React from "react";
import Markdown from "../blog/markdown";

describe("Blog Markdown", () => {
  test("renders headings", () => {
    const { container } = render(<Markdown content="# Title\n\n## Subtitle" />);

    expect(container.querySelector("h1")?.textContent).toBe("Title");
    expect(container.querySelector("h2")?.textContent).toBe("Subtitle");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/blog-markdown.test.tsx`
Expected: FAIL because `Markdown` component does not exist.

**Step 3: Write minimal implementation**

Implementation happens in Task 2.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/blog-markdown.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/__tests__/blog-markdown.test.tsx

git commit -m "test: add markdown render test"
```

### Task 2: Add Markdown renderer component

**Files:**
- Create: `src/app/blog/markdown.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Write the failing test**

Covered in Task 1.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/blog-markdown.test.tsx`
Expected: FAIL.

**Step 3: Write minimal implementation**

```typescript
// src/app/blog/markdown.tsx
import React from "react";
import MarkdownIt from "markdown-it";

interface MarkdownProps {
  content: string;
}

export default function Markdown({ content }: MarkdownProps) {
  const md = new MarkdownIt({ html: false, linkify: true, breaks: false });
  const html = md.render(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

```typescript
// src/app/blog/[slug]/page.tsx
import Markdown from "../markdown";

// Replace the custom parse/render logic with:
<div className="blog-post-content">
  <Markdown content={post.content} />
</div>
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/blog-markdown.test.tsx`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/blog/markdown.tsx src/app/blog/[slug]/page.tsx

git commit -m "feat: render blog posts with markdown"
```

### Task 3: Move posts to individual Markdown files and add loader

**Files:**
- Create: `src/app/data/blog-posts/`
- Create: `src/app/data/blog-posts/<slug>.md` (one per existing post)
- Modify: `src/app/data/blog.ts`
- Test: `src/app/__tests__/blog-data.test.ts`

**Step 1: Write the failing test**

```typescript
import { getAllPosts, getPostBySlug } from "../data/blog";

describe("Blog data loader", () => {
  test("loads posts from markdown files", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
    expect(posts[0].slug).toBeDefined();
  });

  test("returns a post by slug", () => {
    const post = getPostBySlug("moltbook-weird-posts-and-security");
    expect(post?.title).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/blog-data.test.ts`
Expected: FAIL if loader not updated.

**Step 3: Write minimal implementation**

```typescript
// src/app/data/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "src", "app", "data", "blog-posts");

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDir).filter((file) => file.endsWith(".md"));
  const posts = files.map((file) => {
    const filePath = path.join(postsDir, file);
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    return {
      slug: data.slug as string,
      title: data.title as string,
      date: data.date as string,
      image: data.image as string | undefined,
      content: content.trim(),
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
```

Each markdown file should include frontmatter:

```markdown
---
slug: moltbook-weird-posts-and-security
title: Moltbook, Weird Posts, and a Security Wake-Up Call
date: 2026-02-04
image: /path/to/image.png
---

## The weird posts
...
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/blog-data.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/data/blog.ts src/app/data/blog-posts src/app/__tests__/blog-data.test.ts

git commit -m "feat: load blog posts from markdown files"
```

### Task 4: Update dependencies

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Step 1: Write the failing test**

Covered by previous tasks (module imports).

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/blog-markdown.test.tsx`
Expected: FAIL until deps are installed.

**Step 3: Write minimal implementation**

Install:

```bash
npm install markdown-it gray-matter
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/blog-markdown.test.tsx`
Expected: PASS (once renderer exists).

**Step 5: Commit**

```bash
git add package.json package-lock.json

git commit -m "chore: add markdown dependencies"
```
```
