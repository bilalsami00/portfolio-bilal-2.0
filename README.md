# Bilal Sami — Frontend Developer Portfolio

The personal portfolio of **Muhammad Bilal Sami**, a Frontend Developer at Maze Digital in Karachi. A multi-page Next.js site that presents his profile, frontend case studies, and a way to get in touch.

[![Next.js](https://img.shields.io/badge/Next.js-13.1.6-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel&logoColor=white)](https://bilalsami.vercel.app)

**Live site:** [bilalsami.vercel.app](https://bilalsami.vercel.app)

---

## Overview

This is the source code of Bilal Sami's portfolio. Visitors can:

- read a short professional profile, current focus, experience timeline, and education;
- browse ten frontend case studies from Maze Digital projects, each with technologies, screenshots, and live or repository links where available;
- contact him through a validated form, email, phone, WhatsApp, LinkedIn, or GitHub.

The content is deliberately conservative: case studies describe the product rather than claiming sole ownership of every feature, and no testimonials or metrics are shown unless they are verified.

## Key Features

- **Multi-page site** — Home, Projects, About, Contact, and a custom 404 page served with a real HTTP 404 status.
- **Dark and light themes** — a dark "ink" theme by default and a teal light theme, saved in `localStorage` and applied before first paint so there is no colour flash.
- **Project showcase** — category filters, a featured spotlight, and a card grid for the case studies.
- **Case-study modal** — overview, problem and solution, features, challenges, lessons learned, and technologies.
- **Screenshot gallery and lightbox** — thumbnails, a full-screen viewer with stepped zoom (up to 16×), keyboard controls, swipe on touch screens, and focus management.
- **Contact form** — Formik + Zod validation shared by browser and server, a honeypot field, rate limiting, storage in Cloud Firestore, and an optional email notification.
- **Keyboard shortcuts** — press `G` then `H` / `A` / `P` / `C` to jump between pages, and `?` for help.
- **Smooth scrolling** — Lenis inertia scrolling on most public pages, disabled for users who prefer reduced motion.
- **Accessible navigation** — skip link, a mobile menu that traps focus and closes with `Esc`, and reduced-motion support throughout.
- **Search metadata** — per-page titles and descriptions, canonical URLs, Open Graph and Twitter cards, and `robots.txt`.
- **Mission Control** — a private admin area with Firebase sign-in, an admin whitelist enforced by Firestore security rules, a realtime contact inbox, privacy-conscious visitor sessions, CSV export, and bulk delete.
- **Optimised screenshots** — project screenshots are pre-converted into responsive WebP variants by scripts in `scripts/`.

## Technology Stack

| Area | Technologies |
| --- | --- |
| Framework | Next.js 13.1.6 (Pages Router, static pre-rendering, API routes), React 18.2 |
| Language | TypeScript 4.9 (`strict` mode) |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer, CSS variables, self-hosted variable fonts |
| Interaction | Lenis (smooth scrolling), CSS transitions and keyframes, IntersectionObserver |
| Icons | Font Awesome (free brands and solid), local SVG technology logos |
| Forms and validation | Formik, Zod |
| Backend and data | Next.js API routes, Firebase Admin SDK, Cloud Firestore, Firebase Authentication, Nodemailer (SMTP) |
| Tooling | ESLint (Airbnb, Next.js, TypeScript configs), Prettier, Husky pre-commit hook, GitHub Actions lint check |
| Hosting | Vercel |

## Pages at a Glance

| Route | What it shows |
| --- | --- |
| `/` | Hero, current focus, about preview, capabilities, featured projects, skills, experience timeline, education, interests |
| `/projects` | Filters, spotlight project, full case-study archive with modal and gallery |
| `/about` | Full profile: experience, education, skills, working principles, languages |
| `/contact` | Contact details, availability, message form, FAQ |
| `/mission-control` | Admin sign-in (hidden from navigation and search engines) |

Screenshots of the portfolio itself are not stored in this repository; the [live site](https://bilalsami.vercel.app) is the best preview.

## Project Structure

```text
├── pages/              Routes (Pages Router) and API routes in pages/api/
├── components/         UI: layout, nav, footer, home sections, projects, shared, admin
├── data/               Site content as typed TypeScript (profile, projects, skills, socials)
├── utilities/          Helpers, Zod schemas, Firebase client
├── hooks/              Custom React hooks
├── server/             Server-only modules used by API routes (Firebase Admin, email)
├── styles/             globals.css (themes, components) and CSS modules
├── public/             Fonts, images, technology icons, project screenshots, robots.txt
├── scripts/            Screenshot optimisation and verification scripts
├── documentation/      Mission Control setup guide
├── firestore.rules     Firestore security rules
└── theme.json          Tailwind design tokens (colours, breakpoints, fonts)
```

## Getting Started

**Requirements:** Node.js (a current LTS release is recommended) and npm.

```bash
git clone https://github.com/bilalsami00/portfolio-bilal-2.0.git
cd portfolio-bilal-2.0
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The public pages work without any configuration. To enable the contact form, visitor tracking, and Mission Control, copy `.env.example` to `.env.local` and fill in your own Firebase and SMTP values. Never commit real secrets; `.env.local` is git-ignored.

### Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build (also runs ESLint and type checks) |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run lint:fix` | ESLint with automatic fixes |
| `npx tsc --noEmit` | Type check without building |

Project screenshot tools (they use [sharp](https://sharp.pixelplumbing.com/) through `npx`, so it is not a dependency):

```bash
npx --yes --package=sharp@0.33 node scripts/optimize-project-images.js
npx --yes --package=sharp@0.33 node scripts/build-project-galleries.js
node scripts/verify-project-galleries.js
```

## Customising Content

Almost all visible text lives in `data/`:

- `data/site.ts` — name, title, introduction, contact details, SEO defaults, and About page content
- `data/projects.ts` — project case studies, links, categories, and featured flags
- `data/skills.ts` and `data/skillIconRegistry.ts` — skill groups and their icons
- `data/experience.ts` / `data/education.ts` — timeline entries
- `data/services.ts`, `data/interests.ts`, `data/faq.ts` — capabilities, interests, and contact FAQ
- `data/socials.ts` — social and contact links
- `data/navigation.ts` — navigation items and route paths

Keep the content factual: do not invent employment, clients, testimonials, or metrics.

## Mission Control

Firebase setup, environment variables, Firestore rules, the API routes, and troubleshooting are documented in [`documentation/mission-control.md`](documentation/mission-control.md).

## Deployment

The site is deployed on [Vercel](https://vercel.com/) from this repository. Pages are pre-rendered at build time and the API routes run as serverless functions, so the project needs a host that runs Next.js server code; a static export is not supported.

When deploying your own copy:

1. Import the repository into Vercel (the Next.js defaults work as-is).
2. Add the variables from `.env.example` under **Project → Settings → Environment Variables**, then redeploy. `NEXT_PUBLIC_*` values are baked in at build time.
3. Deploy `firestore.rules` separately with the Firebase CLI (`npx firebase-tools deploy --only firestore:rules`) or paste them into the Firebase Console.

## Acknowledgements

- The project began from the open-source **OpenFolio** Next.js portfolio template and has since been substantially rebuilt and rebranded.
- Fonts: League Spartan, Josefin Sans, and Raleway (self-hosted).
- Icons: [Font Awesome Free](https://fontawesome.com/) and brand logos from [Simple Icons](https://simpleicons.org/).
- Smooth scrolling by [Lenis](https://github.com/darkroomengineering/lenis).

## Contact

- **Email:** [muhammadbilalsami2000@gmail.com](mailto:muhammadbilalsami2000@gmail.com)
- **LinkedIn:** [linkedin.com/in/bilal-sami-9b027b240](https://www.linkedin.com/in/bilal-sami-9b027b240/)
- **GitHub:** [github.com/bilalsami00](https://github.com/bilalsami00)
- **Portfolio:** [bilalsami.vercel.app](https://bilalsami.vercel.app)

## License

Private personal portfolio unless otherwise stated by the repository owner.
