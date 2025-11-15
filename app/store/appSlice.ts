import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';

// --- TYPES ---
export interface Subject {
  id: string;
  name: string;
  color: string;
  progress: number;
  nextRevision: string;
}

export interface Revision {
  id: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  color: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  color: string;
  date: string;
  summary: string;
  type: 'pdf' | 'text' | 'image' | 'audio';
  content?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  color: string;
  questions: QuizQuestion[];
  duration: string;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  score: number | null;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface FlashcardSet {
  id: string;
  title: string;
  subject: string;
  color: string;
  cards: Flashcard[];
}

export interface ChatMessage {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: string;
}

interface AppState {
  subjects: Subject[];
  upcomingRevisions: Revision[];
  lessons: Lesson[];
  quizzes: Quiz[];
  flashcardSets: FlashcardSet[];
  chatMessages: ChatMessage[];
  stats: {
    dailyGoal: { current: number; total: number };
    points: number;
    lessonsStudied: number;
    successRate: number;
    streak: number;
  };
}

// --- INITIAL STATE (MOCK DATA) ---
const initialState: AppState = {
  subjects: [
    { id: '1', name: 'Mathématiques', color: '#3B82F6', progress: 75, nextRevision: '2025-01-15' },
    { id: '2', name: 'Physique', color: '#8B5CF6', progress: 60, nextRevision: '2025-01-16' },
    { id: '3', name: 'Chimie', color: '#EC4899', progress: 85, nextRevision: '2025-01-17' },
    { id: '4', name: 'Histoire', color: '#F59E0B', progress: 50, nextRevision: '2025-01-18' },
  ],
  upcomingRevisions: [
    { id: '1', subject: 'Mathématiques', topic: 'Dérivées et intégrales', date: '2025-01-15', time: '14:00', color: '#3B82F6' },
    { id: '2', subject: 'Physique', topic: 'Électromagnétisme', date: '2025-01-16', time: '10:00', color: '#8B5CF6' },
  ],
  lessons: [
    { id: '1', title: 'Les dérivées et leurs applications', subject: 'Mathématiques', color: '#3B82F6', date: '2025-01-10', summary: 'Concepts clés des dérivées, règles de dérivation et applications pratiques.', type: 'pdf', content: 'Contenu détaillé sur les dérivées...' },
    { id: '2', title: 'Électromagnétisme - Loi de Faraday', subject: 'Physique', color: '#8B5CF6', date: '2025-01-12', summary: 'Induction électromagnétique et applications de la loi de Faraday.', type: 'text', content: 'Contenu détaillé sur la loi de Faraday...' },
    { id: '3', title: 'Réactions d\'oxydoréduction', subject: 'Chimie', color: '#EC4899', date: '2025-01-13', summary: 'Principes des réactions redox et équilibrage des équations.', type: 'image', content: 'Contenu détaillé sur les réactions d\'oxydoréduction...' },
  ],
  quizzes: [
    { id: '1', title: 'Dérivées - Test rapide', subject: 'Mathématiques', color: '#3B82F6', duration: '10 min', difficulty: 'Moyen', score: 85, questions: [
        { id: 'q1', question: 'Quelle est la dérivée de x² ?', options: ['2x', 'x', '2', 'x/2'], correctAnswer: '2x' },
        { id: 'q2', question: 'Quelle est la dérivée de sin(x) ?', options: ['-cos(x)', 'cos(x)', 'tan(x)', '-sin(x)'], correctAnswer: 'cos(x)' },
    ]},
    { id: '2', title: 'Électromagnétisme', subject: 'Physique', color: '#8B5CF6', duration: '15 min', difficulty: 'Difficile', score: null, questions: [
        { id: 'q1', question: 'Qui a formulé les lois de l\'électromagnétisme ?', options: ['Newton', 'Einstein', 'Maxwell', 'Faraday'], correctAnswer: 'Maxwell' },
    ]},
  ],
  flashcardSets: [
    { 
      id: '1', 
      title: 'Formules mathématiques', 
      subject: 'Mathématiques', 
      color: '#3B82F6',
      cards: [
        { id: 'f1-1', question: 'Dérivée de x^n', answer: 'n * x^(n-1)' },
        { id: 'f1-2', question: 'Intégrale de 1/x', answer: 'ln|x| + C' },
        { id: 'f1-3', question: 'Formule quadratique', answer: 'x = [-b ± sqrt(b²-4ac)] / 2a' },
      ]
    },
    { 
      id: '2', 
      title: 'Lois physiques', 
      subject: 'Physique', 
      color: '#8B5CF6',
      cards: [
        { id: 'f2-1', question: 'Deuxième loi de Newton', answer: 'F = ma' },
        { id: 'f2-2', question: 'Loi d\'Ohm', answer: 'V = IR' },
      ]
    },
  ],
  chatMessages: [
    { id: '1', text: 'Bonjour! Je suis votre tuteur IA personnel. Comment puis-je vous aider aujourd\'hui?', isAI: true, timestamp: new Date().toISOString() },
  ],
  stats: {
    dailyGoal: { current: 4, total: 5 },
    points: 1247,
    lessonsStudied: 23,
    successRate: 87,
    streak: 7,
  },
};

// --- SLICE ---
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    addLesson: (state, action: PayloadAction<Lesson>) => {
      state.lessons.unshift(action.payload);
      state.stats.lessonsStudied += 1;
    },
    addChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.chatMessages.push(action.payload);
    },
    finishQuiz: (state, action: PayloadAction<{ quizId: string; score: number }>) => {
      const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
      if (quiz) {
        quiz.score = action.payload.score;
        state.stats.points += Math.round(action.payload.score * 0.5); // Add points based on score
        // Recalculate average success rate
        const completedQuizzes = state.quizzes.filter(q => q.score !== null);
        const totalScore = completedQuizzes.reduce((sum, q) => sum + (q.score || 0), 0);
        state.stats.successRate = Math.round(totalScore / completedQuizzes.length);
      }
    },
    resetState: () => initialState,
  },
});

export const { addLesson, addChatMessage, finishQuiz, resetState } = appSlice.actions;

// --- SELECTORS ---
export const selectSubjects = (state: RootState) => state.app.subjects;
export const selectUpcomingRevisions = (state: RootState) => state.app.upcomingRevisions;
export const selectStats = (state: RootState) => state.app.stats;
export const selectAllLessons = (state: RootState) => state.app.lessons;
export const selectLessonById = (id: string) => (state: RootState) => state.app.lessons.find(l => l.id === id);
export const selectAllQuizzes = (state: RootState) => state.app.quizzes;
export const selectQuizById = (id: string) => (state: RootState) => state.app.quizzes.find(q => q.id === id);
export const selectAllFlashcardSets = (state: RootState) => state.app.flashcardSets;
export const selectFlashcardSetById = (id: string) => (state: RootState) => state.app.flashcardSets.find(s => s.id === id);
export const selectChatMessages = (state: RootState) => state.app.chatMessages;

export default appSlice.reducer;
