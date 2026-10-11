/**
 * Site-wide settings. Everything that is likely to change once the client
 * sends her assets or we see her real Notion schema lives here.
 */

export const site = {
  name: "Phi Mu Academics",
  shortName: "Phi Mu Academics",
  tagline: "Professor and course reviews by Phi Mu sisters, for Phi Mu sisters.",
  /** Drop the real logo at public/logo.svg (or .png and update this path). */
  logoPath: "/logo-small.png",
  /** Where she posts new reviews. Shown as a button on the directory page. */
  submitReviewUrl: process.env.NEXT_PUBLIC_SUBMIT_REVIEW_URL ?? "https://tally.so/r/WO6Z4e",
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
    college: "College",           // select
    department: "Department",     // select
    courses: "Courses",           // (not present in her DB; courses come from reviews)
    bio: "Notes",                 // (optional, not present yet)
    email: "Email",               // (optional, not present yet)
    // Rollups on her Professor Database. Only used as a fallback when the
    // Reviews database can't be read (e.g. the connection lacks access).
    rollupAverage: "Average Rating",
    rollupCount: "Number of Reviews",
    rollupWouldTakeAgain: "Would Take Again?",
  },
  reviews: {
    professor: "Professor Database", // relation -> Professors (falls back to the first relation property)
    course: "Course",             // rich_text, e.g. "HIST 307"
    rating: "Rating",             // number 1-5
    difficulty: "Difficulty",     // (not present; shown only if added later)
    wouldTakeAgain: "Would Take Again", // select: Yes / Maybe / No
    comment: "Review",            // rich_text
    semester: "Semester",         // (not present; shown only if added later)
    /** Approval gate: only rows where this checkbox is ticked are published. */
    status: "Approved",           // checkbox
    statusType: "checkbox" as "checkbox" | "select" | "status",
    approvedValue: "Approved",    // only used when statusType is select/status
    submitted: "Submitted",       // (not present; falls back to the page's created time)
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
