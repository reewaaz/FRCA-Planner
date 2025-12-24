// User & Settings
export type ExamType = 'FRCA_PRIMARY' | 'FRCA_FINAL' | 'EDAIC_PART1';

export interface UserSettings {
  name: string;
  examType: ExamType;
  examDate: string;
}

// Curriculum Types
export interface CurriculumItem {
  id: string;
  title: string;
  completed: boolean;
  subtopics?: CurriculumItem[];
}

export interface CurriculumSection {
  id: string;
  title: string;
  topics: CurriculumItem[];
}

// Plan Types
export interface StudySession {
  topic: string;
  duration: string; // e.g., "60 mins"
  method: string; // e.g., "Active Recall", "Textbook", "QBox"
  focus: string; // Specific sub-areas
}

export interface StudyDay {
  day: string;
  sessions: StudySession[];
  notes: string;
}

export interface StudyPlan {
  title: string;
  schedule: StudyDay[];
  createdAt: string;
}

// Quiz Types
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  domain: string;
}

export type ViewState = 'dashboard' | 'syllabus' | 'planner' | 'quiz' | 'resources' | 'settings';