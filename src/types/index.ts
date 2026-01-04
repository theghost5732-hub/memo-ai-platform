// ============ MEMO AI Type Definitions ============

// ============ User Types ============
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'parent' | 'admin';
  level: StudentLevel;
  grade: Grade;
  xp: number;
  coins: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
  updatedAt: string;
}

export type StudentLevel = 'beginner' | 'intermediate' | 'advanced';
export type Grade = 'kg1' | 'kg2' | 'grade1' | 'grade2' | 'grade3' | 'grade4' | 'grade5' | 'grade6' | 'prep1' | 'prep2' | 'prep3' | 'sec1' | 'sec2' | 'sec3';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  language: 'ar' | 'en';
  voiceEnabled: boolean;
  soundEffects: boolean;
  notifications: boolean;
  preferredModel: AIModel | 'auto';
  focusModeMusic: 'lofi' | 'classical' | 'nature' | 'none';
}

export interface UserStats {
  totalStudyTime: number; // in minutes
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  examsCompleted: number;
  averageScore: number;
  subjectStats: Record<Subject, SubjectStats>;
}

export interface SubjectStats {
  questionsAnswered: number;
  correctRate: number;
  studyTime: number;
  lastStudied: string;
}

// ============ AI & Chat Types ============
export type AIModel = 'groq' | 'gemini' | 'openrouter' | 'openai';

export interface Message {
  id: string;
  chatId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  model?: AIModel;
  timestamp: Date;
  attachments?: Attachment[];
  metadata?: MessageMetadata;
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'file';
  url: string;
  name: string;
  size: number;
}

export interface MessageMetadata {
  subject?: Subject;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isCorrect?: boolean;
  xpEarned?: number;
  processingTime?: number;
}

export interface Chat {
  id: string;
  userId: string;
  teacherId?: string;
  title: string;
  subject?: Subject;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface AIResponse {
  text: string;
  model: AIModel;
  processingTime: number;
  confidence?: number;
}

// ============ Subject Types ============
export type Subject = 
  | 'arabic'
  | 'english'
  | 'math'
  | 'science'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'history'
  | 'geography'
  | 'quran'
  | 'general';

export const SubjectInfo: Record<Subject, { name: string; icon: string; color: string }> = {
  arabic: { name: 'اللغة العربية', icon: '📖', color: '#10B981' },
  english: { name: 'English', icon: '🔤', color: '#3B82F6' },
  math: { name: 'الرياضيات', icon: '📐', color: '#8B5CF6' },
  science: { name: 'العلوم', icon: '🔬', color: '#F59E0B' },
  physics: { name: 'الفيزياء', icon: '⚡', color: '#EC4899' },
  chemistry: { name: 'الكيمياء', icon: '🧪', color: '#06B6D4' },
  biology: { name: 'الأحياء', icon: '🧬', color: '#22C55E' },
  history: { name: 'التاريخ', icon: '📜', color: '#A855F7' },
  geography: { name: 'الجغرافيا', icon: '🌍', color: '#0EA5E9' },
  quran: { name: 'القرآن الكريم', icon: '📿', color: '#14B8A6' },
  general: { name: 'عام', icon: '💡', color: '#6366F1' },
};

// ============ Teacher Types ============
export interface Teacher {
  id: string;
  name: string;
  subject: Subject;
  avatar: string;
  description: string;
  personality: string;
  voiceId: string; // ElevenLabs voice ID
  systemPrompt: string;
  isAvailable: boolean;
  rating: number;
  lessonsCount: number;
}

export interface Lesson {
  id: string;
  teacherId: string;
  subject: Subject;
  title: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  createdAt: string;
}

// ============ Gamification Types ============
export interface XPEvent {
  type: 'question_correct' | 'question_wrong' | 'lesson_complete' | 'exam_complete' | 'streak_bonus' | 'challenge_complete';
  amount: number;
  timestamp: Date;
  description: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'special';
  subject?: Subject;
  requirements: ChallengeRequirement[];
  rewards: Reward;
  startDate: string;
  endDate: string;
  isCompleted: boolean;
  progress: number;
}

export interface ChallengeRequirement {
  type: 'questions' | 'time' | 'streak' | 'accuracy';
  target: number;
  current: number;
}

export interface Reward {
  xp: number;
  coins: number;
  badge?: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  xp: number;
  rank: number;
  grade: Grade;
}

// ============ Mistake Bank Types ============
export interface Mistake {
  id: string;
  userId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
  subject: Subject;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  reviewCount: number;
  lastReviewed?: string;
  nextReview: string; // Spaced repetition
  isResolved: boolean;
  createdAt: string;
}

// ============ Study Planner Types ============
export interface StudyPlan {
  id: string;
  userId: string;
  title: string;
  examDate?: string;
  subjects: StudyPlanSubject[];
  dailyGoalMinutes: number;
  createdAt: string;
  isActive: boolean;
}

export interface StudyPlanSubject {
  subject: Subject;
  topics: string[];
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  completedHours: number;
}

export interface StudySession {
  id: string;
  userId: string;
  subject: Subject;
  topic?: string;
  duration: number; // in minutes
  type: 'focus' | 'pomodoro' | 'lesson' | 'exam';
  startedAt: string;
  endedAt?: string;
  xpEarned: number;
}

// ============ Exam Types ============
export interface Exam {
  id: string;
  userId: string;
  title: string;
  subject: Subject;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: ExamQuestion[];
  timeLimit: number; // in minutes
  score?: number;
  startedAt?: string;
  completedAt?: string;
  isCompleted: boolean;
}

export interface ExamQuestion {
  id: string;
  type: 'mcq' | 'essay' | 'fill_blank' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
  isCorrect?: boolean;
  points: number;
  explanation?: string;
}

// ============ Magic Notes Types ============
export interface MagicNote {
  id: string;
  userId: string;
  chatId: string;
  title: string;
  subject: Subject;
  content: string; // Markdown
  keyPoints: string[];
  formulas?: string[];
  createdAt: string;
  updatedAt: string;
}

// ============ Parent Dashboard Types ============
export interface ParentReport {
  studentId: string;
  studentName: string;
  period: 'daily' | 'weekly' | 'monthly';
  studyTime: number;
  subjectsStudied: Subject[];
  questionsAnswered: number;
  accuracy: number;
  streakDays: number;
  xpEarned: number;
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}

// ============ Notification Types ============
export interface Notification {
  id: string;
  userId: string;
  type: 'streak' | 'achievement' | 'reminder' | 'challenge' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  action?: {
    type: 'navigate' | 'external';
    url: string;
  };
}