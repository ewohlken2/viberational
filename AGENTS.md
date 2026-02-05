# Blog Posts

## Where Posts Live
- All posts are stored in `src/app/data/blog.ts` as entries in the `blogPosts` array.

## Required Fields
- `slug`: Kebab-case, unique.
- `title`: Title case.
- `date`: `YYYY-MM-DD`.
- `content`: Markdown string in a template literal.
- `image` (optional): Public image path.

## Format Guidance
- Use short sections with `##` headings.
- Keep tone neutral unless the user requests otherwise.
- Avoid external links unless explicitly asked.
- Keep paragraphs readable (2–4 sentences each).

## Checklist For New Posts
- Add new post object near the top of `blogPosts`.
- Ensure `slug` matches the expected route (`/blog/[slug]`).
- Confirm the date is correct and not in the future unless requested.
- Keep Markdown consistent with existing posts.
