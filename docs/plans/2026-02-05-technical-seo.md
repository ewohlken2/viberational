# Technical SEO Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add technical SEO fundamentals (metadata defaults, canonical URLs, sitemap, robots, and blog JSON-LD) for elviswohlken.com.

**Architecture:** Use Next.js App Router metadata APIs in `layout.tsx` and per-route `generateMetadata`, plus `sitemap.ts` and `robots.ts` route exports. Blog posts get JSON-LD embedded in the page for structured data.

**Tech Stack:** Next.js App Router, TypeScript, Jest.

### Task 1: Add SEO route tests (sitemap, robots, blog metadata)

**Files:**
- Create: `src/app/__tests__/seo.test.ts`

**Step 1: Write the failing test**

```typescript
import sitemap from "../sitemap";
import robots from "../robots";
import { generateMetadata as generateBlogMetadata } from "../blog/[slug]/page";

const baseUrl = "https://elviswohlken.com";

describe("SEO routes", () => {
  test("sitemap includes blog routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${baseUrl}/`);
    expect(urls).toContain(`${baseUrl}/blog`);
    expect(urls.some((url) => url.startsWith(`${baseUrl}/blog/`))).toBe(true);
  });

  test("robots points to sitemap", async () => {
    const rules = await robots();
    const sitemapUrl = rules.sitemap as string;

    expect(sitemapUrl).toBe(`${baseUrl}/sitemap.xml`);
  });

  test("blog metadata includes canonical + openGraph", async () => {
    const metadata = await generateBlogMetadata({
      params: Promise.resolve({ slug: "moltbook-weird-posts-and-security" }),
    });

    expect(metadata.alternates?.canonical).toBe(
      `${baseUrl}/blog/moltbook-weird-posts-and-security`
    );
    expect(metadata.openGraph?.type).toBe("article");
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/seo.test.ts`
Expected: FAIL due to missing exports in `sitemap.ts`/`robots.ts` and missing metadata fields.

**Step 3: Write minimal implementation**

Implementation will be done in Tasks 2 and 3.

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/seo.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/__tests__/seo.test.ts

git commit -m "test: add seo route tests"
```

### Task 2: Add sitemap and robots routes

**Files:**
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Step 1: Write the failing test**

Covered in Task 1.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/seo.test.ts`
Expected: FAIL because `sitemap` and `robots` are missing.

**Step 3: Write minimal implementation**

```typescript
// src/app/sitemap.ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "./data/blog";

const baseUrl = "https://elviswohlken.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: now,
    },
  ];

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [...staticRoutes, ...blogRoutes];
}
```

```typescript
// src/app/robots.ts
import type { MetadataRoute } from "next";

const baseUrl = "https://elviswohlken.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/seo.test.ts`
Expected: PASS (pending Task 3).

**Step 5: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts

git commit -m "feat: add sitemap and robots routes"
```

### Task 3: Update metadata defaults, blog metadata, and JSON-LD

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/blog/page.tsx`
- Modify: `src/app/blog/[slug]/page.tsx`

**Step 1: Write the failing test**

Covered in Task 1.

**Step 2: Run test to verify it fails**

Run: `npm test -- src/app/__tests__/seo.test.ts`
Expected: FAIL because blog metadata lacks canonical and `openGraph.type`.

**Step 3: Write minimal implementation**

```typescript
// src/app/layout.tsx
import type { Metadata } from "next";

const baseUrl = new URL("https://elviswohlken.com");

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Elvis Wohlken",
    template: "%s | Elvis Wohlken",
  },
  description: "Let's build something together.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Elvis Wohlken",
    title: "Elvis Wohlken",
    description: "Let's build something together.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elvis Wohlken",
    description: "Let's build something together.",
  },
};
```

```typescript
// src/app/blog/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on web development, AI, and more.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog",
    description: "Thoughts on web development, AI, and more.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog",
    description: "Thoughts on web development, AI, and more.",
  },
};
```

```typescript
// src/app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

const baseUrl = "https://elviswohlken.com";

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const description = post.content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);

  const url = `${baseUrl}/blog/${post.slug}`;

  return {
    title: post.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description,
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  };
}

// Inside BlogPostPage render:
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.title,
  datePublished: post.date,
  dateModified: post.date,
  author: {
    "@type": "Person",
    name: "Elvis Wohlken",
  },
  mainEntityOfPage: `${baseUrl}/blog/${post.slug}`,
  image: post.image ? [`${baseUrl}${post.image}`] : undefined,
};

<Script
  id="blog-jsonld"
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

**Step 4: Run test to verify it passes**

Run: `npm test -- src/app/__tests__/seo.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/blog/page.tsx src/app/blog/[slug]/page.tsx

git commit -m "feat: add technical seo metadata"
```

