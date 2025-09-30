# Copilot Instructions for AI Coding Agents

## Project Overview
- This is a Next.js app (bootstrapped with `create-next-app`) using the `/src/app` directory for main application code.
- Tailwind CSS is used for styling (see `tailwind.config.js`, `postcss.config.mjs`, and global styles in `src/app/globals.css`).
- Fonts are managed in `src/app/fonts/` and loaded via Next.js font optimization.
- Public assets (SVGs, images, videos) are in `public/`.

## Key Files & Structure
- Main entry: `src/app/page.js` (edit to change homepage)
- Layout: `src/app/layout.js` (shared layout for all pages)
- Components: `src/app/header.js`, `src/app/hero.js`, `src/app/button.js`, `src/app/directional-hover.js`
- API routes: `src/app/api/route.js` and nested routes (e.g., `src/app/api/contact/route.js`)
- Contact page: `src/app/contact/page.js` (with its own CSS and API folder)

## Developer Workflows
- **Start dev server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`)
- **Build for production:** `npm run build`
- **Preview production build:** `npm run start`
- **Tailwind CSS:** Edit `src/app/globals.css` and use utility classes in components.
- **Font usage:** Reference fonts from `src/app/fonts/` in CSS or Next.js font loader.

## Patterns & Conventions
- Use React functional components for all UI elements.
- API routes are colocated under `src/app/api/` and follow Next.js route handler conventions.
- Page-specific styles are placed in the same folder as the page (e.g., `contact.css` in `contact/`).
- Prefer using Next.js built-in features (routing, font optimization, image handling).
- Use Tailwind utility classes for styling, avoid custom CSS unless necessary.

## Integration Points
- No custom server or database integration detected; all data flows are via Next.js API routes.
- External assets (fonts, SVGs, images) are loaded from `public/` or `src/app/fonts/`.

## Examples
- To add a new page: create a folder in `src/app/` with `page.js` and optional `layout.js`.
- To add an API endpoint: create a folder/file under `src/app/api/` with `route.js`.
- To use a font: import from `src/app/fonts/` and reference in CSS or Next.js font loader.

## References
- See `README.md` for basic setup and deployment instructions.
- See Next.js docs for advanced features: https://nextjs.org/docs

---
_If any conventions or workflows are unclear, please request clarification or examples from the user._
