import type { PortfolioProject, ProjectCategory, ProjectImage } from "./types";

/**
 * Project records mapped from public/projects case studies.
 * Screenshot files stay in those folders and are served from /projects/...
 *
 * Not rendered: public/projects/alphaWeb has a screenshot and no case study file.
 * public/projects/alphaDash holds the Alpha Arc landing-page write-up beside a
 * chrome-extension capture, which is the only image in that folder.
 *
 * featured is a site presentation flag. The case studies do not mark featured work.
 * The three featured entries are public-facing products with complete write-ups;
 * Clarion BTC and Maze Digital are the ones with a documented live URL.
 *
 * Replaced placeholder records (no matching source folder): Nexus Operations
 * Dashboard, Signal Field Companion, Forge Desktop Toolkit, Veil Product Site,
 * Atlas Content Console, Ink Interface System.
 */

const image = (folder: string, file: string, alt: string): ProjectImage => ({
  src: `/projects/${folder}/${file}`,
  alt,
});

export const projectCategories: Array<ProjectCategory | "All"> = [
  "All",
  "Web Application",
  "Mobile Application",
  "Desktop Application",
  "Full Stack",
  "UI/UX",
  "Open Source",
];

export const projects: PortfolioProject[] = [
  {
    id: "project-maze-digital",
    slug: "maze-digital",
    title: "Maze Digital (Website)",
    shortDescription:
      "A frontend-only Next.js site for Maze Digital that presents services, industries, case studies, careers, blog, and paid-traffic landing pages, then converts visitors into sales leads.",
    year: "2026",
    category: "Web Application",
    featured: true,
    liveUrl: "https://www.mazedigital.co",
    repositoryUrl: "https://github.com/bilalsami00/complete-maze-26",
    technologies: [
      "Next.js 16",
      "React 19",
      "JavaScript",
      "Tailwind CSS 4",
      "Radix UI",
      "GSAP",
      "Motion",
      "Swiper",
      "WordPress REST API",
      "Vercel Analytics",
    ],
    image: image(
      "mazedigital.co",
      "screencapture-complete-maze-26-vercel-app-2026-10-17-21_02_12.png",
      "Maze Digital website screenshot"
    ).src,
    imageAlt: "Maze Digital website screenshot",
    gallery: [
      image(
        "mazedigital.co",
        "screencapture-complete-maze-26-vercel-app-2026-10-17-21_02_12.png",
        "Maze Digital website screenshot"
      ),
    ],
    caseStudy: {
      overview: [
        "Maze Digital’s public website is a frontend-only Next.js application that presents the agency’s services, industries, case studies, careers, blog, and paid-traffic landing pages, then converts visitors into sales leads. Intended users are prospective clients researching custom app, web, SaaS, MVP, UI/UX, AI, and CMS work, plus candidates browsing open roles. Content for most marketing pages lives in co-located static data modules composed by App Router Server Components; interactive pieces (forms, drawers, carousels, the Ask Maze assistant) are client components, many loaded through a central next/dynamic registry. There is no application database or authentication in this repository. Lead capture posts to an external CRM-connected backend, blog content is fetched from a WordPress host, and analytics (GTM, GA4, Facebook Pixel, Microsoft Clarity, LinkedIn Insight, Vercel Analytics) load after first interaction to protect page-load performance.",
      ],
      problem:
        "A software agency needs a fast, SEO-capable marketing site that can explain many service lines, support paid campaigns with dedicated landing pages, publish ongoing insights, and move qualified visitors into a CRM pipeline—without running a full CMS or application backend inside the same codebase. The site must stay performant while shipping rich animation, multiple form entry points, and third-party tracking.",
      solution:
        "The project implements a content-as-code Next.js site: each route owns page.jsx plus data.js (or equivalent) and composes reusable section components (heroes, process timelines, carousels, FAQs, tech stacks, case-study blocks). Conversion is centralized around contact forms and a portal-based ContactDrawer that validate client-side and POST JSON to clickup-backend.mazedigital.us, then redirect successful submissions to /contact/thank-you for conversion tracking. Blog posts and “Latest Insights” sections pull from WordPress with caching and fallback behavior; HTML is sanitized before render. Site-wide Ask Maze provides intent-matched answers and CTAs without a custom LLM backend, coordinated with Tawk.to so chat overlays do not collide. SEO is handled via a shared metadata module, XML sitemap route handlers, robots.txt, permanent redirects for legacy URLs, and image optimization (AVIF/WebP).",
      features: [
        "Multi-page service catalog: dedicated routes for web development (including Next.js), app development (iOS, Android, React Native, cross-platform), AI development and AI chatbot, B2B SaaS and SaaS product design, MVP development, and UI/UX (including mobile app UI/UX), each built from shared section components and page-local content data.",
        "Industry and proof pages: industry pages (healthcare, ecommerce, entertainment, construction, staffing), a case-studies index and slug detail pages (static params from detail data), testimonials/projects/insights surfaces, and legal pages (privacy, terms, refund policy).",
        "Paid landing pages (/lp): campaign-oriented pages for AI app, MVP app, social media app, and CMS/website packages, with their own heroes and conversion forms.",
        "Lead capture and CRM handoff: multiple form surfaces (home BentoForm, ContactDrawer, about/contact forms, service heroes, LP heroes) share the same contact payload shape (name, email, phone, project, industry, aboutUs), international phone input with geo country detection, AbortController timeouts, and thank-you redirect on success (WebDev hero can show inline success instead).",
        "WordPress-powered blog: dynamic /blog/[slug] posts fetched from blog-wp.mazedigital.us with related posts, Yoast-aware metadata, sanitized HTML rendering, and Latest Insights cards on home/service pages that prefer live posts and fall back to static data when the API fails (fallback cards are marked so dummy links are not treated as live).",
        "Ask Maze site assistant: client-side intent ranking over curated Q&A data (services, pricing, platforms), follow-up clarification flows, navigation/contact CTAs, analytics hooks, and a bridge that hides/shows Tawk.to when the assistant overlay is open.",
        "Careers: careers listing and [slug] detail views driven by a static jobs map for open roles.",
        "SEO and crawl infrastructure: centralized SEO metadata and canonicals, multi-sitemap XML handlers (pages, images, blog), robots route, legacy URL redirects, and Next config tuned so title/canonical stay in <head> for SEO crawlers.",
        "Performance-minded front end: Server Components by default; heavy below-the-fold sections lazy-loaded; deferred third-party analytics; AppImage wrapper around next/image; optional bundle analyzer.",
        "Motion and UI systems: GSAP ScrollTrigger sections, Motion micro-interactions, Swiper/marquee carousels, AOS idle init, VersatileButton action model (contact / navigate / external), shared NavBar/TopBar/Footer chrome.",
        "Incomplete or simulated: blog sidebar “Subscribe” is a client-side simulation with no API; /services and /industries index pages are absent despite SEO keys existing; some outbound social/scheduling links have been documented as placeholders; automated tests are not configured.",
      ],
      challenges: [
        "Scale of marketing surface area: dozens of routes share visual systems but need page-specific copy, imagery, and section ordering. The solution uses highly parameterized “versatile” section components and co-located data modules—effective for shipping pages quickly, but styling contracts are stringly-typed Tailwind props with no compile-time checks.",
        "Conversion reliability without an in-repo backend: forms talk directly from the browser to an external contact API with duplicated validate/fetch/timeout logic across several components. Timeouts and field validation are implemented, but anti-abuse controls (CAPTCHA, honeypot, shared server proxy) are not visible in this repository. Backend rate limiting needs confirmation outside this repo.",
        "Integrating WordPress safely into a marketing Next app: posts require authenticated API access, caching, empty-result vs failure fallback policy, HTML entity decoding, and sanitize-html before dangerouslySetInnerHTML-style rendering—balancing freshness of content with build/runtime resilience.",
        "Performance vs. marketing richness: scroll-driven GSAP scenes, carousels, live chat, assistant UI, and multiple analytics vendors compete with Core Web Vitals; deferred analytics loading, dynamic imports, and image format optimization address this tension.",
        "Overlay / chat UX coordination: Ask Maze and Tawk.to both claim screen real estate; a small bridge API syncs widget visibility with assistant open state and route changes.",
        "SEO consistency across growth: legacy short service URLs, terms-path variants, and streaming-metadata head injection required redirects and Next config adjustments so SEO tools correctly see titles and canonicals.",
        "Quality without automated tests: no Jest/Vitest/Playwright suite exists; verification relies on manual QA (git history shows iterative design-alignment fixes on service pages). Whether that was treated as a formal process risk needs confirmation.",
      ],
      lessons: [
        "Treating page content as versioned modules next to routes keeps a large agency site shippable in a pure frontend repo, but it pushes content ownership onto developers and favors reusable section APIs over a headless CMS for non-blog pages.",
        "Centralizing lazy-loaded section imports in one registry (lazy-components.js) is a practical way to keep Server Component pages thin while controlling bundle splits for below-the-fold marketing blocks.",
        "Duplicating contact submit/validation across five or more components increases drift risk; a shared hook or Next.js route proxy would improve maintainability and could move the CRM endpoint server-side. Whether that refactor is planned needs confirmation.",
        "For CMS-backed HTML on a marketing site, sanitize-on-render plus explicit API-failure fallbacks (and marking fallback cards) prevents both XSS-class issues and dummy content that looks live.",
        "Deferring analytics until interaction (with a timed fallback) is a concrete tradeoff: tracking completeness vs. first-load cost on a conversion-focused site.",
        "Intent-based assistants can add guided discovery without LLM infrastructure when the domain (services, pricing, destinations) is finite and curated—especially when paired with human chat for escalations.",
        "Ignoring ESLint during production builds speeds iteration but removes a deploy safety net; pairing that choice with no automated tests raises the importance of manual design/SEO QA cycles. Team process needs confirmation.",
        "Personal or client-facing outcomes (conversion lift, SEO ranking gains, lead volume) are not measurable from the repository alone and remain unconfirmed.",
      ],
    },
  },
  {
    id: "project-clarion-btc",
    slug: "clarion-btc",
    title: "Clarion BTC",
    shortDescription:
      "A Next.js web application for a human-curated Bitcoin trading-signals product, serving as the public website and authenticated web client alongside an Android app.",
    year: "2026",
    category: "Web Application",
    featured: true,
    liveUrl: "https://clarionbtc.com",
    repositoryUrl: "https://github.com/bilalsami00/btc.git",
    technologies: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Ant Design",
      "React Hook Form",
      "Yup",
      "Chart.js",
      "Recharts",
      "AWS S3",
      "Binance public ticker API",
    ],
    image: image(
      "clarionBTC",
      "screencapture-clarionbtc-2026-10-17-21_03_42.png",
      "Clarion BTC website screenshot"
    ).src,
    imageAlt: "Clarion BTC website screenshot",
    gallery: [
      image(
        "clarionBTC",
        "screencapture-clarionbtc-2026-10-17-21_03_42.png",
        "Clarion BTC website screenshot"
      ),
    ],
    caseStudy: {
      overview: [
        "Clarion BTC is a Next.js web application for a human-curated Bitcoin trading-signals product. It serves as the public website and authenticated web client for a service that also ships as an Android app (package com.ClarionBtc). Intended users are active crypto traders who want expert-driven BTC trade setups (entry, targets, stop-loss, analysis notes) rather than AI-generated alerts, plus administrators who publish signals, market analysis, blogs, and newsletters. The frontend talks to a hosted REST API, gates premium screens behind login and subscription status, and stores session tokens in cookies and localStorage. Media (images and video) is uploaded through backend-issued S3 presigned URLs. Subscription purchases are directed to the mobile Google Play flow rather than completed on the website.",
      ],
      problem:
        "Traders looking for Bitcoin trade ideas often face noisy, automated, or incomplete alerts. Clarion BTC’s product proposition is human-expert signals with clear levels and analysis, delivered through a mobile app and a matching web experience. The web project must market the service, support account and legal/compliance flows (including Play Store–required support, privacy, and account-deletion pages), let subscribers review live signals and performance, and give admins tools to create and update signal and content inventories without a separate admin SPA.",
      solution:
        "The implemented web app provides a shared sidebar navigation shell over marketing pages (home, about, FAQ, legal, pricing, blogs) and authenticated areas (BTC live signals, signal detail, performance, settings). Next.js middleware protects non-public routes using a cookie-based auth token. Premium signal and performance views wrap content in a SubscribeGate that checks the backend user profile and in-app-purchase subscription status, allowing admins through. Admins get Manage Signal (and linked Manage Blogs / Manage Newsletter) flows with Yup-validated forms, optional scheduling, and S3 uploads. Pricing explains monthly, quarterly, and annual plans and steers purchase to the Play Store. Public Support Hub pages handle support contact, privacy, and passwordless account-deletion requests for store compliance.",
      features: [
        "Marketing home and about content explaining human-curated BTC (and selected altcoin) signals, value props, and CTAs toward pricing/subscription.",
        "Authentication: register, login, OTP verification, forgot-password email and reset flows against backend auth endpoints; session token stored for API Authorization and middleware cookie checks.",
        "Cookie/middleware route protection: logged-out users are redirected away from protected routes; logged-in users are redirected away from auth-only pages; shared public routes remain open.",
        "Subscription gating: SubscribeGate and shared subscription helpers call user and IAP subscription APIs; unsubscribed users see a lock screen with login/pricing CTAs; 401 clears session; subscription_required can redirect to pricing.",
        "BTC Live Signals lists open and recently closed BTC / BTC market-analysis signals for subscribers; shows live BTCUSDT price/change from Binance’s public ticker; navigates to per-signal detail.",
        "Signal detail fetches a single signal by ID and presents trade setup content behind the same subscription gate.",
        "Performance dashboard loads performance metrics from a dedicated API and visualizes outcomes with Chart.js bar/pie charts for subscribers.",
        "Pricing displays Monthly ($99), Quarterly ($269), and Annual ($999) plans with a feature list; purchase buttons open a “buy on mobile app” modal and Google Play deep link rather than completing web checkout.",
        "Public blog / market insights: blog listing and detail UI fetch public blog APIs; newsletter email subscribe is available from the blogs experience. Subscription gating for blogs was removed so content is publicly readable.",
        "Admin Manage Signal: create/update/delete trading signals and market-analysis posts with fields such as signal type, pair, status, entry, targets, stop-loss, timeframe, confidence, notes, optional schedule time, and image/video media (video size validated up to 500MB). Uploads use presigned S3 URLs.",
        "Admin Manage Blogs and Manage Newsletter: CRUD-style management pages linked from the admin signal workspace, including media upload via the same presigned pattern.",
        "Settings: profile name update, password change, logout, and authenticated account deletion against backend endpoints.",
        "Support, privacy, and public account deletion: SupportHub provides jump-linked support, privacy, and a deletion request form (POST account-deletion API) for logged-out Play Store compliance flows.",
        "Legal / FAQ: static informational pages with legal metadata dated July 21, 2026.",
        "Responsive layout work with CSS modules and Ant Design grid usage; git history shows repeated fixes for mobile sidebar/support visibility, blog detail centering, charts, and form validation borders.",
        "Present but not the primary surface: Alt Live Signals page and API filtering exist, and the navigation entry is commented out. Affiliate program and leaderboard pages/API calls exist (including a duplicate “affiliate-program copy” route); sidebar entries are commented out. Home trading analytics dashboard (Recharts + signals fetch) is commented out on the home page. Stripe price ID constants remain in code, but pricing disables web purchase and sends users to the Android app.",
      ],
      challenges: [
        "Dual-channel product (web + mobile): web must mirror marketing and account needs while purchases and push notifications are centered on Google Play Billing and the mobile app. Pricing UX and subscription status therefore depend on backend IAP state rather than a completed web payment flow.",
        "Auth and entitlement layering: middleware cookie checks, client localStorage tokens, role-based admin UI flags, SubscribeGate, and API 401/403 subscription errors must stay consistent so premium content is not shown to unpaid users while admins retain access.",
        "Rich admin content workflows: signal and analysis creation involves multi-field validation, create vs update modes, scheduling, mixed image/video media, and reliable S3 uploads through presigned URLs—complexity reflected in the large manage-signal implementation and follow-up fixes for upload validation and edit-screen media display.",
        "Responsive UI consistency: commit history documents repeated mobile layout and validation-feedback issues (sidebar/support visibility, blog detail spacing, required-field borders, chart placement).",
        "Public compliance surfaces: support, privacy, and account-deletion routes must remain reachable without login while still integrating with backend deletion APIs, as required for Play Store listing.",
      ],
      lessons: [
        "Separating public marketing/compliance pages from subscription-gated product pages (via middleware shared routes plus SubscribeGate) keeps store requirements and premium IP boundaries clearer than a single all-or-nothing auth wall.",
        "Centralizing subscription status and auth-error handling reduces duplicated entitlement logic across signals, detail, and performance screens.",
        "Using backend-issued S3 presigned URLs for media keeps large video/image uploads off the app server while still allowing the admin UI to attach media to signals and posts.",
        "Documenting Play Store URLs, data-safety answers, and the “purchase on mobile” decision in-repo (PLAY_STORE_LISTING.md) helps keep web behavior aligned with mobile monetization.",
        "Whether affiliate, leaderboard, alt-signal, and home-chart surfaces are intentionally deferred or abandoned needs confirmation—code remains but primary navigation does not expose them.",
        "The exact production ownership split between this web repo and the Android app / backend repositories needs confirmation.",
        "Quantitative outcomes (subscriber counts, conversion rates, signal performance published to users) are not evidenced in this frontend repository alone.",
      ],
    },
  },
  {
    id: "project-jimta",
    slug: "jimta",
    title: "Jimta",
    shortDescription:
      "A Next.js frontend for Jimta Group International’s member-facing digital ecosystem, covering shopping, loyalty and coin products, wallet and rewards messaging, service centers, subscriptions, referrals, and educational content.",
    year: "2026",
    category: "Web Application",
    featured: true,
    repositoryUrl: "https://github.com/bilalsami00/jimta-website-bilal.git",
    technologies: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS 4",
      "React Compiler",
      "Embla Carousel",
      "Lucide React",
      "react-international-phone",
    ],
    image: image(
      "JimtaWEB",
      "screencapture-jimta-website-bilal-vercel-app-2026-10-17-21_06_04.png",
      "Jimta website screenshot"
    ).src,
    imageAlt: "Jimta website screenshot",
    gallery: [
      image(
        "JimtaWEB",
        "screencapture-jimta-website-bilal-vercel-app-2026-10-17-21_06_04.png",
        "Jimta website screenshot"
      ),
    ],
    caseStudy: {
      overview: [
        "Jimta is a Next.js frontend for Jimta Group International’s member-facing digital ecosystem. The site presents shopping, loyalty/coin products, wallet and rewards messaging, service centers, subscriptions, referrals, and educational content under one brand. Intended users are platform members and shoppers who browse Jimta Shop and Classic Commerce, manage an account, and learn how coins, wallets, and service centers fit together.",
        "Architecturally, the app uses the Next.js App Router with route groups for authenticated marketing pages and auth flows. Most product catalogs and marketing sections are client-rendered from static/demo data. Login and multi-step registration call a remote backend (jimta-backend.mazedigital.us), with session tokens stored in httpOnly cookies via Next.js API route handlers. Classic Commerce cart and service-center selection persist in localStorage on the client; account order/shipping/payment UIs and several recovery flows remain frontend demos pending fuller backend integration.",
      ],
      problem:
        "Members need a single web presence that explains and navigates a broad ecosystem—stores, coins, wallet balances, rewards, service centers, and account settings—while supporting sign-up, sign-in, and a usable shopping path. The repository does not document a prior system being replaced; the observable need is a cohesive, responsive member site that can grow from marketing and demo commerce into live commerce and account APIs.",
      solution:
        "The implemented application delivers a branded multi-section website with shared navigation and footer, two commerce surfaces (Jimta Shop and Classic Commerce), and a cookie-based auth path against the Jimta backend. Classic Commerce provides listing, product detail, cart, checkout UI, and service-center selection with client persistence. Account screens reuse the auth session for profile display and offer validated forms for shipping and payment method entry. Informational pages cover coins, wallet, rewards, referral, subscription/upgrade, FAQ, blogs, legal pages, and contact. Where APIs are not yet connected, the UI is explicitly demo- or TODO-driven so flows can be completed visually without inventing backend behavior.",
      features: [
        "Marketing home: hero, hot-selling/new products, services overview, and “Why Choose Jimta” content.",
        "Global layout: responsive navbar (shop links, secondary ecosystem links, cart, wallet, language, profile) and site footer; Classic Commerce cart state shared via React context on home routes.",
        "Jimta Shop: category filters, sorting/toolbar UI, product grid from static catalog data, and product detail pages.",
        "Classic Commerce storefront: landing (hero, categories, featured/trending carousels, hot deals), featured and trending listing pages with pagination/toolbar, product detail (gallery, size/qty, add to cart), cart page, checkout page, navbar cart badge/dropdown, and service-center drawer with searchable demo centers.",
        "Classic Commerce cart persistence: cart lines and selected service center stored in localStorage with hydration-safe client state.",
        "Authentication: login against backend via /api/auth/login (httpOnly jimta_token + readable jimta_auth flag); logout via /api/auth/logout; session presence check via /api/auth/session; client user snapshot for navbar/account UI.",
        "Multi-step registration: personal details, password step, address completion; step data held in sessionStorage; final step POSTs to the backend register endpoint and redirects to login.",
        "Account area: About/personal info (session + fallbacks), Orders table UI, Shipping Address form with validation, Payment Method form with validation; profile dropdown and account shell navigation.",
        "Ecosystem/content pages: About, Jimta Coin, Coin Package, Wallet, Rewards, Referral System, Shopping Points, Bonus Points, Subscription, Upgrade, Service Center, Service Center Registration, Eco System, Become Member, Support, FAQ, Blogs (list + slug page), Contact, Terms, Privacy, Returns, Payment Methods info, and related sections.",
        "Form UX patterns: shared validators/helpers, international phone input on relevant forms, client-side error messages, loading/submit states on auth and several forms.",
        "Carousel UX: Embla-based product and hero carousels with autoplay/navigation where used.",
        "Incomplete or demo: Classic Commerce catalogs, service centers, checkout payment actions, and product reviews use demo/static data; checkout notes payment as UI-only; reviews saved locally for demo. Account orders, shipping countries/cities, and payment method submit are demo data / frontend-only. Forgot password, OTP verify, and reset password are UI flows with TODO placeholders for API calls. The contact form validates and simulates success with a delayed fake submit. The language selector offers EN/FR/ES/PT without an i18n translation layer. Some home service cards link to “/”; several ecosystem destinations appear as marketing concepts rather than implemented storefronts. Blog detail content is not wired to an API. No automated test suite is present.",
      ],
      challenges: [
        "Bridging secure server-side auth with a largely client-rendered UI: access tokens stay in httpOnly cookies while the client uses a readable auth flag, localStorage user snapshot, and /api/auth/session to drive navbar and account state without exposing the token to JavaScript.",
        "Multi-step registration without losing form continuity: sessionStorage stores intermediate steps, navigation flags distinguish intentional step moves from refresh, and step guards redirect incomplete flows back to the start.",
        "Classic Commerce cart hydration: reading localStorage only after mount avoids SSR/client mismatches while keeping cart and service-center selection available across listing, PDP, cart, checkout, and navbar dropdown.",
        "Separating demo commerce/account UX from live auth: product, order, and payment surfaces are intentionally frontend demos so the shopping and account journeys can be designed and validated before cart, payment, and order APIs exist.",
        "Responsive, design-system-aligned UI across many marketing and commerce routes, including drawers, dropdowns, and mobile navigation.",
        "Form validation and error surfacing across auth, contact, shipping, and payment screens without a shared backend schema for every form yet.",
        "Whether production deployment, CSRF/token refresh strategy beyond cookie flags, or map/payment integrations were scoped as formal project risks needs confirmation.",
      ],
      lessons: [
        "Keeping tokens in httpOnly cookies via Next.js route handlers while caching a non-sensitive user snapshot for UI is a practical split for App Router sites that call an external auth API.",
        "Explicitly labeling demo catalogs, demo orders, and UI-only payment clarifies delivery scope and avoids presenting unfinished integrations as production commerce.",
        "A shared cart context plus localStorage persistence is enough to prove end-to-end Classic Commerce UX (browse, cart, checkout, service center) before introducing a remote cart service.",
        "Centralizing registration step state and field validators reduces duplication across multi-page auth flows and makes backend field mapping (for example phoneNumber) easier to keep consistent.",
        "Enabling the React Compiler in Next config and structuring reusable listing/carousel/account shells supports maintainability as the ecosystem page count grows.",
        "Personal takeaways on timeline, stakeholder priorities, or production metrics after API wiring are not recorded in the repository.",
      ],
    },
  },
  {
    id: "project-jimta-dashboard",
    slug: "jimta-dashboard",
    title: "Jimta Dashboard",
    shortDescription:
      "A Next.js frontend that serves three role-based portals—admin, service center, and end user—from a single codebase for the Jimta platform.",
    year: "2026",
    category: "Web Application",
    featured: false,
    repositoryUrl: "https://github.com/bilalsami00/jimta-dashboards-bilal.git",
    technologies: [
      "Next.js 16",
      "React 19",
      "JavaScript",
      "Tailwind CSS 4",
      "shadcn/ui",
      "Recharts",
      "sonner",
      "Web Crypto AES-GCM",
    ],
    image: image(
      "JimtaDash",
      "screencapture-jimta-dashboards-bilal-vercel-app-login-2026-10-17-21_06_38.png",
      "Jimta Dashboard login screen"
    ).src,
    imageAlt: "Jimta Dashboard login screen",
    gallery: [
      image(
        "JimtaDash",
        "screencapture-jimta-dashboards-bilal-vercel-app-login-2026-10-17-21_06_38.png",
        "Jimta Dashboard login screen"
      ),
    ],
    caseStudy: {
      overview: [
        "Jimta Dashboard is a Next.js frontend that serves three role-based portals from a single codebase: an admin operations console, a service-center portal, and an end-user portal. It is the internal/management UI for the Jimta platform, covering users, wallets and Jimta Coin transfers, referrals, investment packages, product/blog content, service centers, and order/delivery workflows.",
        "Authenticated users are routed by role to /dashboard (admin), /sc-dashboard (service center), or /user-dashboard (user). The app talks to an external backend API (NEXT_PUBLIC_API_URL). Next.js itself only hosts small BFF routes for login/logout cookie handling. Shared layout chrome (sidebar, header), a centralized API client/endpoints registry, and domain service modules keep the three portals consistent while allowing role-specific navigation and screens.",
        "Related product surfaces referenced in the UI include a marketing/website link (https://jimta-website-bilal.vercel.app/) and referral links under the jimta.live domain. A dedicated public deployment URL for this dashboard repository was not documented in the repo.",
      ],
      problem:
        "Jimta needs separate operational experiences for platform administrators, service-center operators, and end users—user management, wallet and payout operations, referrals, packages, catalog/content, and delivery—without maintaining three unrelated frontends. Operators also need authenticated access, role-appropriate navigation, and consistent list/form patterns against a shared backend API.",
      solution:
        "The project implements one App Router application with route groups for auth, admin, service center, and user. Middleware decrypts an encrypted access-token cookie, reads a role cookie, and redirects users to the correct home and away from other roles’ routes (admin vs service center lists are enforced; user-portal middleware coverage is incomplete). Data access follows a fixed layering: page, domain service, apiClient, ENDPOINTS, external API. Login goes through a Next.js BFF that proxies credentials, encrypts the access token into a cookie, and sets the role cookie. Many admin and user wallet/referral/package flows are API-integrated; some catalog, order-delivery, and dashboard-chart screens remain UI-first with local or dummy data.",
      features: [
        "Single codebase with (admin-dashboard), (service-center-dashboard), and (user-dashboard) route groups, each with its own layout shell. Sidebar NAV_CONFIG switches menus by role, including nested sections for wallet, products and blogs, packages, referrals, and orders. Shared Header/Sidebar layout with logout and change-password entry points.",
        "Login via Next.js /api/auth/login BFF: proxies to backend /auth/login, AES-GCM-encrypts the access token into a cookie, sets a role cookie, and stores user display info in localStorage. Logout via /api/auth/logout plus client cookie and user_info cleanup. Forgot-password, OTP (/verify-otp gated by jimta_otp_allowed cookie), and reset-password flow. Multi-step registration UI, including international phone input; registration posts to the external auth register endpoint.",
        "Admin users and service centers (API-integrated): users list with pagination, create/edit, verification toggle, referral lookup, and admin-assisted password change. Service centers list/create/edit/status management through a multi-step form (personal, location, business, verification steps).",
        "Admin wallet and payouts (API-integrated): Jimta Coin list/transfer with searchable user selection; bank/payout details CRUD; request-fund listing and status updates; withdraw-request listing and status updates; wallet transfer-log listing with fallback UX when the API returns empty data.",
        "Admin packages, referrals, blogs, and categories (API-integrated): packages list/update/status, package history, and earning logs; referral information, referral-code generation/status, and referral logs; blogs CRUD and status toggle; product categories list/create/update/delete.",
        "Admin products are UI-implemented with largely local/dummy data. Jimta Products list/create/edit/view exists; list data is local/initial state rather than a dedicated products service. Classic Products list/create/edit/view includes color/size chips and a multi-image gallery UI, seeded with local dummy data. Backend endpoint constants for classic products exist, but the inspected pages do not yet call a classic-products service.",
        "Admin orders and dashboard are partial or mock: order-to-deliver and confirm-delivery screens use dummy order data and TODO placeholders for API calls. Admin dashboard stats cards and Recharts pie/bar charts use hardcoded sample values.",
        "User portal is largely API-integrated: dashboard stats (wallet balance, Jimta Coin, referrals, referral link pattern using jimta.live); earning log, transfer log, Jimta Coin transfer, wallet-balance transfer, payout/bank details, and withdraw-request create/list; referral code, referral logs, and my-referrals; profile service integration.",
        "Service center portal is mixed: profile get/update; referral screens wired to service referral services; Jimta Coin transfer, wallet-balance transfer, payout details, and transfer-log screens follow the user-portal patterns. Earning log and order/confirm-delivery screens still rely on dummy/local data. SC dashboard stats cards use hardcoded sample values.",
        "Cross-cutting UI and API architecture: central apiClient with Bearer token from decrypted cookie, FormData awareness, and consistent 401/403/5xx error handling (401 redirects to login). Shared DataTable, drawers, action dropdowns, badges, and toast feedback. Responsive sidebar/shell. ARCHITECTURE.md documents the intended patterns and known gaps.",
        "Incomplete or placeholder: middleware does not currently match user-portal routes (no USER_ONLY list). Products and several order-delivery flows are UI-complete with local/dummy data. Admin and SC dashboard chart/stat cards largely use static demo numbers. Notifications UI exists in navigation; depth of API integration should be confirmed before claiming full notification management. No automated test suite was found. Token refresh endpoint is defined but unused; some legacy cookie/crypto helpers under src/data duplicate src/lib utilities.",
      ],
      challenges: [
        "Supporting three portals in one App Router app required careful separation of route groups, role-based sidebar config, and middleware ownership lists. Middleware role lists, the middleware matcher, and NAV_CONFIG must stay aligned when adding routes—missing any one leaves a page unprotected, unreachable, or invisible.",
        "Session handling uses an encrypted non-httpOnly token cookie plus a plain role cookie. That design enables middleware and the client apiClient to read the session, but the project’s architecture notes document security tradeoffs: the AES key is a NEXT_PUBLIC_ value (client-visible), the role cookie is client-writable, and middleware role checks are routing UX rather than authoritative authorization. Backend API enforcement remains the real security boundary.",
        "API integration was rolled out domain by domain. That incremental approach left intentional interim states: dummy fallbacks when list APIs return empty, TODO stubs on order delivery confirmation, and catalog screens still on local state despite endpoint constants existing.",
        "Shared components (for example order view drawers and common transfer/payout modals) reduce duplication across admin and service-center flows, but require careful prop contracts so pages own fetching/mutation state while presentational components stay reusable.",
        "User-portal routes not being in the middleware matcher remains an explicit incomplete auth-gate concern documented in ARCHITECTURE.md.",
      ],
      lessons: [
        "A thin, consistent API layer—endpoints registry, one fetch client, and domain services—makes multi-portal feature work predictable: pages fetch and normalize; forms receive submit handlers as props; errors surface as toast messages from thrown API errors.",
        "Documenting architecture early captures both the intended patterns and the known gaps (user-route protection, cosmetic token encryption, unwired product/order screens).",
        "Role-based UX and shared shells work well when navigation config is centralized, but route protection must be treated as a checklist item whenever a new path is added—especially across three roles.",
        "Separating “UI complete” from “API complete” is essential: list/create/edit screens can look finished while still backed by dummy arrays.",
        "Personal process lessons (team velocity, client feedback cycles, production incident learnings) cannot be inferred from the repository alone.",
        "Related URLs noted in source are not verified as this dashboard’s live URL: website link https://jimta-website-bilal.vercel.app/, referral link pattern https://jimta.live/user/referral/{userId}. The dashboard production/staging URL needs confirmation.",
      ],
    },
  },
  {
    id: "project-rbf",
    slug: "rbf",
    title: "Royal Bullion Fund (RBF)",
    shortDescription:
      "A React single-page application that implements the member-facing UI for a bullion- and token-oriented investment platform, with balances in RBF and RBG and pack purchases via USDT (TRC20) or RBF balance.",
    year: "2026",
    category: "Web Application",
    featured: false,
    repositoryUrl: "https://github.com/bilalsami00/rbf.git",
    technologies: [
      "React 19",
      "Vite 8",
      "React Router DOM 7",
      "Redux Toolkit",
      "Tailwind CSS 4",
      "Ant Design",
      "dayjs",
      "react-icons",
    ],
    image: image(
      "rbf-dash",
      "screencapture-rbf-y5m3-vercel-app-login-2026-10-17-21_26_18.png",
      "Royal Bullion Fund login screen"
    ).src,
    imageAlt: "Royal Bullion Fund login screen",
    gallery: [
      image(
        "rbf-dash",
        "screencapture-rbf-y5m3-vercel-app-login-2026-10-17-21_26_18.png",
        "Royal Bullion Fund login screen"
      ),
    ],
    caseStudy: {
      overview: [
        "Royal Bullion Fund (RBF) is a React single-page application that implements the member-facing UI for a bullion- and token-oriented investment platform. The product brand is “Royal Bullion Fund,” with in-app balances expressed in RBF and RBG units and pack purchases optionally paid via USDT (TRC20) wallet connect or RBF balance.",
        "The application covers authentication and KYC screens, a collapsible dashboard shell (sidebar + navbar), and feature areas for service packs, marketplace shopping, orders, referrals, wallet operations, transactions, withdrawals, and support tickets. Routing is handled with React Router; marketplace cart state is managed with Redux Toolkit. At the time of this analysis, screens are driven primarily by static/demo datasets and client-side navigation rather than live backend APIs, making the repository a substantial frontend implementation and UX prototype ready for API integration.",
      ],
      problem:
        "Members of a fund-style product need a coherent digital workspace to register and verify identity, buy tiered service packs, track rewards and portfolio balances, shop a marketplace with RBG pricing, manage wallet transfers and conversions, request crypto withdrawals, and get support. Building that experience requires consistent branding, multi-step money flows, data-dense tables with filters, and a responsive layout that works from mobile drawer navigation through desktop sidebars. The original business motivation beyond this observable product surface is not documented in the repository and remains unconfirmed.",
      solution:
        "The app delivers a full routed UI for those workflows. Shared layout components (DashboardLayout, Sidebar, Navbar) provide navigation across all member sections. Auth screens include client-side validation (email, password strength, confirmation) and multi-step forgot-password / OTP / reset flows. Service-pack purchase walks users through tier selection, amount confirmation with min/max limits and live weekly-reward estimates, payment method choice (RBF balance vs external wallet), and a full-screen activation success state. Marketplace browsing, Redux-backed cart, checkout scheduling fields, and order history complete the commerce path. Wallet, transactions, withdrawals, referrals, and support screens implement searchable/filterable tables, detail drawers, and multi-step modals for convert, P2P transfer, and USDT withdrawal requests—currently against local static data with explicit TODOs where real API calls are expected.",
      features: [
        "Authentication UI: sign-in, sign-up, account-created success, and forgot-password flows (email, OTP, reset password) with shared AuthLeftPanel branding and field-level validation. Auth submit handlers currently simulate delay and navigate client-side; real auth API calls are marked TODO.",
        "KYC onboarding: select ID type (National ID / Passport), document upload screens, and a KYC completion screen as a multi-route verification path.",
        "Member dashboard: portfolio-style stat cards (RBF / RBG), weekly earnings and next-reward messaging, quick actions, referral share card, and active service-pack cards. Empty vs. “has pack” states are toggled via a local USER_HAS_PACK flag for UI simulation.",
        "RBF Service Packs: five tiers (Royal Start through Royal Platinum) with investment ranges and reward-point rates. Buy flow includes InvestmentConfirmation (amount stepper, range validation, live weekly earnings math), PaymentMethodModal, ConnectWalletModal (persists a simple walletConnected flag in localStorage), and PackActivated success screen.",
        "Marketplace: category home, product listing with search/filters, product detail, Redux cart (add/update/remove, cart drawer, toast), and checkout with delivery/meeting fields and order-success modal. Catalog and pricing use local marketplaceData (RBG prices with USD approximations).",
        "My Orders: order list with status badges, search/filter, detail drawer, and delivery-related UI (including confirm-delivery modal). Data is static sample orders.",
        "Refer & Earn: referral stats, shareable referral link/QR-oriented sharing UI, bonus-level presentation, and a nested multi-level referral tree with empty-state support. Demo referral URL and referral rows are hardcoded samples.",
        "Wallet: displays RBF and RBG balances; Convert modal (bidirectional RBF and RBG at a fixed demo rate with fee); P2P transfer modal (wallet ID, amount, fee summary, processing/success/error steps); recent transactions table with type-aware detail drawers.",
        "Transactions: cross-cutting transaction history with search, type/wallet/status filters, Ant Design DatePicker + dayjs for date filtering, mobile filter drawer, and rich per-type detail panels.",
        "Withdrawals: withdrawal history table, request modal for USDT (TRC20) address and amount, and status detail views (Approved / Pending / Rejected) using local withdrawals data.",
        "Support: ticket list with search/status filters, create-ticket modal, and ticket detail drawer showing admin response fields. Tickets are static sample data.",
        "Responsive shell: desktop collapsible sidebar; mobile off-canvas sidebar with backdrop; reusable DataTable, SearchBar, FilterDropdown, DetailDrawer, EmptyState, and NotificationDrawer patterns used across sections.",
        "Incomplete / not backend-integrated: login, OTP, password reset, and change-password flows contain TODO comments for API wiring. Balances, packs, marketplace products, orders, referrals, tickets, and withdrawals are local static datasets. No automated test suite was found in the repository.",
      ],
      challenges: [
        "Multi-step financial UX without a live API: purchase, convert, P2P, withdrawal, and checkout flows must still feel complete (validation, fees, processing/success states) while using mock data and simulated async delays. Several handlers explicitly leave API integration as follow-up work.",
        "Complex marketplace state: cart quantity, drawer open state, and toast feedback are centralized in Redux Toolkit so listing, detail, cart drawer, checkout, and navbar remain consistent across nested marketplace routes.",
        "Dense data UIs across many domains: transactions, wallet history, orders, withdrawals, and support each combine search, multi-filter controls, desktop tables, mobile cards/drawers, and type-specific detail layouts.",
        "Responsive layout under brand constraints: commit history and layout code show iterative work on mobile sidebar width, Refer & Earn card overlap at mid breakpoints, and consistent disabled-button styling.",
        "Pack investment rules in the UI: the confirmation screen encodes per-tier min/max amounts, validates input live, and derives weekly reward estimates from the selected pack’s reward rate before payment method selection.",
        "Auth/KYC as product gatekeeping is UI-level: multi-route KYC and password rules exist in the frontend, but without backend enforcement they remain presentation and navigation flows pending real verification services. Production security posture needs confirmation.",
      ],
      lessons: [
        "Separating presentation from persistence early is viable for fintech UI delivery: a full member experience can be built and design-validated with static datasets and explicit TODO API seams, then swapped for real services without discarding the interaction model.",
        "Shared layout and data-display primitives (DashboardLayout, DataTable, DetailDrawer, EmptyState, SearchBar, FilterDropdown) reduce duplication across wallet, transactions, orders, withdrawals, and support.",
        "Domain-specific state belongs close to the feature that owns it: Redux is used for marketplace cart (cross-route shared state), while most other screens keep local React state.",
        "Client-side validation and fee/summary previews (auth validators, pack limits, P2P fee, conversion rate) improve trust in money flows even before backend confirmation, but production correctness still depends on server-side rules.",
        "Responsive investment and referral pages benefit from treating breakpoint layout as a first-class design constraint; commit history around sidebar width and Refer & Earn overlapping cards illustrates that visual polish on mid-size viewports can be as demanding as feature logic.",
        "Personal process lessons (team workflow, design handoff, deployment targets, and live production metrics) are not fully documented in-repo.",
      ],
    },
  },
  {
    id: "project-steripass-admin",
    slug: "steripass-admin",
    title: "SteriPass Admin Dashboard",
    shortDescription:
      "A Next.js administrative and operational front end for the SteriPass platform, with role-specific access for super admin, hospital, and vendor accounts.",
    year: "2026",
    category: "Web Application",
    featured: false,
    repositoryUrl: "https://github.com/sudoosama/maze-steripass-admin",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "Ant Design",
      "Chart.js",
      "Yup",
      "React Hook Form",
      "js-cookie",
      "dayjs",
      "qrcode",
      "jsQR",
    ],
    image: image(
      "steriPass",
      "screencapture-admin-steri-pass-2026-10-17-21_08_57.png",
      "SteriPass admin dashboard screenshot"
    ).src,
    imageAlt: "SteriPass admin dashboard screenshot",
    gallery: [
      image(
        "steriPass",
        "screencapture-admin-steri-pass-2026-10-17-21_08_57.png",
        "SteriPass admin dashboard screenshot"
      ),
    ],
    caseStudy: {
      overview: [
        "SteriPass Admin Dashboard is a Next.js web application that serves as the administrative and operational front end for the SteriPass platform. It gives three account types—super admin, hospital, and vendor—role-specific access to dashboards, tray reporting, hospital and vendor management, staff tools, transactions, and revenue views. Users authenticate against a remote SteriPass REST API; the app stores session tokens in cookies and localStorage and enforces route access through Next.js middleware plus a client-side route guard. The UI is built with Tailwind CSS and Ant Design components, with Chart.js used for analytics visualizations. Staging and production deploy pipelines build the Next.js app and run it under PM2 on a VPS. In the current codebase the API base points at the staging host (api-stag.steri-pass.com), with production API (api.steri-pass.com) referenced for comparison and a visible “Testing Mode” badge when not on production.",
      ],
      problem:
        "Sterile tray workflows involve hospitals, vendors, and platform operators who need to track tray check-in/check-out status, manage staff and managers, review transactions and overdue revenue, and act on operational data from a browser. Without a shared, role-aware admin surface, those workflows would depend on disconnected tools or direct backend access. The original business motivation beyond this observable need needs confirmation.",
      solution:
        "The application provides a role-selected entry flow and JWT-backed sessions that map each user to an allowed set of routes and navigation. Super admins manage hospitals and managers, browse all vendors, view platform analytics, transactions, and overdue revenue. Hospitals manage staff (including QR-based flows), view hospital-scoped vendors and reporting, and can check out trays as managers. Vendors see their tray activity, reporting, and transactions. Shared concerns—API error handling (including 401 session teardown), date filters, pagination, responsive layouts, and tray detail/checkout—are implemented as reusable screens and helpers against documented REST endpoints.",
      features: [
        "Role-based entry and authentication: landing role selection (Hospital / Vendor), hospital onboard (password check or OTP), vendor/hospital login, separate super-admin login, and forgot-password flows (email OTP, code verification, set password) for both admin and non-admin paths.",
        "Session and route protection: cookie-based middleware allowlists per role (admin, hospital, vendor), Cache-Control no-store to reduce bfcache stale-auth issues, client RouteGuard on navigation/back-forward, and automatic logout redirect on API 401.",
        "Super admin dashboard: summary cards (vendors, revenue) and Chart.js charts for revenue over time, tray status, and specialty distribution, with time-range filters and a mobile filter drawer.",
        "Hospital / vendor dashboards: hospital-facing analytics charts from the admin dashboard API scoped by hospital; vendor dashboard with checked-in/out counts and a recent trays list linked into reporting.",
        "Hospital management (super admin): searchable, paginated hospital list; create/edit hospital (including expedite timing and optional case ID); activate/deactivate; detail view with trays, transactions, and managers; invite/resend/remove managers; view/download manager QR codes.",
        "All Vendors (super admin): platform-wide vendor listing and detail, including nested hospital context and tray drill-down.",
        "Hospital-scoped Vendors: vendors associated with a selected hospital (hospital users and admin “hospital workspace” after hospital selection in the header).",
        "Reporting: role-specific tray listings with search, status, and date-range filters; tray detail via a shared TrayDetail component showing tray metadata, images, and checkout; hospital managers and admins use different checkout endpoints.",
        "Staff management (hospital): staff listing with search/status filters; add/edit/deactivate; generate QR, upload/decode QR (jsQR), and camera scan flows for staff onboarding.",
        "Transactions: vendor and admin transaction tables with hospital filtering for admins.",
        "Overdue revenue (super admin): overdue transaction listing with hospital and date filters, status display, and invoice download gated when no transactions exist.",
        "Settings and profile: header settings modal for super admin (app version and payment amount configuration); hospital manager self QR and profile edit; testing-mode indicator when not pointed at the production API.",
        "Responsive admin shell: collapsible sidebar, mobile hamburger navigation, responsive auth/role screens, and mobile-oriented date picker / modal scroll behavior.",
        "CI/CD: GitHub Actions workflows deploy staging (port 5001) and production (port 5000) builds to a VPS via SSH/SCP and PM2.",
        "Limits relative to a finished product: sidebar Settings route is not present; settings live in a header modal for super admin. Hospital settings gear in the header is commented out. Some admin dashboard filter controls for tray-status charts appear as UI placeholders without fully wired options. Hospital dashboard revenue summary UI is largely commented out. Terms and Privacy profile links are commented out. A public live URL is not documented in the repository.",
      ],
      challenges: [
        "Multi-role authorization consistency: middleware role allowlists, sidebar menus, dashboard branching, and API accountType must stay aligned across SUPER_ADMIN, HOSPITAL, and VENDOR. Iterative middleware and RouteGuard revisions (including bfcache / browser Back handling) show this was an ongoing implementation concern.",
        "Auth session storage split: tokens live in both cookies (middleware) and localStorage (API Bearer header), with JWT claim decoding for account type. Keeping login, password-reset, and 401 cleanup coherent across those layers required careful flow helpers.",
        "Tray lifecycle across roles: checkout behavior differs for hospital managers versus admins; remaining counts and expiry-related listing states needed to stay consistent after checkout, back navigation, and refresh.",
        "Operational UI at scale: paginated tables, debounced search, date range pickers with API-specific date formats, and downloadable overdue invoices required careful empty-state and filter handling.",
        "Responsive and mobile polish: mobile date filters, modal overlays (for example Edit Hospital), sidebar/nav behavior, and QR/camera flows on smaller screens appear as repeated fix themes.",
        "Environment and deploy separation: hard-coded API base switching between staging and production, Testing Mode badge, and dual GitHub Actions pipelines (staging/production branches) reflect the need to keep admin builds aligned with the correct backend without exposing secrets in source.",
      ],
      lessons: [
        "Centralizing cross-cutting UI (TrayDetail, shared table/skeleton patterns, range-picker helpers) reduces duplication across hospital, vendor, and reporting entry points.",
        "Explicit role allowlists in middleware are effective only when paired with client-side guards and no-store headers; browser history/bfcache can otherwise re-surface authenticated or public pages incorrectly.",
        "Distinguishing staging vs production at the API client layer (and surfacing Testing Mode in the UI) helps operators avoid acting on the wrong environment during active development.",
        "Form validation with Yup + React Hook Form, combined with Ant Design messaging and abortable fetch timeouts, provides a consistent error/UX pattern across auth and entity dialogs.",
        "Broader product lessons (client outcomes, adoption metrics, or why SteriPass chose this admin architecture) are not documented in-repo and would need developer or stakeholder input.",
      ],
    },
  },
  {
    id: "project-social-media-dashboard",
    slug: "social-media-dashboard",
    title: "Social Media Dashboard",
    shortDescription:
      "A Next.js admin panel for managing a social media platform’s users and reported content, including moderation reports, account status, and platform metrics.",
    year: "2025",
    category: "Web Application",
    featured: false,
    repositoryUrl: "https://github.com/bilalsami00/social-media.git",
    technologies: [
      "Next.js 16",
      "React 19",
      "Tailwind CSS 4",
      "Axios",
      "Recharts",
      "Framer Motion",
      "Radix UI",
      "Lucide React",
    ],
    image: image(
      "socialMedia",
      "screencapture-social-media-five-lilac-vercel-app-login-2026-10-17-21_11_11.png",
      "Social Media Dashboard login screen"
    ).src,
    imageAlt: "Social Media Dashboard login screen",
    gallery: [
      image(
        "socialMedia",
        "screencapture-social-media-five-lilac-vercel-app-login-2026-10-17-21_11_11.png",
        "Social Media Dashboard login screen"
      ),
    ],
    caseStudy: {
      overview: [
        "Social Media Dashboard is a Next.js admin panel for managing a social media platform’s users and reported content. It is intended for platform administrators who need a single place to review moderation reports, enable or disable accounts, and view high-level platform metrics. The frontend authenticates against an external backend API, proxies browser requests through Next.js rewrites for same-origin access, and presents dashboard analytics, user management, and reported-post review workflows behind cookie-based route protection.",
      ],
      problem:
        "Social platforms generate reported posts and account-status decisions that admins must handle quickly. Without a dedicated moderation console, reviewing reports, inspecting post media, searching users, and applying enable/disable or remove/ignore actions is fragmented across backend tools or ad-hoc API calls. The original product motivation and client context are not documented in the repository and need confirmation.",
      solution:
        "The application implements an admin UI that signs administrators in via JWT stored in cookies, guards dashboard routes with Next.js middleware, and integrates with backend endpoints for overview stats, user listing/toggling, and reported-post listing/actions. Shared client helpers normalize varied API response shapes into consistent UI models. Server-side fetching is used for the users list (with query-driven search, filters, and pagination), while dashboard and reported-posts flows use authenticated client-side Axios calls through an /api rewrite proxy.",
      features: [
        "Admin sign-in: email/password login against /auth/admin/signin, stores a Bearer token in an auth_token cookie, and redirects to the dashboard.",
        "Password recovery UI: forgot-password email verification, six-digit OTP entry with resend timer, and new-password reset against admin auth endpoints. Client-side checks require matching passwords and a minimum length of eight characters.",
        "Route protection: middleware redirects unauthenticated users away from /dashboard/* and logged-in users away from auth pages. Additional guards on /otp and /new-password expect pw_reset and otp_verified cookies.",
        "Dashboard overview: loads /posts/dashboard/overview and displays reported posts, total users, daily active users, and total posts, with animated stat values and Recharts visualizations for weekly posts and six-month signup trends.",
        "Reported posts moderation: lists reports with search and reason filtering, client-side pagination over flattened report rows, and inline ignore actions. Detail view shows post content, media, reporter metadata, and confirmation dialogs to remove a post or ignore a report.",
        "User account management: server-rendered user table with debounced search, active/disabled filtering, and pagination. Detail page loads user profile fields and toggles disabled status via PATCH /auth/toggle-disabled/:id with confirmation UI.",
        "Responsive admin shell: collapsible sidebar (desktop) and mobile menu covering Dashboard, Reported Posts, and User Accounts, plus logout that clears the auth cookie.",
        "API client layer: Axios instance with /api base URL, Authorization header injection from cookies, and normalized error payloads (message, status, data).",
        "Incomplete or unused: a dedicated Analytics route is linked from some dashboard stat cards but is not implemented; the analytics menu item is commented out. Hourly active-users chart UI is largely commented out; when backend hourly data is absent, the page can synthesize evenly distributed hourly points from the daily total. src/lib/dummy-data.js contains early mock datasets and is not imported by live pages. Password-reset step cookies expected by middleware do not appear to be set by the forgot-password/OTP pages in the current code, so that gated flow may not complete end-to-end without further wiring. No automated test suite was found.",
      ],
      challenges: [
        "Backend response normalization: reported-post and dashboard helpers map multiple possible field names (_id vs id, reported_at vs reportedAt, nested user_id, and similar) so the UI can tolerate inconsistent API shapes.",
        "Mixed data-fetching strategies: client pages rely on the Next rewrite proxy (/api to the external backend), while the users page fetches the backend directly on the server and forwards the auth cookie as a Bearer token—requiring careful handling of Next.js async cookies(), headers(), and searchParams shapes.",
        "Auth and session boundaries: cookie-readable JWTs enable middleware protection and client Authorization headers, but must remain SSR-safe (token reads are guarded for non-browser contexts). Password-reset step cookies are declared in middleware without matching setters in the auth pages, creating a likely incomplete multi-step recovery gate.",
        "Moderation list UX vs API shape: the UI flattens posts into individual report rows and paginates client-side after requesting a large limit, which works for moderate data volumes but may need a reports-first backend endpoint as volume grows.",
        "Detail lookups without dedicated endpoints: reported-post and user detail views currently resolve entities by scanning list endpoints rather than single-resource APIs, which simplifies integration but limits scalability and reliability for large datasets.",
        "Responsive admin layout: sidebar collapse and mobile drawer states keep navigation usable across breakpoints while preserving the primary moderation workflows.",
      ],
      lessons: [
        "Same-origin API proxying via Next.js rewrites simplifies browser CORS concerns while keeping the real backend URL out of most client request paths.",
        "Centralizing Axios interceptors and response normalizers reduces page-level duplication when integrating a backend that returns uneven payload shapes.",
        "Cookie-based auth works well with Next middleware for route-level protection, but multi-step flows (password reset) need the same cookie contract implemented on both sides—middleware alone is insufficient.",
        "Debounced URL query updates (search/filter) keep server-rendered list pages bookmarkable and shareable without excessive refetch chatter.",
        "Distinguishing live API-backed screens from leftover mock data and commented chart routes keeps the product surface honest for maintainers and stakeholders.",
        "Broader product lessons (performance targets, accessibility goals, production hardening, and client outcomes) would require developer or stakeholder input beyond what the repository documents.",
      ],
    },
  },
  {
    id: "project-alpha-arc",
    slug: "alpha-arc",
    title: "Alpha Arc (Landing Page)",
    shortDescription:
      "A marketing landing site for the Alpha Arc mobile app, explaining habits, mindset training, reflection, and optional sales-team development, and directing visitors to the iOS App Store.",
    year: "2026",
    category: "Web Application",
    featured: false,
    repositoryUrl: "https://github.com/bilalsami00/alpha-lp.git",
    technologies: [
      "Next.js",
      "React",
      "TypeScript/JSX",
      "Tailwind CSS",
      "Framer Motion",
      "next/font",
    ],
    image: image(
      "alphaDash",
      "screencapture-chrome-extension-fdpohaocaechififmbbbbbknoalclacl-capture-html-2026-10-17-21_07_33.png",
      "Chrome extension capture page stored with the Alpha Arc project files"
    ).src,
    imageAlt:
      "Chrome extension capture page stored with the Alpha Arc project files",
    gallery: [
      image(
        "alphaDash",
        "screencapture-chrome-extension-fdpohaocaechififmbbbbbknoalclacl-capture-html-2026-10-17-21_07_33.png",
        "Chrome extension capture page stored with the Alpha Arc project files"
      ),
    ],
    caseStudy: {
      overview: [
        "Alpha Arc is a marketing landing site for the Alpha Arc mobile app, a daily performance product focused on habits, mindset training, reflection, and optional sales-team development. This repository implements the public web presence that explains the product, walks visitors through how the app works, answers common questions, and directs users to download the iOS app from the App Store. The intended audience is individuals seeking structured daily routines and personal growth, including (but not limited to) sales professionals who can unlock team training and leaderboard features inside the app.",
        "The site is a front-end-only Next.js application. It uses the App Router for a single-page home experience plus dedicated Privacy Policy and Terms & Conditions routes. Layout and styling rely on Tailwind CSS with a dark brand theme, custom Placard Next display typography, and Framer Motion for scroll-triggered and hero animations. There is no application backend, authentication, or API layer in this repository; legal copy and FAQ content describe the mobile product’s capabilities, while the web app itself presents static marketing and legal pages.",
      ],
      problem:
        "Prospective users need a clear, branded web destination that explains what Alpha Arc is, how its daily loop works (Drops, habits, ARC Score, sales features), and how to get the app—without requiring them to install anything first. The product also needs public Privacy Policy and Terms & Conditions pages that accurately describe account data, sales-team workflows, and usage rules. The original business motivation, client brief, and whether this landing page replaced a prior site need confirmation.",
      solution:
        "The implemented site delivers a focused conversion-oriented landing page: a hero with value proposition and App Store CTA, a feature grid summarizing core app capabilities, a multi-step “How it works” narrative with product mockups, an About section, an accordion FAQ, and a footer with navigation and legal links. Separate Next.js routes host Privacy Policy and Terms & Conditions content aligned with the mobile product’s features (habits, ARC Score, Mind sessions, Daily Debrief, Daily W, sales teams, invite/team codes). Play Store download UI exists in the codebase but is currently commented out / temporarily hidden, so the live CTAs prioritize the published App Store listing.",
      features: [
        "Hero section with brand headline, floating phone mockup animation (Framer Motion), and App Store download link to the live Alpha Arc iOS listing.",
        "Responsive navigation with desktop link bar and full-screen mobile menu (body scroll lock while open), plus “Get the App” CTA linking to the App Store.",
        "Features (“All-in-one”) grid documenting six product capabilities presented to visitors: habit building, Daily Debrief, Mind Training Sessions, streaks, ARC Score tracking, and Sales Training.",
        "How it works narrative with four illustrated steps: Today’s Drop, daily habits, ARC Score, and sales-team leveling (Daily W streaks, lessons, leaderboards).",
        "About section (embedded on the home page within the How it Works component) describing product purpose and positioning around routines, mindset, reflection, and sustainable progress.",
        "FAQ accordion with animated expand/collapse and measured content heights for seven product questions (what Alpha Arc is, ARC Score, Today’s Drop, sales eligibility, joining a team, Daily Debrief, Mind sessions).",
        "Privacy Policy page covering data collection/use, sales-team admin access, sharing, retention, security, user rights, children’s privacy, and contact details (last updated August 2026 in-page).",
        "Terms & Conditions page covering service use, account activity, sales teams, invite/team codes, user content, suspension, IP, liability, and related legal terms (last updated August 2026 in-page).",
        "Footer with App Store badge, dynamic copyright year, in-page section anchors, and links to Privacy Policy and Terms & Conditions.",
        "Brand presentation: dark theme (#0E0E0E), gold/green accent styling, custom Placard Next fonts, Open Sans via next/font, and optimized images via next/image.",
        "Not currently active on the live home composition: standalone AboutUs component exists but is commented out of the home page import/render path; About content is rendered inside HowItWorks. Google Play Store buttons and related CTAs are commented out / marked temporarily hidden. lucide-react is listed in package dependencies but is not actively imported in the running UI. next.config.ts contains a commented static-export option; the project runs as a standard Next.js app. No automated tests were found.",
      ],
      challenges: [
        "Responsive marketing layout across hero, multi-column feature cards, and large product mockups while preserving brand typography and spacing on mobile and desktop.",
        "Mobile navigation UX: implementing a full-viewport overlay menu with open/close transitions and preventing background scroll while the menu is open.",
        "Accordion FAQ height animation: measuring answer content heights so expand/collapse transitions work smoothly without hard-coded heights.",
        "Scroll-driven storytelling: coordinating Framer Motion whileInView animations across multiple How it Works steps without overwhelming the page (viewport thresholds and once: true).",
        "Content and CTA consistency as the product messaging and store availability evolved (About copy revisions, Play Store CTA temporarily disabled, legal pages updated). Whether store-availability timing or legal review were formal project constraints needs confirmation.",
        "Distinguishing landing-page scope from the mobile app: this repository markets features such as ARC Score, streaks, and sales teams but does not implement those product systems itself.",
      ],
      lessons: [
        "A conversion landing page can remain maintainable when major sections are isolated as components (Hero, Features, HowItWorks, FAQ, Footer) and composed on a single home route, with legal content kept on dedicated routes.",
        "Anchored section IDs (#howItWorkSection, #aboutUs, #faqSection) plus scroll-smooth on the document improve in-page navigation for both desktop and mobile menus.",
        "Temporarily disabling incomplete channels (Play Store) via commented CTAs avoids misleading visitors while preserving the UI for later re-enablement—though commented code also increases long-term cleanup cost.",
        "Keeping legal and FAQ copy in sync with the actual mobile product surface (habits, ARC Score, Mind, Debrief, sales teams, invite codes) is important for trust; this site’s legal pages were updated in tandem with product messaging (commit history and “Last Updated: August 2026”).",
        "Declaring a dependency does not equal using it: lucide-react appears in package.json but is not part of the active UI.",
        "Personal takeaways around design collaboration, performance budgets, accessibility audits, or deployment pipeline choices cannot be established from the repository alone.",
      ],
    },
  },
  {
    id: "project-lights-camera-action",
    slug: "lights-camera-action",
    title: "Lights Camera Action",
    shortDescription:
      "A multi-page marketing website for a professional video production agency, presenting services, sample work, team members, process steps, FAQs, and contact information.",
    year: "2025",
    category: "Web Application",
    featured: false,
    technologies: [
      "React 19",
      "Vite 7",
      "React Router DOM 7",
      "Tailwind CSS 4",
      "react-icons",
      "YouTube embeds",
    ],
    image: image(
      "lightsCameraAction",
      "screencapture-vittor-1-vercel-app-2026-10-17-21_10_23.png",
      "Lights Camera Action website screenshot"
    ).src,
    imageAlt: "Lights Camera Action website screenshot",
    gallery: [
      image(
        "lightsCameraAction",
        "screencapture-vittor-1-vercel-app-2026-10-17-21_10_23.png",
        "Lights Camera Action website screenshot"
      ),
    ],
    caseStudy: {
      overview: [
        "Lights Camera Action is a multi-page marketing website for a professional video production agency. It presents services, sample work, team members, process steps, FAQs, and contact information so prospective clients—businesses, creators, and brands—can evaluate the studio and initiate outreach.",
        "The application is a client-side React SPA built with Vite. React Router maps five primary routes (Home, Services, Gallery, About, Contact). Shared chrome includes a responsive navbar, a global footer with route-aware newsletter copy, and a ScrollToTop helper that resets scroll on navigation and page restore. Content is largely static (local assets and hardcoded copy), with interactive media handled through YouTube embeds in accessible modal players. There is no application backend, database, or authentication layer in this repository. The npm package name is vittor-vidio; the product brand in the UI is Lights Camera Action (LAC). Copyright text credits MagicGraphics as the powering studio. Which public name should be preferred needs confirmation.",
      ],
      problem:
        "Video production studios need a polished online presence that communicates capability, showcases work, and makes it easy for prospects to learn the offering and get in touch. A brochure-style site must feel cinematic and brand-consistent while remaining usable across devices. The original business motivation beyond this observable marketing need is not documented in the repository and needs confirmation.",
      solution:
        "The site delivers a dark, branded multi-page experience with reusable section components composed into route-specific layouts. Home introduces the brand, capability highlights, service catalog, ordering process, booking-style contact form UI, and testimonials. Services reuses offer and value sections plus an FAQ accordion. Gallery pairs project messaging with a portfolio grid that opens YouTube videos in fullscreen portals with focus management. About covers team, values, and a configurable “who we are” video block. Contact consolidates location/email/phone cards and a detailed message form. Navigation CTAs and optional “Learn more” actions route users toward gallery or contact flows without requiring server-side pages.",
      features: [
        "Multi-page routing: Home (/), Services (/services), Gallery (/gallery), About (/about), Contact (/contact) via React Router, with active NavLink styling and a mobile hamburger menu.",
        "Branding and layout system: dark theme (#16131a), pink/purple gradient CTAs, Poppins typography, and a shared Banner component for inner-page headers.",
        "Hero and capability messaging: full-bleed hero with overlay copy; floating feature cards for Video Editing, Video Grab, and Video Direction.",
        "Service catalog: six service cards (Video Ads, Music Video, Video Vlog, Gaming Content, Movie & Short Films, Video Documenter) with optional “Learn more” navigation to the gallery (hidden on the Services page for layout consistency).",
        "Who-we-are / about video player: configurable heading, description, thumbnail, and YouTube URL; ID extraction supports watch, youtu.be, embed, and shorts formats; play opens a portaled modal with autoplay embed, ESC/backdrop close, body scroll lock, and Tab focus trap.",
        "Gallery portfolio player: project cards with hover/touch scale effects and “Play video” actions that open YouTube embeds in the same modal pattern.",
        "Process steps (“How to Order”): Consultation, Creative Planning, Execution, Delivery, with an optional CTA button controlled by a showButton prop.",
        "Why Choose Us and FAQ: icon-led value props; accordion FAQ with aria-expanded toggles on the Services page.",
        "Team section: named roles with hover/focus overlays and keyboard activation for social icon overlays (social destinations are currently placeholder “#” links).",
        "Testimonials carousel: horizontally scrollable review cards with pointer drag-to-scroll behavior.",
        "Contact surfaces: get-in-touch cards (Carrollton, TX address; public support/info emails; phone); multi-field “Send us a message” and home “Schedule An Appointment” form UIs; footer newsletter email field with route-specific newsletter text overrides for /about and /contact.",
        "Scroll and motion UX: Intersection Observer–driven entrance animations; AnimatedNumber on Services respects prefers-reduced-motion; ScrollToTop handles route changes, pageshow, and history.scrollRestoration.",
        "Responsive UI: Tailwind breakpoint layouts for navbar, grids, hero, and modal sizing (full-screen on small viewports, framed modal on larger screens).",
        "Incomplete or placeholder: contact, appointment, and newsletter forms have no onSubmit handlers, validation, API calls, or success/error feedback. Team social links point to “#”. Some contact copy still uses placeholder lorem ipsum. A full “Trusted by …” section exists in source but is commented out on Home and About; a reduced HalfTrustedSection with animated counters is used on Services. Marketing metrics shown in the UI should be treated as content claims requiring confirmation, not verified business results. lucide-react appears in package.json but is not imported in application source. No automated tests were found. The README remains the default Vite template.",
      ],
      challenges: [
        "Accessible media modals: implementing YouTube playback via React portals required coordinating open/close animation timing, restoring focus to the triggering control, trapping Tab focus inside the dialog, handling Escape, and locking background scroll.",
        "Scroll restoration in an SPA: ScrollToTop goes beyond pathname-only resets by handling bfcache/pageshow and temporarily setting history.scrollRestoration to “manual” so refresh and back/forward do not leave users mid-page unexpectedly.",
        "Reusable section composition: shared blocks accept props (copy, showLearnMore, showButton, newsletterText) so the same UI can adapt per route without duplicating full page trees.",
        "Motion performance and accessibility: widespread Intersection Observer animations and requestAnimationFrame counters needed careful once-only observe/unobserve behavior; AnimatedNumber skips animation when prefers-reduced-motion is set.",
        "Frontend-only contact workflow: form UIs imply lead capture, but without a backend or third-party form service the contact path stops at the browser. Wiring submission, validation, and spam protection remains an open integration concern. Whether a planned service was intended needs confirmation.",
        "Large iterative component files: several page modules retain extensive commented historical implementations alongside the active export, which increases file size and makes the live code path harder to scan.",
      ],
      lessons: [
        "Component props for cross-page reuse (showLearnMore, showButton, newsletter overrides, configurable About video/thumbnail/copy) keep marketing pages consistent while allowing route-specific UX without forking entire sections.",
        "Treating video playback as a modal dialog—with portals, focus return, and keyboard support—improves usability compared with inline autoplay-only embeds, especially when multiple portfolio items share one player pattern.",
        "Respecting prefers-reduced-motion in counter animations shows how small accessibility checks improve reliability for motion-sensitive users without removing the visual effect for others.",
        "A visually complete contact UI is not a complete lead pipeline; production readiness for inquiry forms requires explicit submit handling, validation, and a delivery channel. The preferred integration stack needs confirmation.",
        "Keeping product documentation in sync with the real brand (beyond the default Vite README) would make onboarding and portfolio presentation clearer. Whether that is a process lesson for the team needs confirmation.",
        "Unused dependencies and large commented blocks illustrate the value of periodic cleanup. Whether those leftovers are intentional work in progress or safe to remove needs confirmation.",
      ],
    },
  },
];

export const featuredProjects = projects.filter((project) => project.featured);

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((project) => project.slug === slug);
}
