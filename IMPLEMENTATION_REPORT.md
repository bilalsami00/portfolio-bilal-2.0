# OpenFolio Implementation Report

## Summary

OpenFolio is a single-page portfolio template built with **Next.js 13 (Pages Router)** + **React 18** + **TypeScript** + **Tailwind CSS**. Content is driven almost entirely by root-level `config.ts`. Local setup uses **npm** (`npm install` / `npm run dev`).

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js `13.1.6` (Pages Router) |
| UI | React `18.2.0` |
| Language | TypeScript `4.9.x` |
| Styling | Tailwind CSS 3 + CSS modules + `animate.css` + Swiper CSS |
| Forms | Formik |
| Icons | Font Awesome 6 (`@fortawesome/*`) + custom SVG components |
| Carousel | Swiper 8 |
| Typing effect | `react-typed` |
| Lint | ESLint (Airbnb + Prettier + Next) + Husky pre-commit |

## Folder structure

```
OpenFolio-main/
├── pages/                 # Next.js routes
│   ├── _app.tsx           # Global styles, FA library, Nav
│   ├── index.tsx          # Single portfolio page (all sections)
│   └── api/hello.ts       # Sample API route
├── components/            # Section + shared UI
│   ├── introduction/      # Hero
│   ├── about/
│   ├── portfolio/         # Projects + carousel + modal
│   ├── experience/        # Timeline resume
│   ├── contact/
│   ├── footer/
│   ├── nav/
│   ├── buttons/, Image/, svgs/, shapes, container
├── config.ts              # All portfolio content / section toggles
├── config.types.ts        # TypeScript contracts for config
├── theme.json             # Tailwind theme extension (primary palette)
├── styles/                # globals.css + module CSS + timeline.css
├── utilities/paths.ts     # In-page hash routes (#home, #about, …)
├── hooks/useScrollPosition.ts
├── public/assets/         # Images, fonts, favicon
├── extras/avatar.psd
└── .github/workflows/ci.yml
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Full portfolio (one page) |
| `/api/hello` | Demo JSON API |
| `/#home`, `/#about`, `/#experience`, `/#portfolio`, `/#contact` | Section anchors (nav) |

There is **no App Router** (`app/`). README mentions `/app` in places; that is outdated relative to this codebase.

## Data / configuration

- **`config.ts`**: exports `introSection`, `aboutSection`, `portfolioSection`, `experienceSection`, `contactSection`, `footerSection`, `generalInfo`, `socialMedia`.
- Each section has a `display: boolean` flag used by `pages/index.tsx` to show/hide sections.
- **`config.types.ts`**: strongly typed shapes for those exports.
- Images live under `public/assets/images/` and are referenced as absolute public paths (e.g. `/assets/images/hacker.jpg`).

## Styling system

- Tailwind via `tailwind.config.js` → extends `theme.json` (screens + `primary` teal scale `#00BFA6`).
- Global base in `styles/globals.css` (`@tailwind`, custom font-face JosefinSans, Swiper theming, tooltips).
- Section-specific: `header.module.css`, `portfolio.module.css`, `shapes.module.css`, `timeline.css`.
- Utility animations from `animate.css`.

## Deployment

- **Primary**: Vercel (live demo `openfolio.vercel.app`); Next.js auto-detect.
- **Static export script**: `npm run export` → `next build && next export -o docs` (GitHub Pages-style `docs/` output). Note: `next export` is legacy on newer Next versions; this project still uses 13.1.6 where it works.
- **CI**: `.github/workflows/ci.yml` runs `npm i` + `npm run lint` on Node 14.

## Important files

| File | Why it matters |
| --- | --- |
| `config.ts` / `config.types.ts` | Nearly all content customization |
| `pages/index.tsx` | Composes sections from config flags |
| `pages/_app.tsx` | Global CSS, Font Awesome packs, site nav |
| `utilities/paths.ts` | Nav hash links |
| `theme.json` | Brand color tokens for Tailwind |
| `package.json` | Scripts + dependency versions |

## Local setup notes (this environment)

- Package manager: **npm** (no `package-lock.json` originally; `bun.lockb` present but Bun not installed).
- Node: v22.15.0 / npm 10.9.2.
- Install issues fixed:
  1. Pinned `react-dom` to `18.2.0` to match `react` (avoid peer conflict with 18.3.x).
  2. Added `.npmrc` with `legacy-peer-deps=true` because `react-typed@1.2.0` declares React 16 peers.
- Port **3000** was already occupied by another Node process; OpenFolio started on **3001**.
- Console shows Font Awesome `"Could not find icon"` warnings (pre-existing library/registration issue under Next bundling). Page still renders content successfully; custom SVG skill icons still work.

## Run command

```bash
npm install
npm run dev
```

Then open the URL Next prints (typically `http://localhost:3000`, or the next free port such as `3001`).
