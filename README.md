# Phi Mu Professor Reviews

A password-protected, Rate-My-Professors-style site for a Phi Mu chapter. Reviews live in the
chapter's Notion workspace (a submission form feeds them in, she approves them in Notion), and this
site reads them through the Notion API.

**Stack:** Next.js 16 (App Router, Cache Components), Tailwind v4, no database of our own.

## What it does

| Page | Route | Notes |
| --- | --- | --- |
| Directory | `/` | Search by professor name or course code (`ACCT 201`, `acct201`, `acct-201` all work). Filter by college and department. Sort by name, rating, review count. |
| Professor profile | `/professors/[slug]` | Average rating, % would take again, average difficulty, review count, and every **approved** review. |
| Updates & Resources | `/updates` | Posts she writes in a Notion database: important dates, links, announcements. Pinned items float to the top. |
| Login | `/login` | One shared password for the whole site. Session lasts 30 days. |

Everything is behind the password except `/login`. Notion data is cached for one minute, so a newly
approved review shows up within about a minute without a redeploy.

## Running it locally

```bash
npm install
cp .env.example .env.local   # then edit it
npm run dev
```

With no `NOTION_TOKEN` set the site runs on built-in sample data (`src/lib/mock-data.ts`), so you can
develop and demo without her workspace. The dev password in `.env.local` is whatever you set for
`SITE_PASSWORD`.

## Going live checklist

1. **Notion access.** Follow [docs/NOTION-SETUP.md](docs/NOTION-SETUP.md). You end up with a token and
   three database IDs for `.env.local` (and the host's environment variables).
2. **Match the column names.** Open `src/lib/config.ts` and make `notionSchema` match her actual
   property names. The readers are tolerant of property *types*, but the *names* must match.
3. **Logo.** Replace `public/logo.svg` with her file (or change `site.logoPath`). Then tune the
   colour tokens at the top of `src/app/globals.css` to match it.
4. **Password + secret.** Set `SITE_PASSWORD` to whatever she wants to hand out, and `SESSION_SECRET`
   to `openssl rand -hex 32`.
5. **Submission form link.** Set `NEXT_PUBLIC_SUBMIT_REVIEW_URL` to her Notion form URL to show a
   "Submit a review" button on the directory.
6. **Deploy.** See [docs/HOSTING-AND-DOMAIN.md](docs/HOSTING-AND-DOMAIN.md).

## Project layout

```
src/
  proxy.ts                 password gate (runs before every page)
  lib/
    config.ts              site name, logo path, Notion column names  <- edit this first
    data.ts                cached data layer: getProfessors / getProfessorBySlug / getUpdates
    notion.ts              tiny Notion REST client + tolerant property readers
    mock-data.ts           sample data used when Notion isn't configured
    auth.ts                cookie signing / password check
  app/
    login/                 login page + form
    api/login, api/logout  set / clear the session cookie
    (site)/                everything behind the password (shared header)
      page.tsx             directory
      professors/[slug]/   profile
      updates/             updates & resources
  components/              UI pieces
docs/                      Notion setup, hosting + domain explainer, call notes
```

## Useful commands

```bash
npm run dev      # local dev at http://localhost:3000
npm run build    # production build (also validates caching/Suspense rules)
npm run lint
npx tsc --noEmit
```
