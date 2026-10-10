# PortfolioHub — Developer Portfolio Builder

A portfolio creation and publishing tool for developers and students. Configure
your profile, pick a color theme, add a skills matrix and a projects showcase
with live GitHub star counts, write devlogs in a Markdown blog, collect
messages through a contact form, publish to a shareable URL, track visitors,
and export your whole portfolio as a PDF — all from one dashboard.

**Live app:** https://portfoliohub-fbcda.web.app (Firebase Hosting, with Firebase Auth and Firestore).

Built and tested by [Surya Prasanth G](https://surya-prasanth-dev.netlify.app). Before release I tested the live app, logged 14 bugs and fixed them, including Firestore security rules so draft profiles and contact messages stay private, publish validation and login usability.

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL. **No setup is required** — the app runs against a
built-in local demo backend (localStorage) with a sample portfolio already
seeded at `/p/alex-demo`, so every feature is explorable immediately:

1. Click **Sign in → Create account** to make your own portfolio.
2. Fill in **Profile**, add a few **Skills**, a **Project** (any public GitHub
   repo — its star count is fetched live from the GitHub API), and a **Blog**
   post.
3. Go to **Publish** and copy your shareable link (`/p/your-username`).
4. Open that link — it's your live public portfolio, complete with a
   **Download PDF** button, a working contact form, and (once you're viewing
   as a signed-out visitor) analytics tracking.

## What's implemented

- **Profile & theming** — display name, headline, bio, avatar (auto-compressed
  before upload), social links, and six color themes applied instantly via CSS
  custom properties.
- **Skills matrix** — skills grouped by category with a 5-level proficiency
  indicator.
- **Projects showcase** — add a GitHub repo (`owner/repo` or a full URL); star
  count, fork count, and primary language are fetched live from the public
  GitHub REST API (cached for an hour) both in the dashboard and on the public
  page itself.
- **Blog / devlog module** (the core module spec):
  - `react-md-editor` split-pane Markdown editor with live preview.
  - Post fields: title, Markdown body, cover image (compressed + uploaded to
    Firebase Storage, or kept as a local data URL on the demo backend),
    comma-separated tags, Draft/Published status, and reading time
    auto-calculated as `ceil(word count / 200)`.
  - Published posts appear in the public **Blog** section, newest first.
  - Post detail pages render Markdown with `react-markdown`, GitHub-flavored
    Markdown (`remark-gfm`), and syntax-highlighted code blocks
    (`rehype-highlight` + `highlight.js`).
  - An automatic table of contents is generated from H2/H3 headings and shown
    as a sticky sidebar, with active-section highlighting and matching anchor
    ids (`rehype-slug` / `github-slugger`).
  - A reading progress bar fixed to the top of the page fills as
    `window.scrollY / document.body.scrollHeight`.
  - The editor auto-saves the in-progress draft to `localStorage` every 30
    seconds with a "Draft auto-saved" indicator, and offers to restore it if
    you navigate away and come back.
- **Contact form + inbox** — a public contact form on every portfolio; messages
  land in the owner's dashboard inbox (read/unread, delete).
- **Analytics** — portfolio and post views are logged per visitor; the
  dashboard shows total/unique views, a 14-day trend chart, and a top-posts
  breakdown.
- **Publish flow** — toggle your portfolio public/private and get a unique
  shareable URL (`/p/username`); a banner walks through deploying for real on
  Firebase Hosting.
- **One-click PDF export** — `html2canvas` + `jsPDF` turn the live public
  portfolio into a downloadable, paginated PDF.

## Running against a real Firebase project

By default every read/write in `src/lib/db.js`, `storage.js`, and `auth.js`
goes to a small localStorage-backed mock (see `src/lib/localStore.js`) so you
can develop with zero setup. To go live:

1. Create a Firebase project and register a web app.
2. Copy `.env.example` to `.env` and fill in the six `VITE_FIREBASE_*` values
   from your app's config.
3. Enable **Authentication** (Email/Password), **Firestore**, and **Storage**
   in the Firebase console.
4. Deploy security rules and indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
5. (Optional) Deploy the Cloud Functions in `functions/` — a contact-message
   notification hook and an analytics view-count aggregator:
   ```bash
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```
6. Build and deploy the site itself:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

No other code changes are needed — `isFirebaseConfigured` (in
`src/lib/firebase.js`) flips every data-access module over to the real
Firebase SDKs automatically once the env vars are present.

## Project structure

```
src/
  lib/          Data-access layer (db, storage, auth, github, analytics,
                 image compression, TOC/reading-time, PDF export) —
                 mock-backend/Firebase switch lives here
  context/       Auth + Profile React context
  data/          Color themes, demo seed data
  components/
    dashboard/   Owner-facing editors (profile, skills, projects, blog,
                 inbox, analytics, publish)
    portfolio/   Public-facing sections (hero, skills, projects, blog list,
                 contact form, PDF button)
    blog/        Markdown rendering, table of contents, reading progress bar
  pages/         Routes: Home, Login, Dashboard, PublicPortfolio,
                 PublicPostDetail, NotFound
functions/       Optional Cloud Functions (contact notification, view-count
                 aggregation)
firebase.json, firestore.rules, firestore.indexes.json, storage.rules
```

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build to `dist/` (code-split, `BrowserRouter`) — deploy this to Firebase Hosting or any static host with an SPA rewrite rule
- `npm run build:artifact` — single self-contained `dist-artifact/index.artifact.html` (`MemoryRouter`, everything inlined) sized for publishing as one hosted page, e.g. via Claude/Cowork's Artifact tool; run `node scripts/build-artifact-fragment.mjs` afterwards to produce `dist-artifact/fragment.html`, the body-only version some publish flows expect
- `npm run preview` — preview the production build locally
- `npm run lint` — run oxlint
