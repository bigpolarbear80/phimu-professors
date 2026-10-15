import type { Material, Professor, Review, Update } from "./types";

/**
 * Sample data used when NOTION_TOKEN is not set (or USE_MOCK_DATA=true).
 * Shaped exactly like what the Notion mapper produces, so the UI is built
 * against the real contract. Replace nothing here when going live; just add
 * the Notion env vars.
 */

export const mockProfessors: Professor[] = [
  { id: "p1", slug: "sarah-whitfield", name: "Sarah Whitfield", college: "College of Business", department: "Accounting", courses: ["ACCT 201", "ACCT 202"], bio: "Teaches the intro accounting sequence. Known for detailed study guides.", email: "" },
  { id: "p2", slug: "daniel-okafor", name: "Daniel Okafor", college: "College of Business", department: "Finance", courses: ["FIN 301", "FIN 410"], bio: "", email: "" },
  { id: "p3", slug: "maria-castellanos", name: "Maria Castellanos", college: "College of Business", department: "Marketing", courses: ["MKT 300", "MKT 345"], bio: "Project-heavy classes with real client work.", email: "" },
  { id: "p4", slug: "james-holloway", name: "James Holloway", college: "College of Arts & Sciences", department: "Biology", courses: ["BIOL 101", "BIOL 102", "BIOL 310"], bio: "", email: "" },
  { id: "p5", slug: "priya-raman", name: "Priya Raman", college: "College of Arts & Sciences", department: "Chemistry", courses: ["CHEM 101", "CHEM 102"], bio: "Weekly quizzes; labs count for a lot.", email: "" },
  { id: "p6", slug: "thomas-greer", name: "Thomas Greer", college: "College of Arts & Sciences", department: "English", courses: ["ENGL 101", "ENGL 220"], bio: "", email: "" },
  { id: "p7", slug: "angela-brooks", name: "Angela Brooks", college: "College of Arts & Sciences", department: "Psychology", courses: ["PSYC 101", "PSYC 240"], bio: "Lecture slides posted the night before.", email: "" },
  { id: "p8", slug: "robert-lindqvist", name: "Robert Lindqvist", college: "College of Arts & Sciences", department: "Mathematics", courses: ["MATH 120", "MATH 140"], bio: "", email: "" },
  { id: "p9", slug: "kelly-nguyen", name: "Kelly Nguyen", college: "College of Education", department: "Elementary Education", courses: ["EDUC 200", "EDUC 310"], bio: "", email: "" },
  { id: "p10", slug: "marcus-bell", name: "Marcus Bell", college: "College of Communication", department: "Journalism", courses: ["JOUR 210", "JOUR 330"], bio: "Former newspaper editor. Strict on deadlines.", email: "" },
  { id: "p11", slug: "elena-petrova", name: "Elena Petrova", college: "College of Nursing", department: "Nursing", courses: ["NURS 201", "NURS 305"], bio: "", email: "" },
  { id: "p12", slug: "william-hargrove", name: "William Hargrove", college: "College of Engineering", department: "Computer Science", courses: ["CS 101", "CS 215"], bio: "", email: "" },
];

const r = (
  id: string,
  professorId: string,
  course: string,
  rating: number,
  difficulty: number,
  wouldTakeAgain: boolean,
  semester: string,
  comment: string,
  submittedAt: string,
): Review => ({ id, professorId, course, rating, difficulty, wouldTakeAgain, wouldTakeAgainLabel: wouldTakeAgain ? "Yes" : "No", comment, semester, submittedAt });

export const mockReviews: Review[] = [
  r("r1", "p1", "ACCT 201", 5, 3, true, "Fall 2025", "Genuinely the best intro accounting teacher. Her study guides are basically the exam. Go to office hours, she will walk you through anything.", "2025-12-10"),
  r("r2", "p1", "ACCT 201", 4, 3, true, "Spring 2025", "Lots of homework but it is all on Connect and you get multiple attempts. Exams are fair if you do the practice sets.", "2025-05-02"),
  r("r3", "p1", "ACCT 202", 4, 4, true, "Fall 2025", "202 is harder than 201 but she curves. Sit near the front, she notices.", "2025-12-12"),
  r("r4", "p2", "FIN 301", 3, 4, false, "Spring 2025", "Knows his stuff but moves fast. Record the lectures if you can. Exams are mostly calculation problems.", "2025-05-05"),
  r("r5", "p2", "FIN 301", 4, 4, true, "Fall 2025", "Tough but fair. The cheat sheet he allows on exams is the key, make it dense.", "2025-12-08"),
  r("r6", "p3", "MKT 300", 5, 2, true, "Fall 2025", "So fun. Group project with a real local business. Easy A if you show up and participate.", "2025-12-01"),
  r("r7", "p3", "MKT 345", 5, 3, true, "Spring 2025", "Best class I have taken. She writes great recommendation letters too.", "2025-05-10"),
  r("r8", "p4", "BIOL 101", 2, 4, false, "Fall 2025", "Reads straight from the slides. Exams pull from the textbook, not lecture, so read the chapters.", "2025-12-03"),
  r("r9", "p4", "BIOL 102", 3, 4, false, "Spring 2025", "Lab TA was better than the lecture honestly. Attendance is not taken.", "2025-05-01"),
  r("r10", "p4", "BIOL 310", 4, 5, true, "Fall 2025", "Upper level is a different experience, he is way more engaged. Hard class though.", "2025-12-14"),
  r("r11", "p5", "CHEM 101", 4, 4, true, "Fall 2025", "Weekly quizzes keep you honest. Clear about expectations and posts answer keys.", "2025-12-05"),
  r("r12", "p5", "CHEM 102", 4, 5, true, "Spring 2025", "Organic prep is brutal but she holds extra review sessions before every exam.", "2025-05-06"),
  r("r13", "p6", "ENGL 101", 5, 1, true, "Fall 2025", "Super chill. Three essays and a short presentation. Gives feedback on drafts if you ask.", "2025-12-02"),
  r("r14", "p6", "ENGL 220", 4, 2, true, "Spring 2025", "Discussion-based. You do have to actually do the reading.", "2025-05-03"),
  r("r15", "p7", "PSYC 101", 5, 2, true, "Fall 2025", "Posts slides before class, exams come straight from them. Interesting lectures.", "2025-12-09"),
  r("r16", "p7", "PSYC 240", 4, 3, true, "Fall 2024", "Research methods was dry but she made it manageable. Weekly SPSS homework.", "2024-12-11"),
  r("r17", "p8", "MATH 120", 2, 4, false, "Fall 2025", "Heavy accent and no partial credit. Use the tutoring center.", "2025-12-04"),
  r("r18", "p8", "MATH 140", 3, 4, false, "Spring 2025", "Fair exams, but lectures are hard to follow. Khan Academy got me through.", "2025-05-04"),
  r("r19", "p9", "EDUC 200", 5, 1, true, "Fall 2025", "Warm, organized, and genuinely cares. Field observation hours are the main workload.", "2025-12-06"),
  r("r20", "p10", "JOUR 210", 4, 3, true, "Fall 2025", "Deadlines are deadlines, no exceptions. You will come out a much better writer.", "2025-12-07"),
  r("r21", "p10", "JOUR 330", 3, 4, false, "Spring 2025", "Great industry stories but grading felt inconsistent.", "2025-05-07"),
  r("r22", "p11", "NURS 201", 4, 4, true, "Fall 2025", "Strict but she prepares you for clinicals. ATI practice questions are a must.", "2025-12-11"),
  r("r23", "p11", "NURS 305", 5, 4, true, "Spring 2025", "Hard class but she is the reason I passed. Office hours are gold.", "2025-05-08"),
  r("r24", "p12", "CS 101", 4, 2, true, "Fall 2025", "Good intro even with no coding background. Weekly labs, two projects.", "2025-12-13"),
  r("r25", "p12", "CS 215", 3, 5, false, "Spring 2025", "Data structures is just hard. He is helpful on the class Discord though.", "2025-05-09"),
  r("r26", "p1", "ACCT 201", 5, 2, true, "Fall 2024", "Took her as a freshman and she made accounting click. Highly recommend.", "2024-12-13"),
  r("r27", "p3", "MKT 300", 4, 2, true, "Fall 2024", "Fun and practical. Lots of group work so pick your team wisely.", "2024-12-10"),
];

export const mockUpdates: Update[] = [
  { id: "u1", title: "Spring registration opens Nov 3", date: "2025-11-03", body: "Priority registration for juniors and seniors opens at 7am. Sophomores Nov 4, freshmen Nov 5. Check your Degree Works audit before your time slot and have two backup classes ready.", link: "", category: "Important Date", pinned: true },
  { id: "u2", title: "How to submit a review", date: "2025-10-20", body: "Reviews go through the submission form linked at the top of the directory. They show up here once they are approved, usually within a day or two. Keep it honest and keep it about the class.", link: "", category: "How-To", pinned: true },
  { id: "u3", title: "Free tutoring at the Learning Commons", date: "2025-10-15", body: "Drop-in tutoring for ACCT, CHEM, MATH, and BIOL runs Sunday through Thursday, 4 to 9pm, second floor of the library. No appointment needed.", link: "https://example.edu/tutoring", category: "Resource", pinned: false },
  { id: "u4", title: "Last day to drop with a W: Oct 31", date: "2025-10-31", body: "After this date a drop shows as a WF. If you are on the fence about a class, talk to your advisor this week.", link: "", category: "Important Date", pinned: false },
  { id: "u5", title: "Study room reservations", date: "2025-10-08", body: "The chapter study room can be reserved in two-hour blocks through the Notion calendar. Finals week priority goes to seniors.", link: "https://example.com/study-room", category: "Resource", pinned: false },
];

export const mockMaterials: Material[] = [
  { id: "m1", title: "ACCT 201 syllabus, Fall 2025", course: "ACCT 201", professor: "Sarah Whitfield", subject: "Business", type: "Syllabus", description: "Current syllabus with the exam schedule and grading breakdown.", files: [{ name: "ACCT201-syllabus-F25.pdf", kind: "external", url: "https://example.com/acct201-syllabus.pdf" }], link: "", submittedAt: "2025-09-02" },
  { id: "m2", title: "ACCT 201 exam 1 study guide", course: "ACCT 201", professor: "Sarah Whitfield", subject: "Business", type: "Study Guide", description: "Covers chapters 1 to 4. Made from her review session notes.", files: [{ name: "exam1-study-guide.pdf", kind: "external", url: "https://example.com/acct201-exam1.pdf" }], link: "", submittedAt: "2025-09-28" },
  { id: "m3", title: "CHEM 101 lecture notes (full semester)", course: "CHEM 101", professor: "Priya Raman", subject: "Sciences", type: "Notes", description: "Typed notes from every lecture. Diagrams included.", files: [{ name: "CHEM101-notes.pdf", kind: "external", url: "https://example.com/chem101-notes.pdf" }], link: "", submittedAt: "2025-12-05" },
  { id: "m4", title: "BIOL 101 practice test, unit 2", course: "BIOL 101", professor: "James Holloway", subject: "Sciences", type: "Practice Test", description: "Self-made practice questions in the format he uses.", files: [{ name: "biol101-unit2-practice.pdf", kind: "external", url: "https://example.com/biol101-practice.pdf" }], link: "", submittedAt: "2025-10-14" },
  { id: "m5", title: "PSYC 101 syllabus", course: "PSYC 101", professor: "Angela Brooks", subject: "Liberal Arts", type: "Syllabus", description: "", files: [], link: "https://docs.google.com/document/d/example", submittedAt: "2025-08-25" },
  { id: "m6", title: "MATH 120 homework solutions walkthrough", course: "MATH 120", professor: "Robert Lindqvist", subject: "General Studies", type: "Homework", description: "Worked solutions for homework sets 1 to 5 with explanations.", files: [{ name: "math120-hw1-5.pdf", kind: "external", url: "https://example.com/math120-hw.pdf" }], link: "", submittedAt: "2025-10-01" },
];
