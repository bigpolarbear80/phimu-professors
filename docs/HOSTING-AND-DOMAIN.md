# Hosting and domain

## Hosting

This is a Next.js app with server-side code (the password gate and the Notion fetches), so it needs
a host that runs Node, not plain static hosting.

**Recommendation: Vercel, free (Hobby) tier.** Zero config for Next.js 16, free HTTPS, Node included.
A sorority's traffic is nowhere near the free limits. Steps:

1. Push this repo to GitHub.
2. vercel.com → Add New Project → import the repo.
3. Add the environment variables from `.env.example` (SITE_PASSWORD, SESSION_SECRET, NOTION_*).
4. Deploy. Every push to `main` redeploys.

If our own hosting is preferred, it needs Node 20+ and the ability to run `npm run build && npm run
start` (or a Docker container). Shared PHP/cPanel-style hosting will **not** work; that's the "small
Node plan" question from the brief. Netlify and Cloudflare Pages also run Next.js but need an adapter
and are more hassle than Vercel for this.

## Explaining "domain" on the call

Plain-English version:

> A domain is the web address people type to get to the site, like `phimureviews.com`. Right now the
> site would live at an automatic address the host gives us (something like
> `phimu-professors.vercel.app`), which works fine but is hard to remember and looks less official.
> Buying a domain is like registering a name for it. It costs around $10–15 a year, you renew it like
> a subscription, and it's yours as long as you keep paying.

What she needs to decide:
1. **Whether she wants one at all.** The free `*.vercel.app` address works and is password-protected
   just the same. A custom domain is purely nicer-looking.
2. **The name.** Something short the sisters will remember. Chapter name + "reviews" or "profs" is a
   good pattern. We can check availability live on the call.
3. **Who pays and owns it.** Best if *she* (or the chapter) buys it on her own account so it doesn't
   depend on us. We'll walk her through pointing it at the host (two DNS records, five minutes).

Where to buy: Cloudflare Registrar (cheapest, no upsells), Namecheap, or Google/Squarespace Domains.
Avoid GoDaddy's add-ons.

## Password notes for her
- One password for everyone. To change it, update `SITE_PASSWORD` in the host's env vars and redeploy;
  everyone gets logged out and types the new one.
- Reviews only appear once marked Approved in Notion, so the password is the only gate and she stays in
  control of content from Notion.
