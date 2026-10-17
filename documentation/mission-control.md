# Mission Control — admin, contact inbox, and visitor tracking

Mission Control is the hidden admin area of this portfolio. It provides:

- Firebase Email/Password sign-in, gated by a Firestore `admins` whitelist (no signup)
- A realtime dashboard for contact messages and visitor sessions
- A server-side contact API that stores messages and emails a notification
- Lightweight, privacy-respecting visitor sessions (one Firestore document per tab)

> `npm run export` (`next export`) cannot serve API routes. Deploy to a host that
> runs Next.js server code (Vercel recommended).

---

## Files

**Created**

| Path | Purpose |
| --- | --- |
| `utilities/firebaseClient.ts` | Browser Firebase app/auth/firestore (guarded by `NEXT_PUBLIC_FIREBASE_ENABLED`) |
| `server/firebaseAdmin.ts` | Admin SDK singleton (server only) |
| `server/email.ts` | Nodemailer SMTP notifications + visitor email dedupe |
| `server/visitorSessions.ts` | Session create (idempotent) / update logic |
| `server/requestContext.ts` | IP, geo, referrer, beacon body parsing, in-memory rate limiter |
| `server/log.ts` | Secret-free server error logging |
| `pages/api/contact.ts` | `POST /api/contact` |
| `pages/api/visitors/session.ts` | `POST` / `PATCH /api/visitors/session` |
| `utilities/schemas/*.ts` | Zod schemas shared by client and server |
| `utilities/userAgent.ts` | Best-effort UA parsing (client + server) |
| `utilities/visitorTracking.ts`, `components/shared/VisitorTracker.tsx` | Client tracker |
| `utilities/dashboardFormat.ts`, `hooks/useListControls.ts` | Dashboard helpers |
| `utilities/pageLayout.ts` | `getLayout` page type |
| `components/admin/*` | Auth provider, login form, masked 404, dashboard UI |
| `pages/mission-control/dashboard/{index,messages,visitors}.tsx` | Dashboard routes |
| `firestore.rules`, `firestore.indexes.json`, `firebase.json` | Firestore config |
| `public/robots.txt` | Disallows `/mission-control` and `/api/` |
| `.env.example` | Env var names (placeholders only) |

**Modified**

- `pages/_app.tsx` — per-page `getLayout`, mounts `VisitorTracker`
- `pages/mission-control/index.tsx` — real login (placeholder removed)
- `pages/mission-control/dashboard.tsx` — removed (replaced by the `dashboard/` folder)
- `components/contact/ContactPageContent.tsx` — submits to `/api/contact`, inline validation, hidden honeypot
- `data/navigation.ts` — dashboard routes, `isMissionControlPath`, Mission Control removed from footer links
- `styles/globals.css` — `.form-notice` (theme-aware status notices)
- `.gitignore` — `.env`, Firebase debug logs, service-account JSON

---

## Firebase setup (first time)

1. Create a project at <https://console.firebase.google.com>.
2. Add a **Web app** and copy its `firebaseConfig` values.
3. **Authentication → Sign-in method → Email/Password → Enable.** Do not add signup UI.
4. **Authentication → Users → Add user** with your admin email and a strong password.
5. Open the user and copy its **UID**.
6. **Firestore Database → Create database** (production mode).
7. **Start collection** `admins` → **Document ID = the UID** from step 5. Optional field `email`. Existence is what grants access.
8. **Project settings → Service accounts → Generate new private key.** This JSON is server-only. Never commit it.
9. Copy `.env.example` to `.env.local`:
   - `NEXT_PUBLIC_FIREBASE_*` ← web app config
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` ← service account JSON (keep the quotes and the `\n` escapes in the key)
10. Set `NEXT_PUBLIC_FIREBASE_ENABLED=true`.
11. Deploy rules: `npx firebase-tools deploy --only firestore:rules` (or paste `firestore.rules` into the Console).
12. Indexes: the dashboard only uses single-field `orderBy` (`createdAt`, `sessionStart`), which Firestore indexes automatically. If the Console asks for an index, follow its link.
13. SMTP (Gmail): enable 2FA, create an **App Password**, then set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=<gmail>`, `SMTP_PASS=<app password>`, `NOTIFY_EMAIL=<where alerts go>`.
14. Add the same env vars in your host (Vercel → Project → Settings → Environment Variables), then redeploy.

---

## Collections

| Collection | ID | Written by | Client access |
| --- | --- | --- | --- |
| `admins` | Auth UID | Console only | Signed-in user may `get` their own doc |
| `contactMessages` | auto | Admin SDK (`/api/contact`) | Admin read/delete |
| `visitorSessions` | session UUID | Admin SDK (`/api/visitors/session`) | Admin read/delete |
| `emailNotifications` | `visitor-session-{id}`, `visitor-ip-{ip}` | Admin SDK | None |

**contactMessages:** `fullName`, `email` (lowercased), `phone`, `company`, `subject`, `message`, `createdAt` (Firestore Timestamp). Optional fields are stored as `""`.

**visitorSessions:** `sessionId`, `ipAddress`, `country`, `city`, `deviceType` (Desktop/Mobile/Tablet/Bot), `deviceBrand`, `deviceModel` (null if unknown), `browser`, `operatingSystem`, `screenSize`, `viewportSize`, `touchSupport`, `referrer`, `landingPage`, `isReturningVisitor`, `visitedPages[]`, `clickedLinks[]`, `sessionStart`, `lastActivity` (ISO strings). Duration is derived in the dashboard as `lastActivity − sessionStart`.

**emailNotifications:** `{ type, sessionId, ipAddress, landingPage, sentAt }`.

---

## Auth flow

1. `/mission-control` shows the login form (honeypot, 2 s minimum form time, 0.8 s minimum typing time, 5 attempts per 60 s per tab, 1 s double-submit guard, Zod validation, optional "remember me").
2. `signInWithEmailAndPassword` runs with local persistence if "remember me" is on, otherwise session persistence. Only the email is remembered in `localStorage`, never the password.
3. The client immediately reads `admins/{uid}`. If it's missing, the user is signed out. If Firestore can't be reached, access is denied (fail closed).
4. `AdminAuthProvider` repeats the same check on every `onAuthStateChanged` event. Only the `authorized` state renders dashboard content.
5. If a guest, a non-admin, or the verification fails, `/mission-control/dashboard/*` renders the normal 404 page.
6. If `NEXT_PUBLIC_FIREBASE_ENABLED` isn't `true` or the keys are missing, the form is disabled with "not configured". There is no fallback login.

reCAPTCHA is not implemented. If you add it, verify the token on the server.

---

## API routes

| Route | Behaviour |
| --- | --- |
| `POST /api/contact` | 503 if the Admin SDK isn't configured · 400 on invalid input · 429 if the per-instance IP limit is hit · otherwise writes the message, tries the email, and returns `{ ok: true }` even if the email fails |
| `POST /api/visitors/session` with `landingPage` | Creates the session. Idempotent: an existing ID is left untouched and gets no second email |
| `POST /api/visitors/session` without `landingPage` (sendBeacon) / `PATCH` | Update: `page`, `link`, `links[]`, `touch`. Always bumps `lastActivity`. Never creates documents (404 if the session is missing) |

Responses never include stack traces or internal error details.

---

## Visitor tracking

- `VisitorTracker` is mounted in `_app`. It skips every `/mission-control*` path and does nothing when `NEXT_PUBLIC_ANALYTICS_ENABLED=false`.
- The session ID comes from `crypto.randomUUID()` and is stored in `sessionStorage`, so it lasts for the tab: it survives reloads but a new tab starts a new session.
- Init runs once per tab and sends device info (parsed user agent, Client Hints, screen and viewport size, touch support, `document.referrer`).
- Route changes send a PATCH with `{ page }`. A repeat of the same path within 1 s is ignored.
- Link clicks are captured in the capture phase. Hash-only links and anything inside `[data-visitor-ignore]` are skipped. Clicks are sent in batches of 5 or after 2 s.
- When the tab is hidden or closed, queued clicks and a `touch` update are sent with `sendBeacon`.
- `isReturningVisitor` comes from a `localStorage` flag that is set after the first successful init.
- IP comes from the first of `x-forwarded-for`, `x-real-ip`, `x-vercel-forwarded-for`, `cf-connecting-ip`. Without any of these it's `127.0.0.1` in development and `unknown` in production.
- Geo comes from `x-vercel-ip-country`/`cf-ipcountry` and `x-vercel-ip-city`. With no headers in development it's `Local` / `Development`. No paid geo API is used.
- Not collected: permissions, GPS, camera/mic, hardware IDs, canvas fingerprints, mouse, scroll, or keystrokes.
- Arrays are capped server-side at 200 pages and 500 links per session.

---

## Email notifications

- **Contact:** subject "{name} filled the contact form on {site name}". The body lists only the non-empty fields, and `replyTo` is the sender.
- **Visitor:** subject "Someone viewed {site name}", with IP, country, city, page opened, and time. It's sent only when a new session document is created.
- **Dedupe:** a Firestore transaction reserves both `visitor-session-{id}` and `visitor-ip-{ip}` before sending. A visitor email is skipped if the session was already notified, or if that IP was notified in the last 24 hours. If SMTP fails, the reservation is removed so a later session can try again.
- If `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` or `NOTIFY_EMAIL` is missing, emails are silently skipped.

---

## Dashboard

- `/mission-control/dashboard` redirects to `/messages` (admins only).
- The stat cards show total messages, total visitors, page views (the sum of `visitedPages`), and today's visitors (by local date of `sessionStart`).
- **Messages:** realtime list with search, sort, page size, pagination, CSV export, a view dialog with a "reply by email" link, and delete with confirmation.
- **Visitors:** realtime list with masked IPs (reveal/copy), location, device, page pills, click count, duration, and last activity. A session shows as "Active" if its last activity was under 5 minutes ago. Each row has a detail dialog and delete with confirmation.
- Only the latest 1,000 sessions are loaded, and the visitor total shows `1000+` when that cap is reached.

---

## Security rules

See `firestore.rules`. Browsers can't create or update any of these collections. Admins (signed in, with an existing `admins/{uid}` doc) can read and delete `contactMessages` and `visitorSessions`. `emailNotifications` and everything else are closed. The Admin SDK bypasses these rules, which is why all public writes go through the API routes.

Quick check: when logged out, `getDocs(collection(db, "contactMessages"))` in the browser must fail with `permission-denied`.

---

## Environment variables (names only)

Public: `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`, `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`, `NEXT_PUBLIC_FIREBASE_ENABLED`, `NEXT_PUBLIC_ANALYTICS_ENABLED`, `NEXT_PUBLIC_SITE_URL`

Server only: `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `NOTIFY_EMAIL`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

---

## Test checklist

- [ ] Public site loads with Firebase env removed (the tracker gets a 503 and stops quietly).
- [ ] Contact form shows success, a doc appears in `contactMessages`, and one email arrives.
- [ ] A second submission creates one more doc and sends one more email.
- [ ] Browsing creates one `visitorSessions` doc, the pages and clicks arrays grow, and one visitor email arrives.
- [ ] Reloading the same tab creates no new session and sends no new email.
- [ ] A new tab from the same IP within 24 h creates a new session but sends no email.
- [ ] A non-whitelisted Firebase user gets a generic login error, and the dashboard shows the 404.
- [ ] A whitelisted user gets the dashboard with realtime updates, and deletes work after confirmation.
- [ ] Logged-out browser reads of the collections are denied.

## Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| `503` from `/api/contact` or `/api/visitors/session` | `FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY` missing or malformed |
| Login says "not configured" | `NEXT_PUBLIC_FIREBASE_ENABLED` isn't `true`, or a public key is missing (restart `next dev` after editing env) |
| Dashboard shows 404 after a correct password | No `admins/{uid}` doc for that user, or the rules weren't deployed |
| "Messages unavailable" in the dashboard | Rules reject the read (whitelist doc missing) or network issues |
| No emails | SMTP vars missing, wrong Gmail App Password, or the visitor IP was already notified in the last 24 h |
| Country/City show `Local / Development` or `unknown` | Running on localhost, or the host doesn't send Vercel/Cloudflare geo headers |
| `Invalid PEM formatted message` | The private key lost its `\n` escapes or quotes in the env var |
