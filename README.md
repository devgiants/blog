# devGiants

Personal static site built with Astro and Tailwind.

## What it contains

- a technical blog in Markdown
- a short bio page
- FR/EN interface routes
- RSS and sitemap feeds

## Local development

```bash
nvm use
npm install
npm run dev
```

The pinned Node version is stored in [.nvmrc](./.nvmrc) and enforced in `package.json`.

## Build

```bash
npm run build
```

The production build is written to `docs/` so it can be published directly on GitHub Pages.

## Content

- blog posts: `src/content/posts/`
- bio: `src/content/pages/bio.md`
- about page: `src/content/pages/about.*.md`

## Migration notes

This repo preserves the legacy Sculpin posts under the new Astro content structure. The old source tree is kept in the repository for reference, but the new site no longer depends on it.
