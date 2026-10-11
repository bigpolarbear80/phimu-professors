# Notion setup

The site reads three Notion databases. She already has the first two (connected, with a form feeding
reviews in). The third is a small new one for the updates page.

## 1. Create an integration and share the databases with it

1. Go to https://www.notion.so/my-integrations while logged into **her** workspace (or have her do it
   and send the token).
2. **New integration** → name it "Phi Mu Reviews Site", type *Internal*. Capabilities: **Read content**
   only. Copy the *Internal Integration Secret*; that is `NOTION_TOKEN`.
3. For each of the three databases: open it as a full page → `•••` menu → **Connections** → add
   "Phi Mu Reviews Site". (If the Reviews DB lives inside the Professors page, sharing the parent
   page covers both, but share each explicitly to be safe.)
4. Grab each database ID: the 32-character hex string in the URL before the `?v=`.
   `https://www.notion.so/<workspace>/<DATABASE_ID>?v=...` → that's `NOTION_PROFESSORS_DB` etc.

## 2. Her actual databases (confirmed 2026-10-11)

| Database | ID | Where |
| --- | --- | --- |
| Professor Database | `3ab81544dae280baa5a4d473b5dca55a` | child of the "Phi Mu Professor Reviews" page |
| Reviews | `39e81544dae28027ae1ff9793809225f` | has views All / Pending / Approved |
| Updates | (not created yet) | new database to add for the Updates page |

Reviews come in through a Tally form (https://tally.so/r/WO6Z4e) with: Professor Name, Course Number,
Department, College, Rating 1-5, Would you take again (Yes/Maybe/No), Written Review. Tally writes a row
into **Reviews**; she ticks **Approved** to publish it.

**Professor Database columns:** Name (title), Department (select), College (select), plus rollups
(Average Rating, Number of Reviews, Would Take Again?, Rating) and a `Reviews` relation. We ignore the
rollups and compute stats ourselves.

**Reviews columns:** Professor Name (title), Major Category (select = college), Department (select),
Course (text, e.g. `HIST 307`), Rating (number), Would Take Again (select Yes/Maybe/No), Review (text),
Approved (checkbox), Professor Database (relation -> Professor Database), Average Rating, Reviews
(unused).

`src/lib/config.ts` is already set to these names. "Maybe" counts as not-yes in the % would take again
figure, and the Yes/Maybe/No label is shown on each review.

## 2b. Generic reference (what the readers accept)

Column names are configurable in `src/lib/config.ts` (`notionSchema`). Types listed are what the
reader understands; the first is the recommended one.

### Professors
| Column | Type | Notes |
| --- | --- | --- |
| Name | title | required |
| College | select (or text) | used for the College filter |
| Department | select (or text) | used for the Department filter |
| Courses | multi-select (or text like "ACCT 201, ACCT 202") | optional; courses from reviews are merged in automatically |
| Notes | text | optional short bio shown on the profile |

### Reviews
| Column | Type | Notes |
| --- | --- | --- |
| Professor | relation → Professors | required |
| Course | text / select | e.g. `ACCT 201` |
| Rating | number 1–5 | required |
| Difficulty | number 1–5 | optional |
| Would Take Again | checkbox (or select Yes/No) | optional |
| Review | text | the written review |
| Semester | text / select | optional, e.g. `Fall 2025` |
| Status | select | **only rows equal to `Approved` are shown.** If her column is a Notion *status* type instead of a *select*, the code already falls back to that. |
| Submitted | created time / date | optional; used to sort reviews newest first |

Her approval workflow stays in Notion: form submission lands with Status = Pending (or empty); she
flips it to Approved; it appears on the site within a minute.

### Updates (new, for the Updates & Resources page)
| Column | Type | Notes |
| --- | --- | --- |
| Name | title | headline |
| Date | date | shown and used for ordering |
| Body | text | the post. Line breaks are preserved. |
| Link | url | optional "Open link" button |
| Category | select | optional, e.g. Important Date / Resource / How-To |
| Pinned | checkbox | optional; pinned posts sit at the top |
| Published | checkbox | optional; if the column exists, only checked rows show |

## 3. Plug it in

```
NOTION_TOKEN=secret_xxx
NOTION_PROFESSORS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_REVIEWS_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_UPDATES_DB=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Restart `npm run dev`. If a professor shows with no college/department or reviews don't attach, the
column names in `config.ts` don't match hers; the server log will show the Notion error if the token
or ID is wrong.

## Notion API limits worth knowing
- 3 requests/second. We cache for a minute and paginate 100 rows at a time, so a chapter-sized
  dataset is a handful of requests per minute at most.
- Rich text is truncated to 2,000 characters per property by the API, which is fine for reviews.
