export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  image?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "update-claude-md-after-every-pr",
    title: "Update Your claude.md After Every PR Merge",
    date: "2026-01-12",
    content: `If you're using Claude Code or any AI assistant with your codebase, there's a simple habit that will dramatically improve your experience over time: update your claude.md file after every PR merge.

**What is claude.md?**

The claude.md file (sometimes called CLAUDE.md) lives in your project root and contains project-specific instructions for AI assistants. It's like a README, but specifically for Claude. It tells the AI about your codebase's conventions, architecture decisions, and preferences.

**Why update it after every PR?**

Each PR represents new knowledge about your project. Maybe you:

- Established a new pattern for handling errors
- Added a new utility function that should be reused
- Made an architectural decision that affects future development
- Fixed a tricky bug with context worth preserving

Without documenting these, you'll find yourself re-explaining the same things to Claude repeatedly. Your repo should learn as it grows.

**What to add**

After merging a PR, ask yourself: "What did I learn or decide that Claude should know for next time?"

\`\`\`markdown
## Patterns

- Use the \`useAsync\` hook for all data fetching (added in PR #42)
- Error boundaries are in \`src/components/ErrorBoundary.tsx\`
- All API routes follow the pattern in \`src/app/api/[resource]/route.ts\`

## Decisions

- We chose Zustand over Redux for state management (simpler API)
- CSS Modules for styling, not Tailwind (team preference)
- No barrel files - import directly from source

## Gotchas

- The auth middleware must run before the rate limiter
- Don't use \`fetch\` directly - use \`src/lib/api-client.ts\`
- Tests need \`NODE_ENV=test\` or the mock server won't start
\`\`\`

**Make it a habit**

Add "Update claude.md" to your PR checklist or create a GitHub Action that reminds you. The five minutes you spend documenting will save hours of repeated explanations.

\`\`\`yaml
# .github/PULL_REQUEST_TEMPLATE.md
## Checklist
- [ ] Tests pass
- [ ] Updated claude.md with any new patterns or decisions
\`\`\`

**The compound effect**

After a few months, your claude.md becomes an invaluable knowledge base. New team members can read it to understand project conventions. And Claude becomes increasingly effective because it has context that accumulates rather than resets with each conversation.

Your repository isn't just code - it's accumulated knowledge. Make sure your AI assistant can access all of it.`,
  },
  {
    slug: "building-custom-react-hooks",
    title: "Building Custom React Hooks for Better Code Reuse",
    date: "2026-01-05",
    content: `One of the most powerful features in React is the ability to create custom hooks. They let you extract component logic into reusable functions.

Here's a simple example of a custom hook that tracks window size:

\`\`\`typescript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
\`\`\`

You can then use this hook in any component:

\`\`\`typescript
function MyComponent() {
  const { width, height } = useWindowSize();

  return (
    <div>
      Window size: {width} x {height}
    </div>
  );
}
\`\`\`

Custom hooks follow the same rules as regular hooks - they must start with "use" and can call other hooks inside them.`,
  },
  {
    slug: "nextjs-app-router-tips",
    title: "Tips for Working with Next.js App Router",
    date: "2026-01-02",
    content: `The Next.js App Router brings some great features for building modern web applications. Here are a few tips I've learned while working with it.

**Server vs Client Components**

By default, components in the App Router are Server Components. Add "use client" at the top when you need interactivity:

\`\`\`typescript
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
\`\`\`

**Dynamic Routes**

Create dynamic routes using square brackets in folder names:

\`\`\`
app/
  blog/
    [slug]/
      page.tsx
\`\`\`

Then access the param in your component:

\`\`\`typescript
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>Post: {params.slug}</h1>;
}
\`\`\`

**Static Generation**

Use generateStaticParams for static generation of dynamic routes - this pre-renders pages at build time for better performance.`,
  },
  {
    slug: "typescript-utility-types",
    title: "Useful TypeScript Utility Types You Should Know",
    date: "2025-12-28",
    content: `TypeScript comes with several built-in utility types that can make your code more expressive and type-safe.

**Partial<T>**

Makes all properties optional:

\`\`\`typescript
interface User {
  name: string;
  email: string;
  age: number;
}

function updateUser(id: string, updates: Partial<User>) {
  // updates can have any subset of User properties
}

updateUser("123", { name: "John" }); // Valid!
\`\`\`

**Pick<T, K>**

Creates a type with only selected properties:

\`\`\`typescript
type UserPreview = Pick<User, "name" | "email">;
// { name: string; email: string; }
\`\`\`

**Omit<T, K>**

Creates a type without specified properties:

\`\`\`typescript
type UserWithoutAge = Omit<User, "age">;
// { name: string; email: string; }
\`\`\`

**Record<K, V>**

Creates an object type with specified key and value types:

\`\`\`typescript
type UserRoles = Record<string, "admin" | "user" | "guest">;

const roles: UserRoles = {
  john: "admin",
  jane: "user",
};
\`\`\`

These utility types help you avoid repetition and keep your types DRY.`,
  },
];

export function getAllPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRecentPosts(count: number): BlogPost[] {
  return getAllPosts().slice(0, count);
}
