/**
 * Site-wide settings. Everything that is likely to change once the client
 * sends her assets or we see her real Notion schema lives here.
 */

export const site = {
  name: "Phi Mu Professor Reviews",
  shortName: "Phi Mu Reviews",
  tagline: "Sister-sourced reviews of professors and courses.",
  /** Drop the real logo at public/logo.svg (or .png and update this path). */
  logoPath: "/logo.svg",
  /** Where she posts new reviews. Shown as a button on the directory page. */
  submitReviewUrl: process.env.NEXT_PUBLIC_SUBMIT_REVIEW_URL ?? "",
  /** Name of the login cookie. */
  sessionCookie: "pm_session",
  /** How long a login lasts, in seconds (30 days). */
  sessionMaxAge: 60 * 60 * 24 * 30,
};

/**
 * Names of the properties in her Notion databases. Adjust these to match the
 * exact column names once we have access. Each entry lists the property types
 * the mapper understands, so most reasonable setups work without code changes.
 */
export const notionSchema = {
  professors: {
    name: "Name",                 // title
    college: "College",           // select | multi_select | rich_text | relation(title)
    department: "Department",     // select | multi_select | rich_text | relation(title)
    courses: "Courses",           // multi_select | rich_text ("ACCT 201, ACCT 202") | relation
    bio: "Notes",                 // rich_text (optional)
    email: "Email",               // email | rich_text (optional)
  },
  reviews: {
    professor: "Professor",       // relation -> Professors
    course: "Course",             // rich_text | select | relation(title)
    rating: "Rating",             // number (1-5) | select ("5") | formula
    difficulty: "Difficulty",     // number (1-5) (optional)
    wouldTakeAgain: "Would Take Again", // checkbox | select ("Yes"/"No") | formula
    comment: "Review",            // rich_text | title
    semester: "Semester",         // rich_text | select (optional, e.g. "Fall 2025")
    status: "Status",             // select | status  -> must equal approvedValue
    approvedValue: "Approved",
    submitted: "Submitted",       // created_time | date (optional)
  },
  updates: {
    title: "Name",                // title
    date: "Date",                 // date
    body: "Body",                 // rich_text
    link: "Link",                 // url (optional)
    category: "Category",         // select (optional, e.g. "Important Date", "Resource")
    pinned: "Pinned",             // checkbox (optional)
    published: "Published",       // checkbox (optional; if the column exists, only checked rows show)
  },
} as const;
