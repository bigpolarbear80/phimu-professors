# Discovery call checklist

Things to get or confirm with her. Everything else is already built against sample data.

## Must-haves to go live
- [ ] Notion integration token + the three database IDs (see NOTION-SETUP.md). Easiest: screen-share
      and do it together, takes ten minutes.
- [ ] Exact column names in her Professors and Reviews databases (screenshot of each DB is enough).
- [ ] How she marks a review approved today (column name + value). We only show approved rows.
- [ ] Logo file (SVG or high-res PNG). Any brand colours she wants matched.
- [ ] The shared password she wants to hand out.
- [ ] The review submission form URL, so the site can link to it.

## Decisions
- [ ] Domain: wants one or fine with the free host address? If yes, name ideas + who buys it.
- [ ] Hosting: Vercel free tier (recommended) vs our hosting.
- [ ] Site name / tagline for the header (currently "Phi Mu Professor Reviews").
- [ ] Should the Updates page show a "Published" checkbox gate, or is everything in that DB live?

## Nice-to-haves (not built, easy to add later)
- Course pages (all reviews for `ACCT 201` across professors).
- "Most recent reviews" strip on the home page.
- Tags on reviews (attendance required, heavy homework, etc.).
- Rich text / images in Updates posts (would read Notion page blocks instead of a text column).
