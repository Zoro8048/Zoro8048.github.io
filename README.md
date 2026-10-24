# Keerthan Nandigama | Personal Portfolio

Live site: **[keerthan.me](https://keerthan.me)**

Source repository for the personal portfolio of **Keerthan Nandigama**, Software Development Engineer II (SDE II) at **Amazon** in Seattle, WA (M.S. in Computer Engineering, **Stony Brook University**; B.Tech in Computer Science & Engineering, **NIT Durgapur**).

---

## Tech Stack & Architecture

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Static Export to `out/`)
- **UI & Styling:** [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/), [Tailwind CSS 3](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
- **Typography:** `Plus Jakarta Sans` & `JetBrains Mono` via `next/font/google`
- **Features:**
  - Asymmetric 12-column Bento Grid hero and split-rail experience ledger
  - Interactive `⌘K` / `Ctrl+K` Quick Navigation command palette (`src/components/CommandPalette.tsx`)
  - Dark / Light theme switcher (`Obsidian Slate` & `Warm Alabaster`) persisted in `localStorage`
  - Static SEO generation (`/sitemap.xml`, `/robots.txt`, OpenGraph metadata, and Schema.org `Person` JSON-LD)
- **Deployment:** Netlify static hosting (`netlify.toml`, Node 20, publishing `out/`)

---

## Local Development

```bash
# Install dependencies
yarn install

# Start the local development server at http://localhost:3000
yarn dev
```

## Lint & Production Build

```bash
# Run ESLint checks
yarn lint

# Build the static site (outputs to ./out)
yarn build
```

---

## Content Maintenance Guide

All portfolio sections are modular components under `src/components/`:

| Section | File | What to Update |
| :--- | :--- | :--- |
| **Hero & Bento Highlights** | `src/components/Hero.tsx` | Headline, current role spotlight card, and top highlight cards |
| **Work Experience** | `src/components/Experience.tsx` | `experiences` array (full-time roles, internships, tenure, and tech tags) |
| **Awards & Impact** | `src/components/Achievements.tsx` | `achievements` array (awards, metric badges, and descriptions) |
| **Skills & Tech Stack** | `src/components/Skills.tsx` | `skillCategories` array (grouped by domain with `core: true` highlights) |
| **About & Value Pillars** | `src/components/About.tsx` | Narrative bio and `valuePillars` cards |
| **Education** | `src/components/Education.tsx` | `education` array and university logos in `public/images/` |
| **Contact & Links** | `src/components/Contact.tsx` | LinkedIn, GitHub, Resume doc link, and embedded Tally form |
| **Command Palette (`⌘K`)** | `src/components/CommandPalette.tsx` | Quick-jump navigation items and external links |
| **SEO & Metadata** | `src/app/layout.tsx` & `src/lib/site.ts` | Canonical domain, page title/description, and JSON-LD `Person` schema |
