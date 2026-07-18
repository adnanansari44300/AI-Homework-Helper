export type ScreenType = 'login' | 'home' | 'tutor' | 'history' | 'saved' | 'profile' | 'quiz' | 'planner';

export type ActiveTool = 'chat' | 'math' | 'scanner' | 'essay' | 'summary' | 'translator' | 'quiz';

export interface UserProfile {
  name: string;
  email: string;
  gradeLevel: string;
  school: string;
  preferredLanguage: string;
  xpPoints: number;
  streakCount: number;
  isPremium: boolean;
  avatarSeed: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  response: string;
  subject: string;
  timestamp: number;
  isFavorite: boolean;
  toolMode: ActiveTool;
  image?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  subject: string;
  isLearned: boolean;
  isFavorite: boolean;
  createdAt: number;
}

export interface StudyGoal {
  id: string;
  title: string;
  subject: string;
  deadline: string; // ISO date string or formatted date
  isCompleted: boolean;
  notes?: string;
}

export interface QuizQuestion {
  id: number;
  type: 'mcq' | 'boolean' | 'blank';
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface KotlinFile {
  name: string;
  path: string;
  content: string;
  language: string;
}

export const SUBJECT_OPTIONS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
  "Urdu",
  "History",
  "Geography",
  "Economics",
  "Business",
  "Accounting",
  "Statistics",
  "Programming",
  "General Knowledge"
];

export const GRADE_LEVEL_OPTIONS = [
  "Grade 1-5 (Primary)",
  "Grade 6-8 (Middle School)",
  "Grade 9-10 (High School)",
  "Grade 11-12 (College/A-Levels)",
  "University / Higher Education"
];
