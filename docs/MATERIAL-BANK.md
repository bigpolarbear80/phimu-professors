# Material Bank

A tab where sisters share syllabi, notes, study guides, practice tests, and homework. Same flow as
reviews: a Tally form drops each upload into a Notion database, she ticks **Approved**, and it shows up
on the site within about a minute.

## Notion database (already created, 2026-10-14)

**Material Bank** in the "Phi Mu's Space HQ" teamspace. ID `3fa81544dae28004b124d61eeb4e628b`
(set as `NOTION_MATERIALS_DB` locally and on Vercel).

| Column | Type | Filled by |
| --- | --- | --- |
| Name | title | form: "Title" |
| Course | text | form: "Course code" |
| Professor | text | form: "Professor" |
| Subject | select | form: "Subject" |
| Type | select | form: "Type of material" |
| Description | text | form: "Short description" |
| File | files & media | form: file upload |
| Link | URL | form: optional link |
| Approved | checkbox | **her**, to publish |

Only rows with **Approved** ticked appear on the site. Rows need a title plus a file or a link.

**Still to do:** the "Phi Mu Academics website" connection needs access to this database
(Material Bank page → ••• → Connections → add it). Until then the tab shows "Nothing here yet."

## Tally form to create

Title: **Phi Mu Material Bank**

Intro text (paste as-is, she can edit):

> Share something that helped you in a class! Syllabi, your own notes, study guides, practice tests
> you made, and homework are all welcome.
>
> Please **don't** upload: PowerPoint slides or anything the professor made, real test or quiz
> documents, or very large files (keep it under 10 MB). Everything is reviewed before it goes on the
> site.

Questions, in order:

1. **Title** (short answer, required). Help text: "e.g. ACCT 201 Exam 1 study guide"
2. **Course code** (short answer, required). Help text: "Abbreviated, like ACCT 201"
3. **Professor** (short answer, optional). Help text: "First and last name, no Dr./Prof."
4. **Subject** (dropdown, required): Business, Liberal Arts, Engineering, Education & Human
   Development, Sciences, Nursing & Health Sciences, General Studies, Arts. *(Swap in her own list if
   she sends one; the site builds its "Browse by subject" menu from whatever values exist.)*
5. **Type of material** (multiple choice, required): Syllabus, Notes, Study Guide, Practice Test,
   Homework, Other
6. **Short description** (long answer, optional)
7. **Upload your file** (file upload, optional, allow multiple, PDF / images / Word). Tally's free plan
   caps each file at 10 MB.
8. **Or paste a link** (link / URL, optional). Help text: "Google Drive or similar, if the file is too
   big to upload. Make sure sharing is set to anyone with the link."

Then **Integrations → Notion → connect → choose "Material Bank"** and map each question to the column
with the same name (table above). Leave **Approved** unmapped so new uploads start unchecked.

When the form is published, set its share link as `NEXT_PUBLIC_SUBMIT_MATERIAL_URL` on Vercel (and
redeploy) to show an "Add to the bank" button on the tab.

## How files are served

Tally can hand files to Notion either as Notion-hosted uploads or as Tally-hosted links. Both work:

- Tally/external links are used directly.
- Notion-hosted file links expire after about an hour, so the site never links to them directly. The
  download button goes through `/api/file/<pageId>/<n>`, which asks Notion for a fresh link at click
  time. That route sits behind the site password like everything else.

## Matching to professor pages

A material appears on a professor's page if its Professor field matches the professor's name
(case and punctuation ignored) or its course code is one that professor teaches.
