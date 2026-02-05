---
slug: nextjs-app-router-tips
title: "Tips for Working with Next.js App Router"
date: 2026-01-02
---

The Next.js App Router brings some great features for building modern web applications. Here are a few tips I've learned while working with it.

**Server vs Client Components**

By default, components in the App Router are Server Components. Add "use client" at the top when you need interactivity:

```typescript
"use client";

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**Dynamic Routes**

Create dynamic routes using square brackets in folder names:

```
app/
  blog/
    [slug]/
      page.tsx
```

Then access the param in your component:

```typescript
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
```

**Static Generation**

Use generateStaticParams for static generation of dynamic routes - this pre-renders pages at build time for better performance.
