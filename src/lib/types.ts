export type Review = {
  id: string;
  professorId: string;
  course: string;
  rating: number; // 1-5
  difficulty: number | null; // 1-5
  wouldTakeAgain: boolean | null; // Yes => true, No/Maybe => false
  wouldTakeAgainLabel: string; // "Yes" | "Maybe" | "No" | ""
  comment: string;
  semester: string;
  submittedAt: string | null; // ISO date
};

export type Professor = {
  id: string;
  slug: string;
  name: string;
  college: string;
  department: string;
  courses: string[];
  bio: string;
  email: string;
};

export type ProfessorStats = {
  reviewCount: number;
  averageRating: number | null;
  averageDifficulty: number | null;
  wouldTakeAgainPercent: number | null;
};

export type ProfessorWithStats = Professor & { stats: ProfessorStats };

export type ProfessorProfile = ProfessorWithStats & { reviews: Review[] };

export type Update = {
  id: string;
  title: string;
  date: string | null; // ISO date
  body: string;
  link: string;
  category: string;
  pinned: boolean;
};
