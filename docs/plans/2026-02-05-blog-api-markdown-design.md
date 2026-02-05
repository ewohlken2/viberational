# Blog API + Client Design

## Goal
Move blog data access behind server API routes and consume it through a blog client in the frontend, so Node-only modules (`fs`, `path`, `gray-matter`) never enter the client bundle. Keep Markdown files as the source of truth.

## Architecture
- Source of truth: Markdown files under `src/app/data/blog-posts/*.md` with frontmatter fields `slug`, `title`, `date`, optional `image`.
- Server-only loader: a shared module (e.g. `src/lib/blog-loader.ts`) reads Markdown files, parses frontmatter, and returns `BlogPost` objects. This module is used only by API routes.
- API routes:
  - `GET /api/blog`: returns an array of posts, sorted by date descending.
  - `GET /api/blog/[slug]`: returns a single post by slug, or `404` when missing.
- Client wrapper: `src/lib/blog-client.ts` exports `getAllBlogPosts()` and `getBlogPost(slug)` implemented with `fetch` against the API.
- UI components use the client and must not import server-only loader or `fs`-based modules.

## Data Flow
UI -> blog client -> API route -> loader -> Markdown files

## Error Handling
- Loader throws on invalid frontmatter (missing `slug`, `title`, or `date`) with descriptive errors.
- API routes:
  - Return `404` JSON for missing slug.
  - Return `500` JSON for unexpected errors.
- Blog client:
  - `getBlogPost(slug)` returns `null` on `404`, throws on other errors.
  - `getAllBlogPosts()` throws on non-OK responses.

## Caching
Default Next.js `fetch` caching is acceptable. If needed later:
- Production: `revalidate: 60`
- Development: `cache: "no-store"`

## Testing
- Loader tests (unit): verify parsing, required fields, and date sorting.
- Client tests: mock `fetch` to verify `200/404/500` handling.
- API tests optional if the repo test setup supports route testing.

## Migration Notes
- Move existing loader logic out of `src/app/data/blog.ts` into a server-only module.
- Create API routes in `src/app/api/blog`.
- Update UI components to use blog client, and remove any direct imports of loader/`fs`.

